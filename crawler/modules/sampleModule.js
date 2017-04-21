const colors = require('colors');

class Module {
    /**
     * Base parse method.  Promise must return object in format
     * { bitcoinToUsd: 1, bitcoinToEur: 2, usdToEur: 3}
     * @returns {Promise}
     */
    static parse() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    bitcoinToUsd: 0,
                    bitcoinToEur: 0,
                    usdToEur: 0
                });
            }, 3000);
        });

    }
}

/**
 * Module name.
 */
Module.moduleName = 'sampleModule';
Module.expires = 4000; // in milliseconds

module.exports = Module;