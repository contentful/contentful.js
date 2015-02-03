'use strict';

global._ = require('lodash');

if (typeof buster === 'undefined') {
  global.buster = require('buster');
}

global.assert = global.buster.assert;
global.refute = global.buster.refute;

global.util   = require('./util');
global.client = global.util.client;
