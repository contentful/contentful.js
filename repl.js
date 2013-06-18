'use strict';

var _ = require('underscore-contrib');
var contentful = require('./index');
var Promise = require('pacta').Promise;

module.exports = repl;
function repl(options, root) {
  var client = contentful.createClient(options);

  var log = _.bound(console, 'log');
  log.ok = _.partial(log, 'ok:');
  log.fail = _.partial(log, 'fail:');

  var env = {
    _: _,
    Promise: Promise,

    client: client,
    contentful: contentful,
    log: log
  };

  if (root) _.extend(root, env);

  return env;
}

if (typeof window !== 'undefined')
  window.repl = repl;

