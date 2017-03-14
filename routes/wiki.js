'use strict';

var express = require('express');
var router = express.Router();
var models = require('../models'); // makes our models module available to the router
var Page = models.Page;
var User = models.User;
module.exports = router;


// GET /wiki
router.get('/', function(req, res, next) {
    Page.findAll({})
        .then(function(thePages) { // thePages is an arbitrary variable name passed in from the sequelize query
            res.render('index', {
                pages: thePages // pages is the pages table in our database. "pages" is also the object that we'll be referencing with nunjucks
            })
        })
        .catch(next);
});

// POST /wiki
router.post('/', function(req, res, next) {

    User.findOrCreate({
            where: {
                email: req.body.email,
                name: req.body.name
            }
        })
        // when using.then, you'll be receiving an an array of two values: [pageThatWasFoundOrCreated, createdBoolean]
        // .spread is used when you're expecting multiple values from an array back and spreads those values out as multiple parameters
        .spread(function(user, wasCreatedBool) { // receiving an array of two values: [pageThatWasFoundOrCreated, createdBoolean]

            return Page.create(req.body)
                .then(function(page) {
                    return page.setAuthor(user); // this calls the relationship method, Page.belongsTo()
                });
        })
        .then(function(createdPage) {
            res.redirect(createdPage.route);
        })
        .catch(next);
});


//     // title, content, status
//     var newPage = Page.build(req.body); // creates a new Page instance with the information created from the form

//     newPage.save() //take this object instance that I just built out of this model and put the information into the database. This is asynchronous and creates a promise!
//         .then(function(savedPage) {
//             res.redirect('savedPage.route'); // when a page gets saved correctly, it'll redirect to our /wiki page
//         })
//         .catch(next) // if it catches an err, it'll catch the err and hand it the next error handling middleware

// });

router.get('/search', function(req, res, next) {

    Page.findByTag(req.query.search)
        .then(function(pages) {
            res.render('index', {
                pages: pages
            });
        })
        .catch(next);

});

router.post('/:urlTitle', function(req, res, next) {

    Page.update(req.body, {
            where: {
                urlTitle: req.params.urlTitle
            },
            returning: true
        })
        .spread(function(updatedRowCount, updatedPages) { //all updated pages are returned. We will only be looking at one of them
            res.redirect(updatedPages[0].route);
            //alternatively we could do a findAll after the update instead of using `returning` keyword
        })
        .catch(next);

});

router.get('/:urlTitle/delete', function(req, res, next) {

    Page.destroy({
            where: {
                urlTitle: req.params.urlTitle
            }
        })
        .then(function() {
            res.redirect('/wiki');
        })
        .catch(next);

});

//GET /wiki/add
router.get('/add', function(req, res) {
    res.render('addpage');
});

function generateError(message, status) {
    let err = new Error(message);
    err.status = status;
    return err;
}


// /wiki/Javascript this route needs to be added below add because the router might think "/add" is a :urlTitle params
router.get('/:urlTitle', function(req, res, next) {

    Page.findOne({
            where: {
                urlTitle: req.params.urlTitle
            },
            include: [
                { model: User, as: 'author' }
            ]
        })
        .then(function(page) {
            if (page === null) {
                throw generateError('No page found with this title', 404);
            } else {
                res.render('wikipage', {
                    page: page
                });

            }
        })
        .catch(next);

    //     return page.getAuthor() // this method comes from the Pages.belongsTo() association method and retuns our user author.
    //         .then(function() {
    //             page.author = author;
    //             res.render('wikipage', {
    //                 page: page
    //             })
    //         });
    // })
    // .catch(function(err) { // can also just write .catch(next);
    //     next(err);
    // });
});

router.get('/:urlTitle/edit', function(req, res, next) {

    Page.findOne({
            where: {
                urlTitle: req.params.urlTitle
            },
            include: [
                { model: User, as: 'author' }
            ]
        })
        .then(function(page) {
            if (page === null) {
                //to show you sendStatus in contrast to using the error handling middleware above
                res.sendStatus(404);
            } else {
                res.render('editpage', {
                    page: page
                });
            }
        })
        .catch(next);


});

router.get('/:urlTitle/similar', function(req, res, next) {
    Page.findOne({ // this is Sequelize!
            where: {
                urlTitle: req.params.urlTitle
            }
        })
        .then(function(page) {
            if (page === null) {
                return next(new Error('That page was not found!'));
            }
            return page.findSimilar() //findSimilar() is the instance method that we wrote in our Page model object that returns a promise
        })
        .then(function(similarPages) {
            res.render('index', {
                pages: similarPages
            })
        })
        .catch(next);
});

// WORKSHOP CODE

// var express = require('express');
// var router = express.Router();
// var models = require('../models');
// var Page = models.Page;
// var User = models.User;

// router.get('/', function(req, res, next) {
//     Page.findAll()
//     .then(function(pages){
//         // res.send(pages);
//         res.render('index', pages)
//     })
//     .catch(next);
// });

// router.get('/add', function(req, res, next) {
//     res.render('addpage');
// });

// router.get('/:urlTitle', function(req, res, next){
//     // use Page model to find page instance by urlTitle
//     Page.findOne({
//         where: {
//             urlTitle: req.params.urlTitle
//         }
//     })
//     .then(function(foundPage){
//         // res.json(foundPage);
//         res.render('wikipage', {
//             title: foundPage.title,
//             urlTitle: foundPage.urlTitle,
//             content: foundPage.content,
//             name: foundPage.name
//         })
//     })
//     .catch(next);
// });

// router.post('/', function(req, res, next) {
//     var page = Page.build({
//         title: req.body.title,
//         content: req.body.content
//     });

//     // var user = User.build({
//     //     name: req.body.name,
//     //     email: req.body.email
//     // });

//     page.save()
//     .then(function(savedPage){
//         res.redirect(savedPage.route);  // route virtual FTW
//     })
//     .catch(next);

//     // res.json(page);
// });

// module.exports = router;