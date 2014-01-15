'use strict';

buster.testCase('Entry', {
  prepare: function() {
    this.timeout = 30e3;
  },

  'can be read': function() {
    return client.entry('nyancat').then(function(entry) {
      assert.equals(entry.fields.name, 'Nyan Cat');
    });
  },

  'can be listed': function() {
    return client.entries().then(function(entries) {
      assert(_.any(entries, function(entry) {
        return entry.fields.name === 'Nyan Cat';
      }));
    });
  }
});
