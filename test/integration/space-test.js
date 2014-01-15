'use strict';

buster.testCase('Space', {
  prepare: function() {
    this.timeout = 30e3;
  },

  'can be read': function() {
    return client.space().then(function(space) {
      assert.match(space, {
        sys: {
          type: 'Space',
          id: 'cfexampleapi'
        },
        name: 'Contentful Example API',
        locales: [
          {code: 'en-US', name: 'English'},
          {code: 'tlh', name: 'Klingon'}
        ]
      });
    });
  }
});
