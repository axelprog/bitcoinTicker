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
}

module.exports = new DataStorage();