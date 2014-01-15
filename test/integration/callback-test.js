'use strict';

buster.testCase('Callback', {
  prepare: function() {
    this.timeout = 30e3;
  },

  'space can be read': function(done) {
    return client.space(function() {
      assert(true);
      done();
    });
  },

  'content type can be read': function(done) {
    return client.contentType('cat', function() {
      assert(true);
      done();
    });
  },

  'content types can be listed': function(done) {
    return client.contentTypes(null, function() {
      assert(true);
      done();
    });
  },

  'asset can be read': function(done) {
    return client.asset('nyancat', function() {
      assert(true);
      done();
    });
  },

  'assets can be listed': function(done) {
    return client.assets(null, function() {
      assert(true);
      done();
    });
  },

  'entry can be read': function(done) {
    return client.entry('nyancat', function() {
      assert(true);
      done();
    });
  },

  'entries can be listed': function(done) {
    return client.entries(null, function() {
      assert(true);
      done();
    });
  }
});
