const express = require('express');
const router = express.Router();

const crawler = require('../crawler');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/crawl/all', () => {
    crawler.crawlAll();
});

module.exports = router;
