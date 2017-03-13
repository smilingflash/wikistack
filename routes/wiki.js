var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/wiki', function(req, res, next) {
  res.redirect('/');
});

router.post('/wiki', function(req, res, next) {
  res.send('got to POST /wiki/');
});

router.get('/wiki/add', function(req, res, next) {
  res.render('addpage');
});

module.exports = router;