'use strict';
angular.module("angular-google-maps-example", ['uiGmapgoogle-maps', 'ngFileUpload', 'ui.bootstrap', 'ngRoute'])

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
	var markers = [];
	
	$scope.map = {
			markers: markers,
			center: {
				latitude: -16.32888061,
				longitude: -48.94996101
			},
			zoom: 7
	};
	
	markers = $scope.map.markers ;
	
	var initMap = function(){            
	}
	initMap();
	var millisecondsToWait = 5000;
	setTimeout(function() {
		//$http.get("http://localhost:8080/NullServer/viewMap").success(function (data) {
		$http.get("http://rcisistemas.minivps.info:8080/NullServer/viewMap").success(function (data) {	
		for (i = 0; i < data.length; i++) { 
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
				$scope.map.markers.push(marker);
			}
		});   
	}, millisecondsToWait);
	
	
	$scope.link = "http://www.w3schools.com/html/";
	//$http.get("http://rcisistemas.minivps.info:8080/NullServer/viewMap").success(function (data) {
         
	console.log("teste");	
	console.log("mapa criado");
}])

.controller("mapMarcar", ["$scope", "uiGmapLogger", "uiGmapObjectIterators", '$http',
                          '$timeout', '$compile', 'Upload', '$location', '$window',
      function ($scope, logger, uiGmapObjectIterators, $http, $timeout, $compile, Upload, $location, $window) {
	  var caminho_imagem_upload = "";
	  $scope.init = function(){                   
			if(window.sessionStorage.getItem('idUsuario') != null){
				id_usuario_null_pointer = window.sessionStorage.getItem('idUsuario');
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
	
	  $scope.myInterval = 5000;
	  $scope.noWrapSlides = false;
	  var slides = $scope.slides = [ ];
	  $scope.addSlide = function() {
		  console.log("$scope.addSlide = function()");
		if(caminho_imagem_upload != "" ){
			console.log("caminho_imagem_upload != vazio");
			var newWidth = 600 + slides.length + 1;
			console.log(caminho_imagem_upload),
		    slides.push({
		    			  image: caminho_imagem_upload
		    		})
		    caminho_imagem_upload = "";
		}else{
			console.log("caminho_imagem_upload == vazio");
			$scope.addAlert("Não foi possível anexar imagem, por gentileza informe apenas arquivo válido, PNG, JPEG, JPG!");
		}
	  };
	  $scope.alerts = [ ];
      
	  $scope.addAlert = function( msg_string) {
     	    $scope.alerts.push({msg: msg_string});
     	  };

      $scope.closeAlert = function(index) {
     	    $scope.alerts.splice(index, 1);
     	  };
     	  
     $scope.alerts2 = [ ];
         
   	  $scope.addAlert2 = function( msg_string) {
        	    $scope.alerts2.push({msg: msg_string});
      };

         $scope.closeAlert2 = function(index) {
        	    $scope.alerts2.splice(index, 1);
         };
	
         var i = 0;
         var lastId = 1;
         var clusterThresh = 6;
                    	
         $scope.map = {
        		    center: {
        		      latitude: -16.35041579,
        		      longitude: -48.9717108
        		    },
        		    zoom: 13,
        		    events: {
        		      tilesloaded: function (map, eventName, originalEventArgs) {
        		        //map is trueley ready then this callback is hit
        		      },
        		      click: function (mapModel, eventName, originalEventArgs) {
        		        var e = originalEventArgs[0];
        		        var lat = e.latLng.lat(),
        		            lon = e.latLng.lng();
        		        $scope.map.clickedMarker = {
        		          id:0,
        		          title: 'You clicked here ' + 'lat: ' + lat + ' lon: ' + lon,
        		          latitude: lat,
        		          longitude: lon
        		        };
        		        //scope apply required because this event handler is outside of the angular domain
        		        $scope.$apply();
        		      }
        		    },marker2: {
                        id: 0,
                        draggable:true,
                        animation: google.maps.Animation.DROP,
                        latitude: 50.2,
                        longitude: -80.5
                      },
        		    markers: [
        		      {
        		        id: 1,
        		        latitude: 45,
        		        longitude: -74,
        		        showWindow: false,
        		        title: 'Markers: 1'
        		      },
        		      {
        		        id: 2,
        		        latitude: 15,
        		        longitude: 30,
        		        showWindow: false,
        		        title: 'Markers: 2'
        		      },
        		      {
        		        id: 3,
        		        icon: 'assets/images/plane.png',
        		        latitude: 37,
        		        longitude: -122,
        		        showWindow: false,
        		        title: 'Markers: 3'
        		      }
        		    ],
        		    clickedMarker: {
        		      id:0,
        		      title: ''
        		    },
        		    onMarkerClicked: function (marker) {
        		      marker.showWindow = true;
        		      $scope.$apply();
        		      //window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
        		    }
        		  };
        var  version = "7.0.7";
         
         $scope.usingFlash = FileAPI && FileAPI.upload != null;
         //Upload.setDefaults({ngfKeep: true, ngfPattern:'image/*'});
         $scope.changeAngularVersion = function () {
           window.location.hash = $scope.angularVersion;
           window.location.reload(true);
         };
         $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
           window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.24';

         $scope.$watch('files', function (files) {
           $scope.formUpload = false;
           if (files != null) {
             if (!files.length) {
               $timeout(function () {
                 $scope.files = files = [files];
               });
               return;
             }
             for (var i = 0; i < files.length; i++) {
               $scope.errorMsg = null;
               (function (f) {
                 if (!f.$error) {
                   upload(f);
                 }
               })(files[i]);
             }
           }
         });
         
         $scope.gerarDenuncia = function () {
        	 if(id_usuario_null_pointer == 0){
        		 $scope.addAlert2("Você não está Logado, se continuar criará uma denúncia anônima e não terá permissão para edita-lá posteriomente! Clique em Fazer Denuncia para continuar e fazer a denúncia anônima.");
        		 id_usuario_null_pointer = 1;
        	 }
        	 
             console.log("$scope.gerarDenuncia");
             if($scope.dataAdionada!= null){
            	 console.log($scope.dataAdionada);
             }else{
            	 $scope.addAlert2("Por gentileza, Informe a data que aconteceu corretamente. Este dado é importante para criar um histórico das ocorrências!");
            	 $scope.dataAdionada =  new Date();
             }
             if($scope.tipoDenuncia!= null){
            	 console.log($scope.tipoDenuncia);
             }else{
            	 $scope.addAlert2("Por gentileza, Informe corretamente o tipo de denúncia que deseja registrar!");
             }
             if($scope.detalhe!= null){
            	 console.log($scope.detalhe);
             }else{
            	 $scope.addAlert2("Por gentileza, Informe corretamente o que aconteceu. Este dado é importane para comunicar a toda a sociedade o que de fato aconteceu!");
             }
             
             if($scope.map.clickedMarker.latitude == null ){
            	 $scope.addAlert2("Por gentileza, Informe corretamente o local da Denúncia. Este dado é importane para mapear ás áreas críticas. Para informar este dado de um clique no mapa no exato local da denúncia!");
             }else{
            	 console.log("$scope.map.clickedMarker == nullo");
             }
             
             if(slides != []){
            	 var index = 0;
            	 for (index = 0; index < slides.length; index++) {
            	     console.log(slides[index].image);
            	 }
             }
             
             if($scope.map.clickedMarker.latitude != null && 
            		 $scope.detalhe != null && $scope.tipoDenuncia != null &&
            		 $scope.dataAdionada != null && id_usuario_null_pointer != 0){
            	 $scope.addAlert2("Registrando a Denuncia! Por gentileza aguarde....");
            	 var data = {
     					"latitude" :$scope.map.clickedMarker.latitude,
     					"longitude" : $scope.map.clickedMarker.longitude,
     					"tipoDenuncia" : $scope.tipoDenuncia,
     					"observacao" : $scope.detalhe,
     					"dataAdicionada" : $scope.dataAdionada,
     					"arrayImagemm" : slides,
     					"idUsuario" : id_usuario_null_pointer
     				};
            	 
            	 //$http.post("http://localhost:8080/NullServer/denuncia/denuncia_site", {denuncia : data}).success(
            	 $http.post("http://rcisistemas.minivps.info:8080/NullServer/denuncia/denuncia_site", {denuncia : data}).success(	
            	 function(data) {
 							console.log("Salvo com Sucesso era para redirecionar");
 							$window.location.href = '/NullPointer/mapa/mapa.html';
 						}).error(function(data){
 							console.log("Erro ao salvar Denuncia");
 							 $scope.addAlert2("Ocorreu algum erro ao salvar a denúncia. Por gentliza contacte o e-mail: danill8rg@gmail.com e avise. Tente registrar a Denúncia posteriomente. Desculpe pelo transtorno e estarei resolvensdo o problema assim que possível.");
 						 })
             }
             
             
             
           };

         $scope.uploadPic = function (file) {
           console.log("$scope.uploadPic = function (file) {");
           $scope.formUpload = true;
           if (file != null) {
        	   var teste = file.files;
             upload(file)
           }else{
        	   $scope.addAlert("Não há nenhum arquivo selecionado. Por gentile selecione um arquivo!");
        	   console.log("file is NULL");
           }
         };

         function upload(file) {
           $scope.errorMsg = null;
             uploadUsing$http(file);
         }

         function uploadUsingUpload(file) {
           file.upload = Upload.upload({
             url: 'https://angular-file-upload-cors-srv.appspot.com/upload' + $scope.getReqParams(),
             method: 'POST',
             headers: {
               'my-header': 'my-header-value'
             },
             fields: {username: $scope.username},
             file: file,
             fileFormDataName: 'myFile'
           });

           file.upload.then(function (response) {
             $timeout(function () {
               file.result = response.data;
             });
           }, function (response) {
             if (response.status > 0)
               $scope.errorMsg = response.status + ': ' + response.data;
           });

           file.upload.progress(function (evt) {
             // Math.min is to fix IE which reports 200% sometimes
             file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
           });

           file.upload.xhr(function (xhr) {
             // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
           });
         }

         function uploadUsing$http(file) {
           file.upload = Upload.http({
             //url: 'http://localhost:8080/NullServer/img/fileupload' + $scope.getReqParams(),
        	  url: 'http://rcisistemas.minivps.info:8080/NullServer/img/fileupload' + $scope.getReqParams(),
        	  method: 'POST',
             headers: {
               'Content-Type': "multipart/form-data"
             },
             data: file
           });

           file.upload.then(function (response) {
        	 console.log("file.upload.then(function (response) {");
             file.result = response.data;
             if (response.status == 200 || response.status == 201 || response.status == 202 ){
            	 console.log("statu ok!" + response.status);
            	 var object = response.data;
            	 console.log("response.caminho = " + "" + object.caminho);
            	 caminho_imagem_upload = "" + object.caminho;
            	 $scope.addSlide();
            	 $scope.picFile = null;
             }else{
            	 console.log("statu deu merda!" + response.status);
            	 $scope.errorMsg = response.status + ': ' + response.data;
             }
           }, function (response) {
        });

           file.upload.progress(function (evt) {
             file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
           });
         }

         function uploadS3(file) {
           file.upload = Upload.upload({
             url: $scope.s3url,
             method: 'POST',
             fields: {
               key: file.name,
               AWSAccessKeyId: $scope.AWSAccessKeyId,
               acl: $scope.acl,
               policy: $scope.policy,
               signature: $scope.signature,
               'Content-Type': file.type === null || file.type === '' ? 'application/octet-stream' : file.type,
               filename: file.name
             },
             file: file
           });

           file.upload.then(function (response) {
             $timeout(function () {
               file.result = response.data;
             });
           }, function (response) {
             if (response.status > 0)
               $scope.errorMsg = response.status + ': ' + response.data;
           });

           file.upload.progress(function (evt) {
             file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
           });
           storeS3UploadConfigInLocalStore();
         }

         $scope.generateSignature = function () {
           $http.post('/s3sign?aws-secret-key=' + encodeURIComponent($scope.AWSSecretKey), $scope.jsonPolicy).
             success(function (data) {
               $scope.policy = data.policy;
               $scope.signature = data.signature;
             });
         };

         if (localStorage) {
           $scope.s3url = localStorage.getItem('s3url');
           $scope.AWSAccessKeyId = localStorage.getItem('AWSAccessKeyId');
           $scope.acl = localStorage.getItem('acl');
           $scope.success_action_redirect = localStorage.getItem('success_action_redirect');
           $scope.policy = localStorage.getItem('policy');
           $scope.signature = localStorage.getItem('signature');
         }

         $scope.success_action_redirect = $scope.success_action_redirect || window.location.protocol + '//' + window.location.host;
         $scope.jsonPolicy = $scope.jsonPolicy || '{\n  "expiration": "2020-01-01T00:00:00Z",\n  "conditions": [\n    {"bucket": "angular-file-upload"},\n    ["starts-with", "$key", ""],\n    {"acl": "private"},\n    ["starts-with", "$Content-Type", ""],\n    ["starts-with", "$filename", ""],\n    ["content-length-range", 0, 524288000]\n  ]\n}';
         $scope.acl = $scope.acl || 'private';

         function storeS3UploadConfigInLocalStore() {
           if ($scope.howToSend === 3 && localStorage) {
             localStorage.setItem('s3url', $scope.s3url);
             localStorage.setItem('AWSAccessKeyId', $scope.AWSAccessKeyId);
             localStorage.setItem('acl', $scope.acl);
             localStorage.setItem('success_action_redirect', $scope.success_action_redirect);
             localStorage.setItem('policy', $scope.policy);
             localStorage.setItem('signature', $scope.signature);
           }
         }

         var fromLocal = (localStorage && localStorage.getItem('editHtml' + version));

         $scope.confirm = function () {
           return confirm('Are you sure? Your local changes will be lost.');
         };

         $scope.getReqParams = function () {
           return $scope.generateErrorOnServer ? '?errorCode=' + $scope.serverErrorCode +
           '&errorMessage=' + $scope.serverErrorMsg : '';
         };

         angular.element(window).bind('dragover', function (e) {
           e.preventDefault();
         });
         angular.element(window).bind('drop', function (e) {
           e.preventDefault();
         });

         $scope.$watch('validate', function (v) {
           $scope.validateObj = eval('(function(){return ' + v + ';})()');
         });
        	  
	  $scope.toggleBounce = function() {
	      if (this.getAnimation() != null) {
	        this.setAnimation(null);
	      } else {
	        this.setAnimation(google.maps.Animation.BOUNCE);
	      }
	    }

         $timeout(function () {
           $scope.capture = localStorage.getItem('capture' + version) || 'camera';
           $scope.pattern = localStorage.getItem('pattern' + version) || 'image/*,audio/*,video/*';
           $scope.acceptSelect = localStorage.getItem('acceptSelect' + version) || 'image/*,audio/*,video/*';
           $scope.disabled = localStorage.getItem('disabled' + version) == 'true' || false;
           $scope.multiple = localStorage.getItem('multiple' + version) == 'true' || false;
           $scope.allowDir = localStorage.getItem('allowDir' + version) == 'true' || true;
           $scope.validate = localStorage.getItem('validate' + version) || '{size: {max: \'20MB\', min: \'10B\'}, height: {max: 5000}, width: {max: 5000}, duration: {max: \'5m\'}}';
           $scope.keep = localStorage.getItem('keep' + version) == 'true' || false;
           $scope.keepDistinct = localStorage.getItem('keepDistinct' + version) == 'true' || false;
           $scope.$watch('validate+capture+pattern+acceptSelect+disabled+capture+multiple+allowDir+keep+keepDistinct', function () {
             localStorage.setItem('capture' + version, $scope.capture);
             localStorage.setItem('pattern' + version, $scope.pattern);
             localStorage.setItem('acceptSelect' + version, $scope.acceptSelect);
             localStorage.setItem('disabled' + version, $scope.disabled);
             localStorage.setItem('multiple' + version, $scope.multiple);
             localStorage.setItem('allowDir' + version, $scope.allowDir);
             localStorage.setItem('validate' + version, $scope.validate);
             localStorage.setItem('keep' + version, $scope.keep);
             localStorage.setItem('keepDistinct' + version, $scope.keepDistinct);
           });
         });
         
}])

//0 = desconectado;
var id_usuario_null_pointer = 0;