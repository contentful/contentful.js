'use strict';

var config = module.exports;

config.browser_integration = {
  environment: 'browser',
  rootPath: '../',
  tests: ['test/integration/*-test.js'],
  testHelpers: ['test/bundle-helper.js']
};

config.node_integration = {
  environment: 'node',
  rootPath: '../',
  tests: ['test/integration/*-test.js'],
  testHelpers: ['test/helper.js']
};
