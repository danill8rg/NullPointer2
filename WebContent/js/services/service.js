// 0 = desconectado;
var id_usuario_null_pointer = 0;

var serviceApp = angular.module('nullP', [ 'ngRoute', 'googlechart', 'ezfb','hljs',  'ui.bootstrap' ]);

serviceApp.config([ '$routeProvider', 'ezfbProvider',
		function($routeProvider, ezfbProvider) {
			$routeProvider.when('/minhasDenuncias', {
				templateUrl : 'denuncia/minhasDenuncias.html',
				controller : 'controllerMyDenuncias'
			}).when('/usuario/create', {
				templateUrl : 'usuario/create.html',
				controller : 'controller_teste'
			}).when('/usuario/conta', {
				templateUrl : 'usuario/ContaUsuario.html',
				controller : 'controller_teste'
			}).when('/home', {
				templateUrl : 'home.html',
				controller : 'controller_teste'
			}).when('/list', {
				templateUrl : 'list.html',
				controller : 'controller_teste'
			}).when('/create', {
				templateUrl : 'create.html',
				controller : 'controller_teste'
			}).when('/denuncia/detalhe/:param1', {
				templateUrl : 'denuncia/detalhe.html',
				controller : 'detalheDenunciaController'
			}).when('/delete', {
				templateUrl : 'list.html',
				controller : 'controller_teste'
			}).when('/log', {
				templateUrl : 'usuario/login.html',
				controller : 'controller_login'
			}).when('/log/:param1', {
				templateUrl : 'usuario/login.html',
				controller : 'controller_login'
			}).when('/grafico', {
				templateUrl : 'grafico/grafico.html',
				controller : 'GenericChartCtrl'
			}).

			otherwise({
				redirectTo : '/home'
			});

			ezfbProvider.setInitParams({
				appId : '458662504316602'
			});
		} ]);

serviceApp.service('usuarioService',function($http, $rootScope) { 
		var listaUsuarios = [];
		var texto = "teste texto";

		this.addUsuario = function(username, email, senha) {
			var data = {
				"nome" : username,
				"senha" : senha,
				"email" : email
			};

			//var promise_post = $http.post('http://localhost:8080/NullServer/usuario/addUser',{usuario : data});
			var promise_post = $http.post('http://rcisistemas.minivps.info:8080/NullServer/usuario/addUser',{usuario : data});
				promise_post.success(function(data, status, headers, config) {
					id_usuario_null_pointer = data.idUsuario;
					console.log("data = " + data);
					console.log("status = " + status);
					console.log("headers = " + headers);
					console.log("config = " + config);
			});
			promise_post.error(function(data, status, headers,config) {
				console.log("data = " + data);
				console.log("status = " + status);
				console.log("headers = " + headers);
				console.log("config = " + config);
			});
		};
		this.getListaUsuarios = function(callback) {
				return listaUsuarios;
		};

		this.validarEmail = function(email) {
			//return $http.get("http://localhost:8080/NullServer/usuario/validaremail/"+ email);
			return $http.get("http://rcisistemas.minivps.info:8080/NullServer/usuario/validaremail/"+ email);
		};

});

serviceApp.run(function($rootScope, usuarioService) {

});

serviceApp.controller('controller_teste', function($scope, usuarioService,ezfb, $window, $location, $http) {
	$scope.mensagemErroSalvarUsuario = false;
	
	$scope.init = function() {
		if (window.sessionStorage.getItem('idUsuario') != null) {
			id_usuario_null_pointer = window.sessionStorage.getItem('idUsuario');
			$scope.logStatus = "Sair";
		} else {
			updateLoginStatus();
			$scope.logStatus = "Logar";
			id_usuario_null_pointer = 0;
		}
	}
	$scope.init();
	
	function updateLoginStatus() {
		ezfb.getLoginStatus(function(res) {
			if(res.authResponse){
				console.log(res);
				console.log(res.authResponse.userID);
				console.log("res.name =" + res.authResponse.userID);
				console.log("res.id =" + res.authResponse.userID);
				
				var data = '{ "nome" : ' + res.authResponse.userID    +
							', "senha" : '  + res.authResponse.userID +
							', "email" : ' + res.authResponse.userID  + '}';
				
				console.log("data =" + data);
					//$http.post("http://localhost:8080/NullServer/usuario/logarFace", data
					$http.post("http://rcisistemas.minivps.info:8080/NullServer/usuario/logarFace", data
					).success(function(data) {
						if (data.idUsuario != null) {
							window.sessionStorage.setItem("idUsuario", data.idUsuario);
							id_usuario_null_pointer = data.idUsuario;
							window.location.reload();
						}
					});
				
			}else{
				console.log("Não esta logando no Face!!!");
			}
		});
	}
	
	
	function updateApiMe() {
		ezfb.api('/me', function(res) {
			$scope.apiMe = res;
		});
	}

	$scope.teste = "esta aqui porra!!!";
	$scope.senha2_confirma = false;
	$scope.emailValido = false;
	$scope.formValido = true;

	$scope.addUsuario = function() {
		var nomeUsuario = $scope.username;
		var email = $scope.email;
		var senha = $scope.senha;
		var data = {
			"nome" : nomeUsuario,
			"senha" : senha,
			"email" : email
		};
		//$http.post("http://localhost:8080/NullServer/usuario/addUser", {usuario : data}).success(
		$http.post("http://rcisistemas.minivps.info:8080/NullServer/usuario/addUser", {usuario : data}).success(
				function(data) {
					if (data.idUsuario != null) {
						window.sessionStorage.setItem("idUsuario", data.idUsuario);
						id_usuario_null_pointer = data.idUsuario;
						window.location.reload();
						$window.location.href = '#/minhasDenuncias';
					} else {
						$scope.mensagemErroSalvarUsuario = true;
						console.log("Erro ao salvar usuário!!! ");
					}
				});
	}

	$scope.validarSenhas = function() {
		if ($scope.senha2 == $scope.senha) {
			$scope.senha2_confirma = false;
		} else {
			$scope.senha2_confirma = true;
		}
	}

	$scope.validarEmail = function() {
		var promise = usuarioService.validarEmail($scope.email);
		promise.success(function(value) {
			if (value.resultado != true) {
				$scope.emailValido = true;
			} else {
				$scope.emailValido = false;
			}
		});
		promise.error(function(response, status) {
			console.log("emailJaExiste();");
			$scope.emailValido = true;
		});
	}
});

serviceApp.controller('detalheDenunciaController', function($scope,$routeParams, $http, ezfb, $window) {
	$scope.init = function() {
		if (window.sessionStorage.getItem('idUsuario') != null) {
			id_usuario_null_pointer = window.sessionStorage.getItem('idUsuario');
		} else {
			id_usuario_null_pointer = 0;
		}
		if (id_usuario_null_pointer != 0) {
			$scope.logStatus = "Sair";
		} else {
			$scope.logStatus = "Logar";
		}
	}
	$scope.init();
	var param1 = $routeParams.param1;
	$scope.idDenuncia = param1;
	if (param1 != null) {
		$http.get("http://localhost:8080/NullServer/viewDetalheDenuncia/site/"+ param1).success(
				function(data) {
					// $http.get("http://rcisistemas.minivps.info:8080/NullServer/viewDetalheDenuncia/"
					// + param1).success(function (data) {
					var lisImagem = [];
					for ( var ob in data) {
						console.log(ob + " " + ob.toString());
					}
					console.log("data = " + data.toString());
					if (data.tipoDenuncia != null) {
						$scope.tipoDenuncia = "Tipo de Denuncia : "
								+ data.tipoDenuncia;
					}
					if (data.observacao != null) {
						$scope.observacao = "O que aconteceu : "
								+ data.observacao;
					}
					if (data.dataDenuncia != null) {
						$scope.dataDenuncia = "Data que Aconteceu : "
								+ data.dataDenuncia;
					}
					if (data.listImagem != null) {
						lisImagem = data.listImagem;
					}
					if (data.nomeDenunciante != null) {
						$scope.nomeDenunciante = "Nome do Denunciante : "
								+ data.nomeDenunciante;
					}
					if (data.rua != null) {
						$scope.rua = "Local que aconteceu Rua : " + data.rua;
					}
					if (data.bairro != null) {
						$scope.bairro = "Bairro : " + data.bairro;
					}
					if (data.cidade != null) {
						$scope.cidade = "Cidade : " + data.cidade;
					}
					if (data.estado != null) {
						$scope.estado = "Estado : " + data.estado;
					}
					if (data.pais != null) {
						$scope.pais = "Pais : " + data.pais;
					}
					if (data.cep != null) {
						$scope.cep = "CEP : " + data.cep;
					}
					if (data.latitude != null) {
						$scope.latitude = "Latitude : " + data.latitude;
					}
					if (data.longitude != null) {
						$scope.longitude = "longitude : " + data.longitude;
					}
					console.log("data.listImagem = " + data.listImagem);
					var i = 0;
					for (i = 0; i < lisImagem.length; i++) {
						console.log("lisImagem.caminho = "
								+ lisImagem[i].caminho);
						$scope.caminhoImagem = lisImagem[i].caminho;
						$scope.addSlide(lisImagem[i].caminho);
					}
				});
	} else {
		console.log("param1 iqual a nullo");
	}
	$scope.teste = "detalheDenunciaController!!!";
	
	var slides = $scope.slides = [ ];
	  $scope.addSlide = function(caminho_imagem) {
		  console.log("$scope.addSlide = function()");
		if(caminho_imagem != "" ){
			console.log("caminho_imagem_upload != vazio");
			var newWidth = 600 + slides.length + 1;
		    slides.push({
		    			  image: caminho_imagem
		    		})
		}
	  };
});

serviceApp.controller("GenericChartCtrl",
	function($scope, $routeParams, $http) {
		$scope.init = function() {
			if (window.sessionStorage.getItem('idUsuario') != null) {
				id_usuario_null_pointer = "disconected"
			} else {
				id_usuario_null_pointer = 0;
			}
			if (id_usuario_null_pointer != 0) {
				$scope.logStatus = "Sair";
			} else {
				$scope.logStatus = "Logar";
			}
		}
		$scope.init();
		var data = "";
		// $http.get("http://rcisistemas.minivps.info:8080/NullServer/viewMap/quantidade").success(function
		// (data) {
		// $http.get("http://localhost:8080/NullServer/viewMap/quantidade").success(function
		// (data) {
		$http({
				method : 'GET', // support GET, POST, PUT, DELETE
				url : 'http://rcisistemas.minivps.info:8080/NullServer/viewMap/quantidade',
				//url : 'http://localhost:8080/NullServer/viewMap/quantidade',
				params : data, // GET method query string
				data : data,
				headers : {
					'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				timeout : 30000, // timeout abort AJAX
				cache : false
		}).success(function(data) {
			console.log("data = " + data);
			var row_aux = [];
			for (var i = 0; i < data.length; i++) {
				var object = data[i];
				row_aux.push({
					"c" : [ {
						"v" : object.tipo
					}, {
						"v" : object.qtde,
					} ]
				});
			}

			var col_aux = [ {
				"id" : "denuncia",
				"label" : "Denuncia",
				"type" : "string",
				"p" : {}
			}, {
				"id" : "qtd-id",
				"label" : "Quantidade",
				"type" : "number",
				"p" : {}
			} ];
			// var row_aux = [
			// { "c": [{ "v": "Drogas" }, { "v": 20, }]},
			// { "c": [{ "v": "Assalto" }, { "v": 30, }]},
			// { "c": [{ "v": "Alcool" }, { "v": 50, }]}
			// ];

			var data = {
				"cols" : col_aux,
				"rows" : row_aux
			}

			$scope.chart = {
				"type" : "ColumnChart",
				"cssStyle" : "height:200px; width:300px;",
				"data" : data,
				"options" : {
					"title" : "Denuncias por tipo",
					"isStacked" : "true",
					"fill" : 20,
					"displayExactValues" : true,
					"vAxis" : {
						"title" : "Quantidade",
						"gridlines" : {
							"count" : 5
						}
					},
					"hAxis" : {
						"title" : "Tipo de Denuncia"
					}
				},
				"formatters" : {},
				"displayed" : true
			}
		});

	});

serviceApp.controller('controllerMyDenuncias', function($scope) {
	$scope.init = function() {
		if (window.sessionStorage.getItem('idUsuario') != null) {
			id_usuario_null_pointer = window.sessionStorage.getItem('idUsuario');
			$scope.logStatus = "Sair";
		} else {
			id_usuario_null_pointer = 0;
			$scope.logStatus = "Logar";
		}
	}
	$scope.init();

});

serviceApp.controller('controller_login', function($scope, usuarioService,
		ezfb, $window, $location, $http, $routeParams) {
	$scope.init = function() {
		if (window.sessionStorage.getItem('idUsuario') != null) {
			id_usuario_null_pointer = window.sessionStorage.getItem('idUsuario');
			$scope.logStatus = "Sair";
			$scope.log = false;
		} else {
			id_usuario_null_pointer = 0;
			$scope.logStatus = "Logar";
			$scope.log = true;
		}
		if($routeParams.param1 != null && $routeParams.param1  == 1){
			$scope.avisoDeslocado = true;
		}else{
			$scope.avisoDeslocado = false;
		}
		
		$scope.deslocarApp = function(){
			window.sessionStorage.clear();
			id_usuario_null_pointer = 0;
			$scope.logout();
			window.location.reload();
			$window.location.href = '#/log/1';
		};
		
	}
	
	$scope.init();

	$scope.avisoUser = false;

	$scope.logarApp = function() {
		var data = {
			"senha" : $scope.senha,
			"email" : $scope.email
		};

		//$http.post("http://localhost:8080/NullServer/usuario/logar", {
		$http.post("http://rcisistemas.minivps.info:8080/NullServer/usuario/logar", {
			usuario : data
		}).success(function(data) {
			if (data.idUsuario != null) {
				window.sessionStorage.setItem("idUsuario", data.idUsuario);
				id_usuario_null_pointer = data.idUsuario;
				window.location.reload();
				$window.location.href = '#/minhasDenuncias';
			} else {
				openMensagem();
			}
		});
	}

	openMensagem = function() {
		$scope.avisoUser = true;
	};

	$scope.closeMensagem = function() {
		$scope.avisoUser = false;
	}

	updateLoginStatus(updateApiMe);

	$scope.login = function() {
		ezfb.login(function(res) {
			if(res.authResponse){
				console.log(res);
				console.log(res.authResponse.userID);
				console.log("res.name =" + res.authResponse.userID);
				console.log("res.id =" + res.authResponse.userID);
				
				var data = '{ "nome" : ' + res.authResponse.userID    +
							', "senha" : '  + res.authResponse.userID +
							', "email" : ' + res.authResponse.userID  + '}';
				
				console.log("data =" + data);
					//$http.post("http://localhost:8080/NullServer/usuario/logarFace", data
					$http.post("http://rcisistemas.minivps.info:8080/NullServer/usuario/logarFace", data
					).success(function(data) {
						if (data.idUsuario != null) {
							window.sessionStorage.setItem("idUsuario", data.idUsuario);
							id_usuario_null_pointer = data.idUsuario;
							window.location.reload();
							$window.location.href = '#/minhasDenuncias';
						} else {
							openMensagem();
						}
					});
			}
		}, {
			scope : 'email,user_likes'
		});
	};

	$scope.logout = function() {
		ezfb.logout(function() {
			updateLoginStatus(updateApiMe);
		});
		if (window.sessionStorage.getItem('idUsuario') != null) {
			window.sessionStorage.removeItem('idUsuario');
		}
		id_usuario_null_pointer = 0;
	};

	var autoToJSON = [ 'loginStatus', 'apiMe', ];
	angular.forEach(autoToJSON, function(varName) {
		$scope.$watch(varName, function(val) {
			$scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
		}, true);
	});

	function updateLoginStatus(more) {
		ezfb.getLoginStatus(function(res) {
			$scope.loginStatus = res;
			(more || angular.noop)();
		});
	}

	function updateApiMe() {
		ezfb.api('/me', function(res) {
			$scope.apiMe = res;
		});
	}

});