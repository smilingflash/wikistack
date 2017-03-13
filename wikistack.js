'use strict'

var express = require('express');
var path = require('path');
var wikistack = express();
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var routes = require('./routes')
var morgan = require('morgan');
var models = require('./models');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
    // logging: false
});


// point nunjucks to the directory containing templates and turn off caching; configure returns an Environment instance, which we'll want to use to add Markdown support later.
var env = nunjucks.configure('views', { noCache: true });

wikistack.engine('html', nunjucks.render); // when res.render works with html files, have it use nunjucks to do so
wikistack.set('view engine', 'html'); // have res.render work with html files


// middleware logger
wikistack.use(morgan('dev'));

// body parser
wikistack.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
wikistack.use(bodyParser.json()); // would be for AJAX requests

wikistack.use(express.static(path.join(__dirname, '/public')));

// router to serve up index.html
wikistack.use('/', routes);

// syncing the our models page to the database
models.User.sync({})
    .then(function() {
        return models.Page.sync({})
    })
    // server
    .then(function() {
        server.listen(3000, function() {
            console.log('Server is listening on port 3001!');
        });
    })
    .catch(console.error);