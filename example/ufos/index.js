'use strict';

/* global L, $ */


if (typeof require !== 'undefined') {
  var contentful = require('../../index');
}

var client = contentful.createClient({
  space: 'lzjz8hygvfgu',
  accessToken: '0c6ef483524b5e46b3bafda1bf355f38f5f40b4830f7599f790a410860c7c271'
});

var mapId = 'stephanseidt.map-hhhrrit1';
var retinaMapId = 'stephanseidt.map-j9eqvtbq';
var roswellLatLng = [33.38830000000001, -104.5191];

var map = L.mapbox.map('map')
    .setView(roswellLatLng, 12)
    .addLayer(L.mapbox.tileLayer(mapId, {
      detectRetina: true,
      retinaVersion: retinaMapId
    }));

function UfoController($scope, $timeout, enQ) {
  var query = $scope.query = {
    term: ''
  };

  $scope.position = 0;

  $scope.$watch('position', function(position) {
    if (!$scope.ufos) return;
    $scope.ufos.then(function(ufos) {
      $scope.ufo = ufos[position];
    });
  });

  $scope.update = update;
  function update() {
    var q = {
      'sys.contentType.sys.id': '7ocuA1dfoccWqWwWUY4UY',
      limit: 1000,
      include: 1
    };

    if (query.term) {
      q.query = query.term;
    }

    $scope.ufos = enQ(client.entries(q)).then(function(ufos) {
      $scope.total = ufos.length;
      return ufos.map(function(ufo) {
        if (query.term) {
          var parts = query.term.split(/\s+/).join('|');
          ufo.fields.description = ufo.fields.description
            .replace(new RegExp(parts, 'gi'), '<em>$&</em>');
        }
        ufo.fields.description = ufo.fields.description
          .replace(/^summary ?:? ?/i, '');
        ufo.fields.sightedAt = new Date(ufo.fields.sightedAt);
        return ufo;
      });
    });
  }

  $scope.$watch('ufos', function(ufos) {
    if (!ufos) return;
    $scope.position = 0;
    $scope.ufo = ufos[0];
    var markers = ufos.map(ufoToGeoJson);
    map.markerLayer.clearLayers();
    map.markerLayer.setGeoJSON(markers);
  });

  $scope.$watch('ufo', function(ufo) {
    if (!ufo) return;
    var location = [ufo.fields.location.lat, ufo.fields.location.lon];
    map.panTo(location);
    map.setZoom(12);
  });

  update();
}

function ufoToGeoJson(ufo) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        ufo.fields.location.lon,
        ufo.fields.location.lat
      ]
    },
    properties: {
      title: ufo.fields.locationName,
      'marker-color': '#97c0c0',
      ufo: ufo
    }
  };
}

function ufo() {
  return {
    controller: 'UfoController',
    link: function(scope) {
      function onkeyup(e) {
        var position;

        switch (e.which) {
        case 38: // up arrow
          position = scope.position - 1;
          break;
        case 32: // space
        case 40: // down arrow
          position = scope.position + 1;
          break;
        default:
          return;
        }

        scope.position = (scope.total + position) % scope.total;

        scope.$apply();

        return false;
      }

      $(window).on('keyup', onkeyup);
      scope.$on('$destroy', function() {
        $(window).off('keyup', onkeyup);
      });

      map.markerLayer.on('click', function(e) {
        scope.ufo = e.layer.feature.properties.ufo;
        scope.$apply();
      });
    }
  };
}

angular.module('ufos', []).

  directive('ufo', ufo).

  controller('UfoController', UfoController).

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

