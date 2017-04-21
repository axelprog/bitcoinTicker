# bitcoinTicker

npm run start

http://localhost:3000/

**.env example**

DebugInfo=true

CrawlerModules=./crawler/modules

**storage interface**
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
**crawler module interface**