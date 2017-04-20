const fs = require('fs');
const path = require('path');
const colors = require('colors');
const child_process = require('child_process');
const storage = require('../dataStorage');
const MessageType = require('./moduleMessage').MessageType;

const needLog = process.env.DebugInfo; //log level from .env

/*environments*/
const moduleStorage = process.env.CrawlerModules ? path.join(__dirname, '../', process.env.CrawlerModules) : path.join(__dirname, './modules');
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
            const isCrawlModule = splitName.length > 0 && splitName[splitName.length - 1] === 'js';

            if (isCrawlModule) {
                splitName.pop(); //remove file extension
                const moduleName = splitName.join('.');

                const module = require(path.join(moduleStorage, moduleName));
                let name = module.moduleName;
                if (!name || this.moduleLib[name]) {
                    name = moduleName;
                }
                this.moduleLib[name] = {
                    path: path.join(moduleStorage, moduleName)
                };
            }
        });

        if (needLog) {
            console.log(colors.cyan('Loaded crawler modules ', Object.keys(this.moduleLib).length));
            Object.keys(this.moduleLib).forEach((item) => {
                console.log(colors.cyan(colors.underline('\tmodule name'), item));
            });
        }

        this.crawlAll();
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
        if (module) {
            // const child = child_process.fork(module.path);
            const child = child_process.fork(path.join(__dirname, 'baseWorker'), [module.path]);

            if (needLog) {
                console.log(`Module ${moduleName} was ran`.cyan);
            }

            child.on('message', (message) => {
                if (message.type === MessageType.data) {
                    storage.updateData(message.name, message.data.bitcoinToUsd, message.data.bitcoinToEur, message.data.usdToEur);

                    if (needLog) {
                        console.log(`Log from storage ${storage.getBestBitcoinToEur()} ${storage.getBestBitcoinToUsd()} ${storage.getBestUsdToEur()}`.magenta);
                    }
                }

                if (needLog) {
                    console.log(`Log from module`.yellow, message.name.underline, JSON.stringify(message).green);
                }
            });

            child.on('error', (data) => {
                console.error(`Module ${moduleName} return error ${JSON.stringify(data)}`.red);
            });

            if (needLog) {
                child.on('disconnect', () => {
                    console.log(`Module ${moduleName} has disconnected`.cyan);
                });
            }

        }
    }
}


module.exports = Crawler;