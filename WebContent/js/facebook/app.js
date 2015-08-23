var app = angular.module('plunker', ['ezfb', 'hljs', 'ngRoute'])

.config(['$routeProvider','ezfbProvider', function ($routeProvider, ezfbProvider) {
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
	  
  
}])

.controller('MainCtrl', function($scope, ezfb, $window, $location, $http, $routeParams) {
  
  updateLoginStatus(updateApiMe);
  
  $scope.pluginOn = true;
  $scope.rendering = false;

  $scope.login = function () {
    /**
     * Calling FB.login with required permissions specified
     * https://developers.facebook.com/docs/reference/javascript/FB.login/v2.0
     */
    ezfb.login(function (res) {
      /**
       * no manual $scope.$apply, I got that handled
       */
      if (res.authResponse) {
        updateLoginStatus(updateApiMe);
      }
    }, {scope: 'email,user_likes'});
  };

  $scope.logout = function () {
    /**
     * Calling FB.logout
     * https://developers.facebook.com/docs/reference/javascript/FB.logout
     */
    ezfb.logout(function () {
      updateLoginStatus(updateApiMe);
    });
  };

  $scope.share = function () {
    ezfb.ui(
      {
        method: 'feed',
        name: 'angular-easyfb API demo',
        picture: 'http://plnkr.co/img/plunker.png',
        link: 'http://plnkr.co/edit/qclqht?p=preview',
        description: 'angular-easyfb is an AngularJS module wrapping Facebook SDK.' + 
                     ' Facebook integration in AngularJS made easy!' + 
                     ' Please try it and feel free to give feedbacks.'
      },
      function (res) {
        // res: FB.ui response
      }
    );
  };

  /**
   * For generating better looking JSON results
   */
  var autoToJSON = ['loginStatus', 'apiMe', ]; 
  angular.forEach(autoToJSON, function (varName) {
    $scope.$watch(varName, function (val) {
      $scope[varName + 'JSON'] = JSON.stringify(val, null, 2);
    }, true);
  });
  
  /**
   * Update loginStatus result
   */
  function updateLoginStatus (more) {
    ezfb.getLoginStatus(function (res) {
      $scope.loginStatus = res;

      (more || angular.noop)();
    });
  }

  /**
   * Update api('/me') result
   */
  function updateApiMe () {
    ezfb.api('/me', function (res) {
      $scope.apiMe = res;
    });
  }
  
  var test = "" + $routeParams.param1;
  console.log("$routeParams.param1 = " + test);
  
  var param1 = 2;
	
	$scope.idDenuncia = param1;

	if(param1 != null){
		 //$http.get("http://rcisistemas.minivps.info:8080/NullServer/denuncia/" + param1).success(function (data) {
		$http.get("http://rcisistemas.minivps.info:8080/NullServer/denuncia/" + param1).success(function (data) {
			 console.log("data = " + data.tipoDenuncia);
			 $scope.tipoDenuncia = data.tipoDenuncia;
			 $scope.observacao = data.observacao;
			 $scope.dataDenuncia = data.dataDenuncia;
			 var lisImagem = data.listImagem;
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
});
