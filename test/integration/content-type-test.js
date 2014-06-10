'use strict';

buster.testCase('Content Type', {
  prepare: function() {
    this.timeout = 30e3;
  },

  'can be read': function() {
    return client.contentType('cat').then(function(contentType) {
      assert.equals(contentType.name, 'Cat');
    });
  },

  'can be listed': function() {
    return client.contentTypes({
      'order': 'name',
      'sys.id[in]': 'cat,dog,human'
    }).then(function(contentTypes) {
      assert.match(contentTypes, [
        {name: 'Cat'},
        {name: 'Dog'},
        {name: 'Human'}
      ]);
    });
  }
});
