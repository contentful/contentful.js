'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var contentful = require('contentful');


//example from user create blog space sample
var SPACE_ID = 'your space id here',
   ACCESS_TOKEN = 'your acess token here',
   POST_CONTENT_TYPE_ID = 'your content type id here',
   CATEGORY_CONTENT_TYPE_ID='you category type here';

//examples from documentation
var EXAMPLE_SPACE_ID = 'cfexampleapi',
   EXAMPLE_ACCESS_TOKEN = 'b4c0n73n7fu1',
   CITY_CONTENT_TYPE_ID='1t9IbcfdCk6m04uISSsaIK',
   CAT_CONTENT_TYPE_ID='63k4qdEi9aI8IQUGaYGg4O',
   DOG_CONTENT_TYPE_ID='dog',
   CATREF_CONTENT_TYPE_ID='cat',
   HUMAN_CONTENT_TYPE_ID='human';

var  PORT = 3000;


var app = express();
app.use(bodyParser.urlencoded({ extended: false }));


// Default route provides index
app.get('/', function(req, res) {
    res.end('<a href="/posts">/posts</a> circular refrence error <br/> <a href="/categories">/categories</a><br><a href="/cities">/cities</a><br/> <a href="/cats">/cats</a><br/> <a href="/dogs">/dogs</a><br/> <a href="/catsref">/catsref</a> circular refrence error<br/> <a href="/humans">/humans</a><br/>');
});


// Sample calls to sample generated blog space
  // Create client on my blog.
  var myClient = contentful.createClient({
      space: SPACE_ID,
      accessToken: ACCESS_TOKEN,
      resolveLinks: false
  });

  /* Get post from blog sample */
  app.get('/posts', function(req, res, next) {
      myClient.entries({
          content_type: POST_CONTENT_TYPE_ID
      }).then(function(data) {
          res.json(data);
          console.log(data);
      }).catch(next);
  });

  /* Get post from blog sample */
  app.get('/categories', function(req, res, next) {
      myClient.entries({
          content_type: CATEGORY_CONTENT_TYPE_ID
      }).then(function(data) {
          res.json(data);
          console.log(data);
      }).catch(next);
  });


// Create client for examples.
  var exampleClient = contentful.createClient({
      space: EXAMPLE_SPACE_ID,
      accessToken: EXAMPLE_ACCESS_TOKEN,
      resolveLinks: false
  });

  app.get('/cities', function(req, res, next) {
      exampleClient.entries({
          content_type: CITY_CONTENT_TYPE_ID
      }).then(function(data) {
          res.json(data);
          console.log(data);
      }).catch(next);
  });

  app.get('/cats', function(req, res, next) {
      exampleClient.entries({
          content_type: CAT_CONTENT_TYPE_ID
      }).then(function(data) {
          res.json(data);
          console.log(data);
      }).catch(next);
  });

  app.get('/dogs', function(req, res, next) {
      exampleClient.entries({
          content_type: DOG_CONTENT_TYPE_ID
      }).then(function(data) {
          res.json(data);
          console.log(data);
      }).catch(next);
  });

  app.get('/catsref', function(req, res, next) {
      exampleClient.entries({
          content_type: CATREF_CONTENT_TYPE_ID
      }).then(function(data) {
          res.json(data);
          console.log(data);
      }).catch(next);
  });

  app.get('/humans', function(req, res, next) {
      exampleClient.entries({
          content_type: HUMAN_CONTENT_TYPE_ID
      }).then(function(data) {
          res.json(data);
          console.log(data);
      }).catch(next);
  });




app.listen(PORT, function() {
    console.log('App listening at http://localhost:%s', PORT);
});
