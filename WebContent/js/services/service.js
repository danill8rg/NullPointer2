/**
 * 
 */

var serviceApp = angular.module('nullP', ['ngRoute'], ['uiGmapgoogle-maps'] );

// Note: Providers can only be injected into config functions. Thus you could not inject $routeProvider into PhoneListCtrl. 
serviceApp.config(['$routeProvider',
 function($routeProvider) {
   $routeProvider.
     when('/mapa', { templateUrl: 'mapa/mapa.html', controller: 'mapa_controller'}).
     when('/usuario/create', { templateUrl: 'usuario/create.html', controller: 'controller_teste'}).
     when('/usuario/conta', { templateUrl: 'usuario/ContaUsuario.html', controller: 'controller_teste'}).
     when('/home', { templateUrl: 'home.html', controller: 'controller_teste'}).
     when('/list', { templateUrl: 'list.html', controller: 'controller_teste'}).
     when('/create', { templateUrl: 'create.html', controller: 'controller_teste'}).
     when('/denuncia/detalhe', { templateUrl: 'denuncia/detalhe.html', controller: 'controller_teste'}).
     when('/mapa/index', { templateUrl: 'mapa/index.html', controller: 'controller_teste'}).
     when('/delete', { templateUrl: 'list.html', controller: 'controller_teste'}).
     otherwise({
       redirectTo: '/home'
     });
 }
]);

serviceApp.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
	  GoogleMapApi.configure({
//	    key: 'your api key',
	    v: '3.17',
	    libraries: 'weather,geometry,visualization'
	  });
	}])


serviceApp.service('usuarioService', function($http, $rootScope ) {
  // privado
  var listaUsuarios = [ ]; 
  var texto = "teste texto";
    
  // público
  this.getLetters = function() {
    return "abcdefghijklmnopqrstuvwyz";
  };
  
  this.getToday = function(){
    return new Date();
  };
  
  this.addUsuario = function(username, email, senha ) {
	  var data = {
			  "nome": username,
			  "senha": senha,
			  "email": email
	  };
	  
	  var promise_post = $http.post('http://localhost:8080/NullServer/usuario/addUser', {usuario:data});
	  
	  promise_post.success(function(data, status, headers, config) {
		  console.log("data = " + data);
		  console.log("status = " + status);
		  console.log("headers = " + headers);
		  console.log("config = " + config);
	  });
	  
	  promise_post.error(function(data, status, headers, config) {
		  console.log("data = " + data);
		  console.log("status = " + status);
		  console.log("headers = " + headers);
		  console.log("config = " + config);
	  });
  };

  this.getListaUsuarios = function(callback) {
	  	return listaUsuarios;
	  };
  
//  this.getListaUsuarios = function() {
//	  //listaUsuarios = $http.get('http://localhost:8087/NullServer/usuario/all').success(callback);
//	  return listaUsuarios;
//  };
  
  var promise = $http.get("http://localhost:8080/NullServer/usuario/all");  
  promise.success(function(value) {  
     console.log(value);
     for (i = 0; i < value.length; i++) { 
    	 listaUsuarios.push(new Usuario(value[i].idUsuario, value[i].email, value[i].nome, value[i].ativo));
    }
     //listaUsuarios = value;
  });
  promise.error(function(response, status) {  
     console.log("The request failed with response " + response + " and status code " + status);
  });
  
  this.validarEmail = function(email) {
	  console.log("era para ter iniciado validar email funcao site:");
	  console.log("http://localhost:8080/NullServer/usuario/validaremail/" + email);
	  
	  return $http.get("http://localhost:8080/NullServer/usuario/validaremail/" + email);  
  };
  
});

//Inicialização
serviceApp.run ( function($rootScope, usuarioService) {
  
  // carrega os estados
	//usuarioService.getStates(function(data){
   // $rootScope.states = data;
//  });
  
});


serviceApp.controller('controller_teste', function($scope, usuarioService, $location ) {

	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
	
	$scope.teste = "esta aqui porra!!!";
	
	$scope.senha2_confirma = false;
	$scope.emailValido = false;
	$scope.formValido = true;
	$scope.listaUsuarios = usuarioService.getListaUsuarios();	
	
	$scope.addUsuario = function() {
		usuarioService.addUsuario($scope.username, $scope.email, $scope.senha);
		$scope.username = '';
		$scope.email = '';
		$scope.senha = '';
		$scope.senha2 = '';
		$location.path('/#list');
	}
	
	$scope.validarSenhas = function(){
		if($scope.senha2 == $scope.senha){
	 		$scope.senha2_confirma = false;
	 	}else{
	 		$scope.senha2_confirma = true;
	 	}
	}
	
	$scope.validarEmail = function(){
    	console.log("era para ter chamado validar email service");
    	 var promise = usuarioService.validarEmail($scope.email);
    	 console.log("promise " + promise);
    	 promise.success(function(value) { 
   		  console.log("value = " + value.resultado);
   		  if(value.resultado != true){
   			console.log("emailJaExiste();");
			$scope.emailValido = true ;
   		  }else{
   			console.log("emailCorreto();");
			$scope.emailValido = false ;
   		  }
   	  });
   	  promise.error(function(response, status) {
   		console.log("emailJaExiste();");
		$scope.emailValido = true ;
   	  });
	}
	
	 $scope.submitForm = function(isValid) {
	        // verifica se o formulário é válido
	        if (isValid) {
	        }
	    };
	
});


serviceApp.controller('mapa_controller'['$scope', function($scope) {
    $scope.number = 0;
    $scope.map = {
        center: {
            latitude: 35.027469,
            longitude: -111.022753
        },
        zoom: 4,
        marker: {
            id:0,
            coords: {
                latitude: 35.027469,
                longitude: -111.022753
            },
            options: {
                icon: {
                    anchor: new google.maps.Point(36,36),
                    origin: new google.maps.Point(0,0),
                    scaledSize: new google.maps.Size(72,72),
                    url: 'assets/images/cluster1.png'
                }
            }
        }
    };
    $scope.click = function() {
        $scope.number += 1;
    }
}]);