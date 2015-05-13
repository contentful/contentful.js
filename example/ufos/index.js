'use strict';

/* global L, $ */

if (typeof require !== 'undefined') {
  var contentful = require('../../index');
}

var client = contentful.createClient({
  space: 'lzjz8hygvfgu',
  accessToken: '0c6ef483524b5e46b3bafda1bf355f38f5f40b4830f7599f790a410860c7c271'
});

// Google map
var map;
var mapStyles = [{"featureType":"administrative.locality","elementType":"all","stylers":[{"hue":"#2c2e33"},{"saturation":7},{"lightness":19},{"visibility":"on"}]},{"featureType": "poi","stylers": [{"visibility": "off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"hue":"#ffffff"},{"saturation":-100},{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"geometry","stylers":[{"hue":"#bbc0c4"},{"saturation":-53},{"lightness":31}]},{"featureType":"road","stylers":[{"hue":"#bbc0c4"},{"saturation":-93},{"lightness":31},{"visibility":"on"}]},{"featureType":"road.arterial","stylers":[{"hue":"#bbc0c4"},{"saturation":-93},{"lightness":-2},{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"hue":"#e9ebed"},{"saturation":-90},{"lightness":-8},{"visibility":"simplified"}]},{"featureType":"transit"},{"featureType":"water","elementType":"all","stylers":[{"hue":"#e9ebed"},{"saturation":-78},{"lightness":67},{"visibility":"simplified"}]}];
var mapOptions = {
    zoom: 4,
    center: {lat: 35.3732921, lng: -119.0187125},
    panControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    overviewMapControl: false,
    styles: mapStyles
};

function initializeMap() {
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initializeMap);

// Angular controller
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
      content_type: '7ocuA1dfoccWqWwWUY4UY',
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
/*    var markers = ufos.map(ufoToGeoJson);
    map.markerLayer.clearLayers();
    map.markerLayer.setGeoJSON(markers);*/
  });

  $scope.$watch('ufo', function(ufo) {
    if (!ufo) return;
    var location = [ufo.fields.location.lat, ufo.fields.location.lon];
/*    map.panTo(location);
    map.setZoom(12);*/
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
      // 'marker-color': '#fc3159',
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

      /*map.markerLayer.on('click', function(e) {
        scope.ufo = e.layer.feature.properties.ufo;
        scope.$apply();
      });*/
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