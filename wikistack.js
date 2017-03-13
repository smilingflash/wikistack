'use strict'

var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var wikiRouter = require('./routes/wiki.js')
var morgan = require('morgan');
var models = require('./models');

// point nunjucks to the directory containing templates and turn off caching; configure returns an Environment instance, which we'll want to use to add Markdown support later.
var env = nunjucks.configure('views', { noCache: true });

app.engine('html', nunjucks.render); // when res.render works with html files, have it use nunjucks to do so
app.set('view engine', 'html'); // have res.render work with html files


// middleware logger
app.use(morgan('dev'));

// body parser
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests

app.use(express.static(path.join(__dirname, '/public')));

// router to serve up index.html
app.use('/', wikiRouter);

// syncing the our models page to the database
models.User.sync({})
    .then(function() {return models.Page.sync({})})
    .then(function() {  // server
        app.listen(3000, function() {
            console.log('Server is listening on port 3000!');
        });
    })
    .catch(console.error);