const express = require('express');
const router = express.Router();
const store = require('../dataStorage');

const crawler = require('../crawler');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Bitcoin value',
        btcToUsd: store.getBestBitcoinToUsd(),
        usdToEur: store.getBestUsdToEur(),
        btcToEur: store.getBestBitcoinToEur(),
        btcToUsdSourcesInfo: store.getBitcoinToUsdSourcesInfo(),
        usdToEurSourcesInfo: store.getUsdToEurSourcesInfo(),
        btcToEurSourcesInfo: store.getBitcoinToEurSourcesInfo()
    });
});

/* run all modules crawl */
router.post('/crawl/all', () => {
    crawler.crawlAll();
    res.sendStatus(200);
});

/* run crawl by the module name */
router.post('/crawl/:moduleName', (req, res, next) => {
    crawler.crawl(req.params.moduleName);
    res.sendStatus(200);
});

module.exports = router;
