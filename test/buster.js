'use strict';

var config = module.exports;

config.integration = {
  environment: 'node',
  rootPath: '../',
  tests: ['test/integration/*-test.js'],
  testHelpers: ['test/helper.js']
};
