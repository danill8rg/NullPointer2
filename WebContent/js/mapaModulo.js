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
	 $scope.init = function(){                   
		if(window.sessionStorage.getItem('idUsuario') != null){
			id_usuario_null_pointer = "disconected"
		}else{
		 id_usuario_null_pointer = 0;
		}
		if(id_usuario_null_pointer != 0){
			$scope.logStatus = "Sair";
		}else{
			$scope.logStatus = "Logar";
		}
	}
	$scope.init();
	var i = 0;
	var lastId = 1;
	var clusterThresh = 6;
	var listaDenuncia = [];
	$scope.link = "http://www.w3schools.com/html/";
	//$http.get("http://rcisistemas.minivps.info:8080/NullServer/viewMap").success(function (data) {
	$http.get("http://localhost:8080/NullServer/viewMap").success(function (data) {
		for (i = 0; i < data.length; i++) { 
			console.log(data[i].idDenuncia);
			console.log(parseFloat(data[i].latitude));
			console.log(parseFloat(data[i].longitude)); 
			console.log(data[i].tipoDenuncia);
			console.log(data[i].tipoDenuncia == 'Drogas');
			var tipoMarcador = '';
			if(data[i].tipoDenuncia == 'Drogas'){
				tipoMarcador = 'http://rcisistemas.minivps.info:8080/NullPointer/images/ic_location_green.png';
			}else{
				if(data[i].tipoDenuncia == 'Alcool'){
					tipoMarcador = 'http://rcisistemas.minivps.info:8080/NullPointer/images/ic_location_blue.png';
				}else{
					if(data[i].tipoDenuncia == 'Assalto'){
						tipoMarcador = 'http://rcisistemas.minivps.info:8080/NullPointer/images/ic_location_rosa.png';
					}else{
						tipoMarcador = 'http://rcisistemas.minivps.info:8080/NullPointer/images/ic_location_yellow.png';
					}
				}
			}
			console.log("tipoMarcador = " +  tipoMarcador);
			var image = "https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png";
			var marker = {
				title: "Tipo da Denuncia: " + data[i].tipoDenuncia + " ",
				id: data[i].idDenuncia,
				icon: {
					url:tipoMarcador
				},
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
		zoom: 7
	};
	console.log("mapa criado");
}])

.controller("mapMarcar", ["$scope", "uiGmapLogger", "uiGmapObjectIterators", '$http',
                    	function ($scope, logger, uiGmapObjectIterators, $http) {
                    	 $scope.init = function(){                   
                    		if(window.sessionStorage.getItem('idUsuario') != null){
                    			id_usuario_null_pointer = "disconected"
                    		}else{
                    		 id_usuario_null_pointer = 0;
                    		}
                    		if(id_usuario_null_pointer != 0){
                    			$scope.logStatus = "Sair";
                    		}else{
                    			$scope.logStatus = "Logar";
                    		}
                    	}
                    	$scope.init();
                    	var i = 0;
                    	var lastId = 1;
                    	var clusterThresh = 6;
                    	
                    	$scope.map = {
                    		center: {
                    			latitude: -16.32888061,
                    			longitude: -48.94996101
                    		},
                    		zoom: 7
                    	};
                    }]);

//0 = desconectado;
var id_usuario_null_pointer = 0;