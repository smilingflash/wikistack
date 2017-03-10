'use strict'

var express = require('express');
var path = require('path');
var wikistack = express();
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');


// point nunjucks to the directory containing templates and turn off caching; configure returns an Environment instance, which we'll want to use to add Markdown support later.
var env = nunjucks.configure('views', {noCache: true});
wikistack.set('view engine', 'html'); // have res.render work with html files
wikistack.engine('html', nunjucks.render); // when res.render works with html files, have it use nunjucks to do so

wikistack.use(express.static(path.join(__dirname, '/public')));
