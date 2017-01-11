//TODO This controller makes calles to the database for every single graph, the graphs use the scope of this controller

//TODO make a call from here to the database and fetch updated data

(function(){

	angular.module('analytics').controller('analyticsCtrl', analyticsCtrl);

	//Login injections
	analyticsCtrl.$inject = ['$scope', '$mdDialog'];
	
	
	function analyticsCtrl($scope,  $mdDialog){
		
	//opens the dialog
  $scope.showAdvanced = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'dialog1.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };
  
  //controller for the dialog
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
  
  
		
	}
	
})();

/*
angular.module('analytics').controller('analyticsGraphCtrl', function($scope, $mdDialog) {
    
 	 	//TODO make broadcast to upper level	 

  
  /*
  		vm.myDateVon = new Date();
		
		vm.myDateBis = new Date();
  */
 /*
  
  		$scope.analyticsGraph1 = '.analyticsGraph1';
  
  		$scope.analyticsGraph2 = '.analyticsGraph2';
  		
*/
  /*
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
   			templateUrl: '../templates/newgraphDialog.ejs',
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
  	}*/
//	});

/*.config(function($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
}    
    
    
    
    
  /*
  //TODO Add ability for metric and dimension
    
  //Every graph template has two selectors, one for dimension and one for metric
  $scope.items = [1, 2, 3, 4, 5, 6, 7];
  $scope.selectedItem = 1;
  $scope.getSelectedText = function() {
    if ($scope.selectedItem !== undefined) {
      return "You have selected: Item " + $scope.selectedItem;
    } else {
      return "Please select an item";
    }
  };
      
  $scope.$watch('selectedItem', function() {
  	//TODO API: update den Graph in der Datenbank UND antworte mit Daten (ignore settings)
  	//TODO take settings into account
  });
  */    
//});
    
    /*
    .controller('analyticsGraph2Ctrl', function($scope) {
      $scope.items = [1, 2, 3, 4, 5, 6, 7];
      $scope.selectedItem;
      $scope.getSelectedText = function() {
        if ($scope.selectedItem !== undefined) {
          return "You have selected: Item " + $scope.selectedItem;
        } else {
          return "Please select an item";
        }
      };
    });
    */