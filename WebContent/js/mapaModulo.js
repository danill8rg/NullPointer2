'use strict';
angular.module("angular-google-maps-example", ['uiGmapgoogle-maps'])

.value("rndAddToLatLon", function () {
  return Math.floor(((Math.random() < 0.5 ? -1 : 1) * 2) + 1);
})

.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
  GoogleMapApi.configure({
//    key: 'your api key',
    v: '3.17',
    libraries: 'weather,geometry,visualization'
  });
}])

.run(['$templateCache', function ($templateCache) {
  $templateCache.put('control.tpl.html', '<button class="btn btn-sm btn-primary" ng-class="{\'btn-warning\': danger}" ng-click="controlClick()">{{controlText}}</button>');
}])

.controller("mapCtrl", ["$scope", "uiGmapLogger", "uiGmapObjectIterators", '$http',
                        function ($scope, logger, uiGmapObjectIterators, $http) {
                          var i = 0;
                          var lastId = 1;
                          var clusterThresh = 6;
                          var listaDenuncia = [];
                          $scope.link = "http://www.w3schools.com/html/";
                          
                          $http.get("http://localhost:8080/NullServer/viewMap").success(function (data) {
                        	  for (i = 0; i < data.length; i++) { 
                        		  console.log(data[i].idDenuncia);
                        		  console.log(parseFloat(data[i].latitude));
                        		  console.log(parseFloat(data[i].longitude)); 
                        		  console.log(data[i].tipoDenuncia); 
                        		  var marker = {
                        				  id: data[i].idDenuncia,
                  		                time: "12:00PM",
                  		                coords: {
                  		                  latitude: data[i].latitude,
                  		                  longitude: data[i].longitude
                  		                },
                  		                lastSignal: "Never",
                  		                click: function () {
                  		                  this.show = true;
                  		                  this.lastSignal = Math.round(Date.now()).toString();
                  		                  $scope.apply();
                  		                },
                  		                closeClick: function () {
                  		                  this.showWindow = false;
                  		                },
                  		                show: false
                        	     };
                        	    	 listaDenuncia.push(marker);
                        	    }
                  	      });            
                          
                          console.log("teste");
                          $scope.map = {
                        		  markers: listaDenuncia,
                        		  center: {
                        		        latitude: -16.32888061,
                        		        longitude: -48.94996101
                        		      },
                        		      options: {
                        		        streetViewControl: false,
                        		        panControl: false,
                        		        maxZoom: 20,
                        		        minZoom: 3
                        		      },
                            doCluster: true,
                            options: {
                              streetViewControl: false,
                              panControl: false,
                              maxZoom: 18,
                              minZoom: 3
                            },                            
                            clusterOptions: {},
                            zoom: 7
                          };

                          $scope.searchResults = {
                            results: {
                              length: 0
                            }
                          };

                                             
                          $scope.addMarkers = function (num) {
                            var markers = {};
                            var i = 0;

                            for (i = 0; i < num; i++) {                  
                              markers['someKey-' + lastId] ={
                                'coords': {                        
                                  'latitude': -16.32888061 + (i * 0.005),
                                  'longitude': -48.94996101 + (i * 0.005)
                                },
                                'key': 'someKey-' + lastId
                              };
                              lastId++;
                            }
                            lastId = 1;//reset
                            markers.length = num;
                            $scope.searchResults.results = uiGmapObjectIterators.slapAll(markers);
                          };
                        }
                      ]);


