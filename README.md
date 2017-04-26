# bitcoinTicker

A simple demo for crawler information with a module system of crawlers and data storage. 
It uses a simple memory storage for the demo of storage module. Also it uses simple location.reload() for the index page. 
It isn't a good solution but it is quick for the demonstration

### install & run
`npm install` - for install all the packages  

`npm run start` - for run the appilcation 

Base page is opened by an address http://localhost:3000/


### .env example
You can create `.env` file for set base environments (you can rename `.sampleEnv` to `.env`)
```
DebugInfo=true
CrawlerModules=./crawler/modules
ThreadWatcherTime = 5000
FreezeTime = 5000
```
_DebugInfo_ - allow to show more logs

_CrawlerModules_ - sets a path to crawler modules

_FreezeTime_ - set freeze time for a crawl thread in milliseconds

_ThreadWatcherTime_ - set time for time watcher cycle

### Storage module interface
```javascript

class Storage {
    init(){}
    setDataBySource(name, BitcoinToUsd, BitcoinToEur, UsdToEur){}
    getDataBySource(name){}
    getBestBitcoinToUsd(){}
    getBestBitcoinToEur(){}
    getBestUsdToEur(){}
    getSourceCount(){}
    getBitcoinToUsdSources(){}
    getUsdToEurSources(){}
    getBitcoinToEurSources(){}
}
```

### Crawler module interface
The application searches and loads modules automatically. Every module must contains the next methods

```javascript
class Module {
    static parse() {
        return new Promise((resolve, reject) => {
            resolve({
               bitcoinToUsd: 1,
               bitcoinToEur: 2,
               usdToEur: 3
            });
        });
    }
}

Module.moduleName = 'sampleModule';
Module.expires = 6000;
```
`parse` is the main method for the parsing sources. It must returns a promise that must resolves with an objeckt in the next format
`{ bitcoinToUsd: 1, bitcoinToEur: 2, usdToEur: 3 }`

`moduleName` - is field contain module name. It must be unique because use as a module id.

 `expires` - time of an data expiration for this module in miliseconds 

Also you can copy and modify file `sampleModule.js` 



##### main task 

Develop a simple bitcoin realtime ticker in GoLang that shows in a single text line bitcoin value in Euro based on auto selection between 2 or more bitcoin price feeds and 2 and more currency rates feeds.
Feel free to use any feed you like. Completed code we expect to see in GitHub or BitBucket.

Example output line:BTC/USD: 600   EUR/USD: 1.05   BTC/EUR: 550 Active sources: BTC/USD (3 of 3)  EUR/USD (2 of 3)
