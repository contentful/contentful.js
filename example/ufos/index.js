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
  
  // search for ufo sightings
  $scope.update = update;
  function update() {
    
    // query details
    var q = {
      content_type: '7ocuA1dfoccWqWwWUY4UY',
      limit: 1000,
      include: 1
    };

    if (query.term) {
      q.query = query.term;
    }

    // query of entries from contentful to populate $scope.ufos
    $scope.ufos = enQ(client.entries(q)).then(function(ufos) {
      $scope.total = ufos.length;
      return ufos.map(function(ufo) {
        if (query.term) {
          var parts = query.term.split(/\s+/).join('|');
          // highlight search term in description
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

  // when ufo-entries are loaded map gets centered to the first ufo
  $scope.$watch('ufos', function(ufos) {
    if (!ufos) return;
    $scope.position = 0;
    $scope.ufo = ufos[0];
    
    // create GeoJSON collection
    ufos.map(ufoToGeoJson)
    var json = {
      type: "FeatureCollection",
      features: ufos
    };

    // loop through GeoJSON, create a marker for each sighting
    for (var i = json.features.length - 1; i >= 0; i--) {
      var marker = new google.maps.Marker({position: {lat: json.features[i].fields.location.lat, lng: json.features[i].fields.location.lon}, map: map, title: json.features[i].fields.locationName, ufo: json.features[i], id: i });
      var infowindow = new google.maps.InfoWindow();

      // handle click event on markers
      google.maps.event.addListener(marker, 'click', function() {
        $scope.position = this.id
        $scope.ufo = this.ufo;
        $scope.$apply()
        infowindow.setContent(this.title);
        infowindow.open(map, this);
      });
    };
  });

  // center map to current ufo
  $scope.$watch('ufo', function(ufo) {
    if (!ufo) return;
    var location = {lat: ufo.fields.location.lat, lng: ufo.fields.location.lon};
    map.panTo(location);
    map.setZoom(12);
  });

  update();
}

// creates GeoJson of each ufo sighting to be shown on map
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
      ufo: ufo
    }
  };
}

// Angular directive handles up and down key input
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
    }
  };
}

// Angular app bootstrap and registration of controller, directive and factory
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