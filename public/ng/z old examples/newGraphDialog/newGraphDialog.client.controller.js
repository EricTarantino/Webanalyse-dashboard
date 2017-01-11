(function(){

	angular.module('newGraphDialog').controller('DialogCtrl', DialogCtrl);

	//Login injections
	DialogCtrl.$inject = ['$scope', '$mdDialog'];
	
	
	function DialogCtrl($scope,  $mdDialog){
		
	
		
	}
	
})();
	/*
				//TODO initialize dates with new Date()
  		$scope.graphSetting = {
      		name: 'Name',
      		kategorie: 'Keine',
      		graph: '3dBar',
      		startDate : null,
      		endDate: null
  		};	
 	 	//TODO make broadcast to upper level	 

  
  /*
  		vm.myDateVon = new Date();
		
		vm.myDateBis = new Date();
  */
 /*
  
  		$scope.analyticsGraph1 = '.analyticsGraph1';
  
  		$scope.analyticsGraph2 = '.analyticsGraph2';
  
  		$scope.kategories = ('Keine K1 K2 K3 K4').split(' ').map(function(kategorie) {
      		return {abbrev: kategorie};
  		});
      
  		$scope.graphs = ('3dBar Line Pie').split(' ').map(function(graph) {
      		return {abbrev: graph};
   		});
	
  		$scope.status = '  ';
  		$scope.customFullscreen = false;

  		$scope.showAdvanced = function(ev) {
    		$mdDialog.show({
      			controller: DialogController,
      			templateUrl: '../templates/newgraph.ejs',
      			parent: angular.element(document.body),
      			targetEvent: ev,
      			clickOutsideToClose:true,
      			fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    		})
      		.then(function(answer){
      			//TODO Callback function on response use svc get data (like login) and broadcast result to app.js
      			//TODO Then show graph on Frontend, this is an ng-show div, which is hidden or not hidden
      			//newdbDialogSvc.postGraph($scope.graphSettings);
    		});
  		};
  	};
  	
  	function DialogController($scope, $mdDialog) {
    	$scope.hide = function() {
      		$mdDialog.hide();
    	};

    	$scope.cancel = function() {
      		$mdDialog.cancel();
    	};

    	$scope.answer = function(answer) {
      		$mdDialog.hide(answer);
    	};
  	}
}).config(function($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
}
	*/



