const fs = require('fs');
const path = require('path');
const colors = require('colors');
const child_process = require('child_process');

/*environments*/
const moduleStorage = process.env.CrawlerModules ? path.join(__dirname, '../', process.env.CrawlerModules) : path.join(__dirname, './modules');
/**
 * main crawler for currency value
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

        if (process.env.DebugInfo) {
            console.log(colors.cyan('Loaded crawler modules ', Object.keys(this.moduleLib).length));
            Object.keys(this.moduleLib).forEach((item) => {
                console.log(colors.cyan(colors.underline('\tmodule name'), item));
            });
        }

        this.crawlAll();
    }

    crawlAll() {
        Object.keys(this.moduleLib).forEach((moduleName) => {
            this.crawl(moduleName);
        });
    }

    crawl(moduleName) {
        const module = this.moduleLib[moduleName];
        if (module) {
            // const child = child_process.fork(module.path);
            const child = child_process.fork( path.join(__dirname, 'baseWorker'), [module.path]);

            if (process.env.DebugInfo) {
                console.log(`Module ${moduleName} was ran`.cyan);
            }

            child.on('message', (data) => {
                console.log(`Log from module`.yellow, data.name.underline, JSON.stringify(data).green);
            });

            child.on('error', (data) => {
                console.error(`Module ${moduleName} return error ${JSON.stringify(data)}`.red);
            });

            if (process.env.DebugInfo) {
                child.on('disconnect', () => {
                    console.log(`Module ${moduleName} has disconnected`.cyan);
                });
            }

        }
    }
}


module.exports = Crawler;