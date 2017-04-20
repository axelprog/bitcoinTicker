# bitcoinTicker

npm run start

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
}
**crawler module interface**