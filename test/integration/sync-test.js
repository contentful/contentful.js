'use strict';

buster.testCase('Sync', {
  prepare: function() {
    this.timeout = 90e3;
  },

  'can be read': function() {
    return client.sync({initial: true}).then(function(data) {
      assert.defined(data.items);
      assert.defined(data.nextSyncToken);
    });
  }
});
