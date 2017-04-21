const fs = require('fs');
const path = require('path');
const colors = require('colors');
const child_process = require('child_process');
const storage = require('../dataStorage');
const MessageType = require('./moduleMessage').MessageType;

const needLog = process.env.DebugInfo || false; //log level from .env

/*environments*/
const moduleStorage = process.env.CrawlerModules ? path.join(__dirname, '../', process.env.CrawlerModules) : path.join(__dirname, './modules');

/**
 * Thread status enum
 * @type {{active: string, inactive: string, broken: string, done: string}}
 */
const threadStatus = {
    active: 'active', //thread running now
    inactive: 'inactive', //thread never ran
    broken: 'broken', //thread have error
    freeze: 'freeze', //thread was killed after freeze
    done: 'done' //thread successfully done his work
};


/**
 * the main crawler for currency value
 */
class Crawler {
    constructor() {
        this.reloadModules();
    }

    /**
     * dynamically reload modules for the crawler
     */
    reloadModules() {
        this.moduleLib = {};

        fs.readdirSync(moduleStorage).forEach((module) => {
            const splitName = module.split(".");
            const isCrawlModule = splitName.length > 0 && splitName[splitName.length - 1] === 'js'; // check the file is a js-file

            if (isCrawlModule) {
                splitName.pop(); //remove file extension
                const moduleName = splitName.join('.');

                const module = require(path.join(moduleStorage, moduleName)); // load module
                let name = module.moduleName;
                if (!name || this.moduleLib[name]) {
                    name = moduleName;
                }
                this.moduleLib[name] = { //save the module information
                    name: name,
                    path: path.join(moduleStorage, moduleName),
                    expire: module.expires,
                    status: threadStatus.inactive,
                    lastParse: null,
                    lastStart: null
                };
            }
        });

        //logging about loaded modules
        console.log(colors.cyan('Loaded crawler modules ', Object.keys(this.moduleLib).length));
        Object.keys(this.moduleLib).forEach((item) => {
            console.log(colors.cyan(colors.underline('\tmodule name'), item));
        });

        // this.crawlAll(); // run crawling after reload
        this.initThreadWatcher();
    }

    /**
     * method that starts a cycle of the source processing
     */
    initThreadWatcher() {
        if (this.threadWatcher) {
            this.stopThreadWatcher();
        }

        const freezeeTime = process.env.FreezeTime || 10000;

        this.threadWatcher = setInterval(() => {
            Object.values(this.moduleLib).forEach((module) => {
                switch (module.status) {
                    case threadStatus.active:
                        if ((Date.now() - module.lastStart ) > freezeeTime) {
                            module.thread && module.thread.kill('SIGHUP');
                            module.thread = null;
                            module.status = threadStatus.freeze;

                            console.warn(`Module ${module.name} was killed after freeze`);
                        }
                        break;

                    case threadStatus.inactive:
                        this.crawl(module.name);
                        break;

                    case threadStatus.freeze:
                    case threadStatus.broken:
                        this.crawl(module.name);
                        break;

                    case threadStatus.done:
                        if ((Date.now() - module.lastParse ) > module.expire) {
                            this.crawl(module.name);
                        }
                        break;
                }
            })
        }, process.env.ThreadWatcherTime || 5000);
    }

    /**
     * method for stop a cycle of the source procession
     */
    stopThreadWatcher() {
        clearInterval(this.threadWatcher);
    }

    /**
     * starts a crawling process for all the modules
     */
    crawlAll() {
        Object.keys(this.moduleLib).forEach((moduleName) => {
            this.crawl(moduleName);
        });
    }

    /**
     * starts a crawling process for one module
     * @param moduleName - aname of module for the crawling
     */
    crawl(moduleName) {
        const module = this.moduleLib[moduleName];
        if (module && module.status !== threadStatus.active) {

            try {
                const child = child_process.fork(path.join(__dirname, 'baseWorker'), [module.path]); // create a new thread
                module.status = threadStatus.active;
                module.lastStart = Date.now();
                module.thread = child;

                if (needLog) {
                    console.log(`Module ${moduleName} was run`.cyan);
                }
                this.subscribeThread(child, module);

            } catch (error) {
                module.status = threadStatus.broken;
                module.thread = null;

                if (needLog) {
                    console.log(`Module ${moduleName} was broken: ${JSON.stringify(error)}`.red);
                }
            }
        }
    }

    /**
     * subscribes for messages from the child thread
     * @param {object} child -  instance of child to subscribe
     * @param moduleName - name of module
     */
    subscribeThread(child, module) {
        const moduleName = module.name;
        //subscribes to messages
        child.on('message', (message) => {
            if (message.type === MessageType.data) {
                // if is data message then store it
                storage.updateData(message.name, message.data.bitcoinToUsd, message.data.bitcoinToEur, message.data.usdToEur);

                if (needLog) {
                    console.log(`Log from storage ${storage.getBestBitcoinToEur()} ${storage.getBestBitcoinToUsd()} ${storage.getBestUsdToEur()}`.magenta);
                }
            }

            if (needLog) {
                console.log(`Log from module`.yellow, message.name.underline, JSON.stringify(message).green);
            }
        });

        //subscribes to error messages
        child.on('error', (data) => {
            console.error(`Module ${moduleName} return error ${JSON.stringify(data)}`.red);
            module.status = threadStatus.broken;
        });
        child.on('disconnect', () => {
            module.status = threadStatus.done;
            module.thread = null;
            module.lastParse = Date.now();

            if (needLog) { //gog for the module disconnection
                console.log(`Module ${moduleName} has been disconnected`.cyan);
            }
        });
    }
}


module.exports = Crawler;