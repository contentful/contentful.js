'use strict';

if (typeof require !== 'undefined') {
  var contentful = require('../../index');
}

var client = contentful.createClient({
  space: 'cfexampleapi',
  accessToken: 'b4c0n73n7fu1'
});

function DemoCtrl($scope, enQ) {
  $scope.space = enQ(client.space());

  $scope.contentTypes = enQ(client.contentTypes());

  $scope.contentTypes.then(function(types) {{
    if (!types || !types.length) return;
    $scope.contentType = types[0];
  }});

  $scope.$watch('contentType', function(contentType) {
    if (!contentType) return;
    $scope.entries = enQ(client.entries({
      order: 'sys.updatedAt',
      'sys.contentType.sys.id': contentType.sys.id
    }));
  });
}

angular.module('meow', []).

  controller('DemoCtrl', DemoCtrl).

  factory('enQ', function($rootScope, $q) {
    return function enQ(foreignPromise) {
      var deferred = $q.defer();
      foreignPromise.then(function (data) {
        deferred.resolve(data);
        $rootScope.$digest();
      }, function (reason) {
        deferred.reject(reason);
        $rootScope.$digest();
      });
      return deferred.promise;
    };
  });
