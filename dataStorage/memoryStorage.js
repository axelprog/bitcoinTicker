/**
 * simple data storage. It stores data in memory. It is not a good solution for real project, but a quick for demo.
 * iT can't store data between sessions. Use some database for better operations with the data
 */
class MemoryStorage {
    /**
     * initiate instance
     */
    constructor(){
        this.init();
    }

    /**
     * reinitiate the storage
     */
    init() {
        this.storage = {}
    }

    /**
     * update data from the source
     * @param {string }name - a name of the source
     * @param {number} bitcoinToUsd - value of bitcoin to us dollar
     * @param {number} bitcoinToEur - value of bitcoin to euro
     * @param {number} usdToEur - value of us dollar to euro
     */
    setDataBySource(name, bitcoinToUsd, bitcoinToEur, usdToEur) {
        this.storage[name] = {bitcoinToUsd, bitcoinToEur, usdToEur};
    }

    /**
     * returns the data was associated with source
     * @param {string} name - a name of the source
     * @returns {*} - the data was associated with source
     */
    getDataBySource(name) {
        return this.storage[name];
    }

    /**
     * returns best value of bitcoin to us dollar
     * @returns {number}
     */
    getBestBitcoinToUsd() {
        return Math.max(...Object.values(this.storage).map(item => item.BitcoinToUsd));
    }

    /**
     * returns best value of bitcoin to euro
     * @returns {number}
     */
    getBestBitcoinToEur() {
        return Math.max(...Object.values(this.storage).map(item => item.BitcoinToEur));
    }

    /**
     * returns best value of us dollar to euro
     * @returns {number}
     */
    getBestUsdToEur() {
        return Math.max(...Object.values(this.storage).map(item => item.UsdToEur));
    }
}

module.exports = new MemoryStorage();
