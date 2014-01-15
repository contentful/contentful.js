'use strict';

global._ = require('underscore-contrib');

if (typeof buster === 'undefined') {
  global.buster = require('buster');
}

global.assert = buster.assert;
global.refute = buster.refute;

global.util   = require('./util');
global.client = global.util.client;
