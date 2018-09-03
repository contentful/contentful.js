#!/usr/bin/env node
// require('@babel/register')
require('@babel/polyfill')
require('require-all')({
  dirname: process.cwd() + '/test/unit',
  filter: process.argv[2] || /-test\.js$/,
  recursive: true
})
