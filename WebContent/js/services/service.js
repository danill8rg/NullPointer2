/**
 * 
 */

var serviceApp = angular.module('nullP', ['plunker','ngRoute', 'googlechart','ezfb', 'hljs',]);

// Note: Providers can only be injected into config functions. Thus you could not inject $routeProvider into PhoneListCtrl. 
serviceApp.config(['$routeProvider','ezfbProvider',
 function($routeProvider, ezfbProvider) {
   $routeProvider.
     when('/usuario/create', { templateUrl: 'usuario/create.html', controller: 'controller_teste'}).
     when('/usuario/conta', { templateUrl: 'usuario/ContaUsuario.html', controller: 'controller_teste'}).
     when('/home', { templateUrl: 'home.html', controller: 'controller_teste'}).
     when('/list', { templateUrl: 'list.html', controller: 'controller_teste'}).
     when('/create', { templateUrl: 'create.html', controller: 'controller_teste'}).
     when('/denuncia/detalhe/:param1', { templateUrl: 'denuncia/detalhe.html', controller: 'detalheDenunciaController'}).
     when('/delete', { templateUrl: 'list.html', controller: 'controller_teste'}).
     when('/grafico', { templateUrl: 'grafico/grafico.html', controller: 'GenericChartCtrl'}).
     
     otherwise({
       redirectTo: '/home'
     });
   
   ezfbProvider.setInitParams({
	    appId: '458662504316602'
	  });  
 }
]);

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
	  
	  var promise_post = $http.post('http://rcisistemas.minivps.info:8080/NullServer/usuario/addUser', {usuario:data});
	  
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
  
  var promise = $http.get("http://rcisistemas.minivps.info:8080/NullServer/usuario/all");  
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
	  return $http.get("http://rcisistemas.minivps.info:8080/NullServer/usuario/validaremail/" + email);  
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

serviceApp.controller('detalheDenunciaController', function($scope, $routeParams, $http, ezfb, $window) {
	var param1 = $routeParams.param1;
	
	$scope.idDenuncia = param1;

	if(param1 != null){
		 //$http.get("http://rcisistemas.minivps.info:8080/NullServer/viewDetalheDenuncia/" + param1).success(function (data) {
		 $http.get("http://rcisistemas.minivps.info:8080/NullServer/viewDetalheDenuncia/" + param1).success(function (data) {
			 var lisImagem = [];
			 for(var ob in data){
				console.log(ob + " " + ob.toString());
			}
			 console.log("data = " + data.toString());
			 if(data.tipoDenuncia != null){
				 $scope.tipoDenuncia = "Tipo de Denuncia : " + data.tipoDenuncia;
			 }
			 if(data.observacao != null){
				 $scope.observacao = "O que aconteceu : " + data.observacao;
			 }
			 if(data.dataDenuncia != null){
				 $scope.dataDenuncia = "Data que Aconteceu : " + data.dataDenuncia;
			 }
			 if(data.listImagem != null){
				 lisImagem = data.listImagem;
			 }
			 if(data.nomeDenunciante != null){
				 $scope.nomeDenunciante = "Nome do Denunciante : " + data.nomeDenunciante ;
			 }
			 if(data.rua != null){
				 $scope.rua = "Local que aconteceu Rua : " + data.rua ;
			 }
			 if(data.bairro != null){
				 $scope.bairro = "Bairro : " + data.bairro ;
			 }
			 if(data.cidade != null){
				 $scope.cidade = "Cidade : " + data.cidade ;
			 }
			 if(data.estado != null){
				 $scope.estado = "Estado : " + data.estado ;
			 }
			 if(data.pais != null){
				 $scope.pais = "Pais : " + data.pais ;
			 }
			 if(data.cep != null){
				 $scope.cep = "CEP : " + data.cep ;
			 }
			 if(data.latitude != null){
				 $scope.latitude = "Latitude : " + data.latitude ;
			 }
			 if(data.longitude != null){
				 $scope.longitude = "longitude : " + data.longitude ;
			 }
			 console.log("data.listImagem = " + data.listImagem);
			 var i = 0;
			 for (i = 0; i < lisImagem.length; i++) { 
				 console.log("lisImagem.caminho = " + lisImagem[i].caminho);
				 $scope.caminhoImagem = lisImagem[i].caminho;
			 }
 	      });            
	}else{
		console.log("param1 iqual a nullo");
	}
	$scope.teste = "detalheDenunciaController!!!";	
});

serviceApp.controller("GenericChartCtrl", function ($scope , $routeParams, $http) {
	var data = "";
	//$http.get("http://rcisistemas.minivps.info:8080/NullServer/viewMap/quantidade").success(function (data) {
	//$http.get("http://localhost:8080/NullServer/viewMap/quantidade").success(function (data) {
	$http({
	    method: 'GET', // support GET, POST, PUT, DELETE
	    url: 'http://rcisistemas.minivps.info:8080/NullServer/viewMap/quantidade',
	    params: data, // GET method query string
	    data: data,
	    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
	    timeout: 30000, // timeout abort AJAX
	    cache: false
	}).success(function (data) {	
	console.log("data = " + data);
		 var row_aux = [];
		 for (var i = 0; i < data.length; i++) {
			    var object = data[i];
			    row_aux.push({"c":[{ "v": object.tipo }, { "v": object.qtde , }] });
			}
		 
		 var col_aux = [	{
				"id": "denuncia",
				"label": "Denuncia",
				"type": "string",
	            "p": {}
			}, 
			{
				 "id": "qtd-id",
	               "label": "Quantidade",
	               "type": "number",
	               "p": {}
			}]; 
//var row_aux = [	
//        	{ "c": [{ "v": "Drogas" }, { "v": 20, }]},
//        	{ "c": [{ "v": "Assalto" }, { "v": 30, }]},
//        	{ "c": [{ "v": "Alcool" }, { "v": 50, }]}
//       ]; 

var data = 	{
				"cols": col_aux,
				"rows": row_aux
	       	}

$scope.chart = {
		  "type": "ColumnChart",
		  "cssStyle": "height:200px; width:300px;",
		  "data": data,
		  "options": {
		    "title": "Denuncias por tipo",
		    "isStacked": "true",
		    "fill": 20,
		    "displayExactValues": true,
		    "vAxis": {
		      "title": "Quantidade",
		      "gridlines": {
		        "count": 5
		      }
		    },
		    "hAxis": {
		      "title": "Tipo de Denuncia"
		    }
		  },
		  "formatters": {},
		  "displayed": true
		}
      });
    
});
