/**
 * 
 */

/** Controllers */

var phonecatApp = angular.module('phonecatApp', ['uiGmapgoogle-maps']);

phonecatApp.controller('PhoneListCtrl', function ($scope) {
	
	$scope.number = 0;
    
    $scope.click = function() {
        $scope.number += 1;
    };   		
    
    $scope.map = {
            center: {
              latitude: 53.406754,
              longitude: -2.158843
            },
            pan: true,
            zoom: 14,
            refresh: false,
            options: {
              disableDefaultUI: true
            },
            events: {},
            bounds: {},
            polys: [],
            draw: undefined
          };
  $scope.phones = [
    {'name': 'Nexus S',
     'snippet': 'Fast just got faster with Nexus S.'},
    {'name': 'Motorola XOOM™ with Wi-Fi',
     'snippet': 'The Next, Next Generation tablet.'},
    {'name': 'MOTOROLA XOOM™',
     'snippet': 'The Next, Next Generation tablet.'}
  ];
});