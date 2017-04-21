# bitcoinTicker

A simple demo for crawler information with a module system of crawlers and data storage.   

#### install & run
`npm install`

`npm run start`

Base page is opens by address http://localhost:3000/


####.env example
You can create `.env` file for set base environments 
```
DebugInfo=true
CrawlerModules=./crawler/modules
```
_DebugInfo_ - allow to show more logs

_CrawlerModules_ - sets a path to crawler modules


####Storage module interface
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

####crawler module interface
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
```
`parse` must returns a promise that must resolves with an objeckt in the next format
`{ bitcoinToUsd: 1, bitcoinToEur: 2, usdToEur: 3 }`