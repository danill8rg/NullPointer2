/**
 * 
 */
var serviceApp = angular.module('nullP', []);

serviceApp.service('usuarioService', function($http) {
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
  
  this.addUsuarioIntoCollection = function(idUsuario,email, nome, ativo ) {
	  listaUsuarios.push(new Usuario(idUsuario, email,nome,ativo));
  };

  this.getListaUsuarios = function(callback) {
	  	return listaUsuarios;
	  };
  
//  this.getListaUsuarios = function() {
//	  //listaUsuarios = $http.get('http://localhost:8087/NullServer/usuario/all').success(callback);
//	  return listaUsuarios;
//  };
  
  this.getTexto = function() {
	  this.texto = "testando serio!!!";
	  return this.texto;
  };
  
  this.getTextoHttp = function() {
	  
  };
  
  
  var promise = $http.get("http://localhost:8087/NullServer/usuario/all");  
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
  
  
});


serviceApp.controller('controller_teste', function($scope, usuarioService) {
	
	$scope.listaUsuarios = usuarioService.getListaUsuarios();	
	
	$scope.addUsuario = function() {
		usuarioService.addUsuarioIntoCollection($scope.idUsuario,$scope.email, $scope.nome, $scope.ativo);
		$scope.email = '';
		$scope.nome = '';
		$scope.idUsuario = '';
		$scope.ativo = '';
	}
	
	$scope.texto =  usuarioService.getTexto();
	
	
	$scope.alterarTexto = function() {
		  $http({
		        method: 'GET',
		        url: 'http://localhost:8087/NullServer/usuario/all'
		    })
		    .sucess (function (data, status, headers, config) {
		    	$scope.texto = "beleza";
		    })
		    .error (function (data, status, headers, config) {
		    	$scope.texto = "merda";
		    });
	}
	
});
