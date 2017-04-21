const colors = require('colors');
const request = require('request');
const cheerio = require('cheerio');

class Module {

    static parse() {
        return new Promise((resolveBase, reject) => {
            let result = {
                bitcoinToUsd: 0,
                bitcoinToEur: 0,
                usdToEur: 0
            };

            let btcToEurPromise = new Promise((resolve, reject) => {
                request('http://markets.businessinsider.com/currencies/BTC-EUR',
                    (error, response, body) => {
                        if (error) {
                            return reject(error);
                        }

                        if (!response || response.statusCode !== 200) {
                            return reject({message: `response error: ${response.statusCode}`})
                        }

                        let pageBody = cheerio.load(body);
                        result.bitcoinToEur = parseFloat(pageBody('.push-data').eq(0).text().replace(',', ''));
                        return resolve();
                    });
            });

            let btcToUsdPromise = new Promise((resolve, reject) => {
                request('http://markets.businessinsider.com/currencies/BTC-USD',
                    (error, response, body) => {
                        if (error) {
                            return reject(error);
                        }

                        if (!response || response.statusCode !== 200) {
                            return reject({message: `response error: ${response.statusCode}`})
                        }

                        let pageBody = cheerio.load(body);
                        result.bitcoinToUsd = parseFloat(pageBody('.push-data').eq(0).text().replace(',', ''));
                        return resolve();
                    });
            });

            let usdToEurPromise = new Promise((resolve, reject) => {
                request('http://markets.businessinsider.com/currencies/EUR-USD',
                    (error, response, body) => {
                        if (error) {
                            return reject(error);
                        }

                        if (!response || response.statusCode !== 200) {
                            return reject({message: `response error: ${response.statusCode}`})
                        }

                        let pageBody = cheerio.load(body);
                        result.usdToEur = 1 / parseFloat(pageBody('.push-data').eq(0).text().replace(',', ''));
                        return resolve();
                    });
            });

            Promise.all([btcToEurPromise, btcToUsdPromise, usdToEurPromise]).then(() => {
                resolveBase(result);
            })
        });

    }
}

/**
 * Module name.
 */
Module.moduleName = 'businessinsider';
Module.expires = 1 * 60 * 1000; // (minutes * seconds * milliseconds) in milliseconds

module.exports = Module;
