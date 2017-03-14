// from the solution vid

'use strict';
// Creating our express app
var express = require('express');
var app = express(); //instantiates our express app
var morgan = require('morgan');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var path = require('path');

// Creating our Server
var http = require('http');
var Promise = require('bluebird');

// access our models module
var models = require('./models');
var Page = models.Page;
var User = models.User;
module.exports = app;

app.set('view engine', 'html');
app.engine('html', nunjucks.render);
var env = nunjucks.configure('views', { noCache: true });
require('./filters')(env);

//plug-in that basically tells nunjucks it’s OK to render the html in a string
//there’s a built-in nunjucks filter that indicates this as well, but this is another option, giving you a tag so you can indicate a bunch of stuff that’s safe to render
var AutoEscapeExtension = require("nunjucks-autoescape")(nunjucks);
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));

var wikiRouter = require('./routes/wiki'); // require the router page
var usersRouter = require('./routes/users'); // require the users router page

// our middleware logger
app.use(morgan('dev'));

// routes all pages through the '/public' folder
app.use(express.static(__dirname + '/public'));

// our body parser config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// anything that starts with '/wiki' will get piped into our wikiRouter
app.use('/wiki', wikiRouter);
app.use('/users', usersRouter);

app.get('/', function(req, res) {
    res.render('index');
});

// error handling middleware. it takes exactly 4 arguments
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal Error');
})

// sync the models to the database
User.sync() // returns a promise // pass 'force: true' into sync() in order to update the schema structure => User.sync(force: true)
    .then(function() {
        return Page.sync();
    })
    .then(function() {
        // connect the server inside this promise
        app.listen(3001, function() {
            console.log('Server is listening on port 3001!');
        });
    });


// *********
// workshop code
// *********

// 'use strict'

// var express = require('express');
// var path = require('path');
// var app = express();
// var bodyParser = require('body-parser');
// var nunjucks = require('nunjucks');
// var wikiRouter = require('./routes/wiki.js')
// var morgan = require('morgan');
// var models = require('./models');

// // point nunjucks to the directory containing templates and turn off caching; configure returns an Environment instance, which we'll want to use to add Markdown support later.
// var env = nunjucks.configure('views', { noCache: true });

// app.engine('html', nunjucks.render); // when res.render works with html files, have it use nunjucks to do so
// app.set('view engine', 'html'); // have res.render work with html files

// // middleware logger
// app.use(morgan('dev'));

// // body parser
// app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
// app.use(bodyParser.json()); // would be for AJAX requests

// app.use(express.static(path.join(__dirname, '/public')));

// // router to serve up index.html
// app.use('/wiki', wikiRouter);

// // syncing the our models page to the database
// models.User.sync({})
//     .then(function() {return models.Page.sync({})})
//     .then(function() {
//         app.listen(3000, function() {  // server
//             console.log('Server is listening on port 3000!');
//         });
//     })
//     .catch(console.error);