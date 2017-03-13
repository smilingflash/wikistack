var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

router.get('/', function(req, res, next) {
    Page.findAll()
    .then(function(pages){
        // res.send(pages);
        res.render('index', pages)
    })
    .catch(next);
});

router.get('/add', function(req, res, next) {
    res.render('addpage');
});

router.get('/:urlTitle', function(req, res, next){
    // use Page model to find page instance by urlTitle
    Page.findOne({
        where: {
            urlTitle: req.params.urlTitle
        }
    })
    .then(function(foundPage){
        // res.json(foundPage);
        res.render('wikipage', {
            title: foundPage.title,
            urlTitle: foundPage.urlTitle,
            content: foundPage.content,
            name: foundPage.name
        })
    })
    .catch(next);
});

router.post('/', function(req, res, next) {
    var page = Page.build({
        title: req.body.title,
        content: req.body.content
    });

    // var user = User.build({
    //     name: req.body.name,
    //     email: req.body.email
    // });

    page.save()
    .then(function(savedPage){
        res.redirect(savedPage.route);  // route virtual FTW
    })
    .catch(next);

    // res.json(page);
});

module.exports = router;