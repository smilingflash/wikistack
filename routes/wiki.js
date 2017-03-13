var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/wiki', function(req, res, next) {
    res.redirect('/');
});

router.get('/wiki/add', function(req, res, next) {
    res.render('addpage');
});

router.post('/wiki', function(req, res, next) {
    var page = Page.build({
        title: Page.title,
        content: Page.content
    });

    page.save();        // '.save' returns a promise or it can take a callback
    res.redirect('/');  // make sure to redirect only AFTER we save!
});

module.exports = router;