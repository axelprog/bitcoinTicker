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
            console.log(colors.blue('Loaded crawler modules ', Object.keys(this.moduleLib).length));
            Object.keys(this.moduleLib).forEach((item) => {
                console.log(colors.blue(colors.underline('\tmodule name'), item));
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
            const child = child_process.fork(module.path);
            child.send({start: true});
            child.on('message', (data) => {
                console.log(`------>${JSON.stringify(data)}`);
            })
            // module.parse();
        }
    }
}


module.exports = Crawler;