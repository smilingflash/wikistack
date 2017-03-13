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

// router.post('/wiki', function(req, res, next) {
//     res.send('got to POST /wiki/');
// });

router.get('/wiki/add', function(req, res, next) {
    res.render('addpage');
});

router.post('/wiki', function(req, res, next) {

    // STUDENT ASSIGNMENT:
    // add definitions for `title` and `content`

    var page = Page.build({
        title: Page.title,
        content: Page.content
    });

    // STUDENT ASSIGNMENT:
    // make sure we only redirect *after* our save is complete!
    // note: `.save` returns a promise or it can take a callback.
    page.save()
        // -> after save -> res.redirect('/');
    res.redirect('/')
});

module.exports = router;