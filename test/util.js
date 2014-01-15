'use strict';

var contentful = require('..');
var Promise = require('bluebird');

exports.client = contentful.createClient({
  space: 'cfexampleapi',
  accessToken: 'b4c0n73n7fu1'
});

exports.wait = wait;
function wait(ms) {
  if (!ms) { ms = 5000; }
  return Promise.delay(ms);
}
