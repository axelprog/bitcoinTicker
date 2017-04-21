//it module for store data. I use the simple memory storage like a demo module
const storage = require('./memoryStorage');

/**
 * data storage with joinable store modules
 */
class DataStorage {
    constructor(){
        this.storage = storage;
        this.initStorage();
    }

    /**
     * initiates storage
     */
    initStorage(){
        this.storage.init();
    }

    /**
     * update data from the source
     * @param {string }name - a name of the source
     * @param {number} bitcoinToUsd - value of bitcoin to us dollar
     * @param {number} bitcoinToEur - value of bitcoin to euro
     * @param {number} usdToEur - value of us dollar to euro
     */
    updateData(name, bitcoinToUsd, bitcoinToEur, usdToEur) {
        this.storage.setDataBySource(name, bitcoinToUsd, bitcoinToEur, usdToEur);
    }

    /**
     * returns best value of bitcoin to us dollar
     * @returns {number}
     */
    getBestBitcoinToUsd() {
        return this.storage.getBestBitcoinToUsd();
    }

    /**
     * returns best value of bitcoin to euro
     * @returns {number}
     */
    getBestBitcoinToEur() {
        return this.storage.getBestBitcoinToEur();
    }

    /**
     * returns best value of us dollar to euro
     * @returns {number}
     */
    getBestUsdToEur() {
        return this.storage.getBestUsdToEur();
    }

    /**
     * return info about sources for value of  bitcoin to usd
     * @returns {string} - info
     */
    getBitcoinToUsdSourcesInfo(){
        return `${storage.getBitcoinToUsdSources()} of ${storage.getSourceCount()}`;
    }

    /**
     * return info about sources for value of usd to euro
     * @returns {string} - info
     */
    getUsdToEurSourcesInfo(){
        return `${storage.getUsdToEurSources()} of ${storage.getSourceCount()}`;
    }

    /**
     * return info about sources for value of bitcoin to euro
     * @returns {string} - info
     */
    getBitcoinToEurSourcesInfo(){
        return `${storage.getBitcoinToEurSources()} of ${storage.getSourceCount()}`;
    }
}

module.exports = new DataStorage();