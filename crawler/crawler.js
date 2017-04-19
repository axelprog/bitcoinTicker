let fs = require('fs');
let path = require('path');
var colors = require('colors');

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
                this.moduleLib[module.name || moduleName] = module;
            }
        });

        if (process.env.LogLevel === 'debug') {
            console.info(colors.blue('Loaded crawler modules ', Object.keys(this.moduleLib).length));
            Object.keys(this.moduleLib).forEach((item) => {
                console.info(colors.blue(colors.underline('\tmodule name'), item));
            });
        }
    }
}


module.exports = Crawler;