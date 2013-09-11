'use strict';

if (typeof require !== 'undefined') {
  var contentful = require('../../index');
}

var client = contentful.createClient({
  space: 'cfexampleapi',
  accessToken: 'b4c0n73n7fu1'
});

function DemoCtrl($scope, $q) {
  $scope.space = $q.when(client.space());

  $scope.contentTypes = $q.when(client.contentTypes());

  $scope.contentTypes.then(function(types) {{
    if (!types || !types.length) return;
    $scope.contentType = types[0];
  }});

  $scope.$watch('contentType', function(contentType) {
    if (!contentType) return;
    $scope.entries = $q.when(client.entries({
      order: 'sys.updatedAt',
      content_type: contentType.sys.id
    }));
  });
}

angular.module('meow', []).
  controller('DemoCtrl', DemoCtrl);

