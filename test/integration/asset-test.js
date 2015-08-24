'use strict';

buster.testCase('Asset', {
  prepare: function() {
    this.timeout = 30e3;
  },

  'can be read': function() {
    return client.asset('nyancat').then(function(asset) {
      assert.equals(asset.fields.title, 'Nyan Cat');
    });
  },

  'can be listed': function() {
    return client.assets().then(function(assets) {
      var asset = assets.filter(function (asset) {
        return asset.fields.title === 'Nyan Cat';
      })[0];

      assert(asset);
    });
  }
});
