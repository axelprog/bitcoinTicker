const colors = require('colors');
const request = require('request');
const cheerio = require('cheerio');

class Module {
    /**
     * Base parse method.  Promise must return object in format
     * { bitcoinToUsd: 1, bitcoinToEur: 2, usdToEur: 3}
     * @returns {Promise}
     */
    static parse() {
        return new Promise((resolve, reject) => {
            let result = {
                bitcoinToUsd: 0,
                bitcoinToEur: 0,
                usdToEur: 0
            };

            request('https://cex.io/',
                (error, response, body) => {
                    if (error) {
                        return reject(error);
                    }

                    if (!response || response.statusCode !== 200) {
                        return reject({message: `response error: ${response.statusCode}`})
                    }

                    let pageBody = cheerio.load(body);
                    result.bitcoinToUsd = parseFloat(pageBody('#ticker-BTC-USD-price').eq(0).text());
                    result.bitcoinToEur =  parseFloat(pageBody('#ticker-BTC-EUR-price').eq(0).text());
                    return resolve(result);
                });
        });

    }
}

/**
 * Module name.
 */
Module.moduleName = 'cexio';
Module.expires = 1 * 60 * 1000; // (minutes * seconds * milliseconds) in milliseconds

module.exports = Module;