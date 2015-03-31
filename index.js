'use strict';

try {
  module.exports = require('./index.es5.js');
} catch (e) {
  require('babel/register')();
  module.exports = require('./index.es6.js');
}
