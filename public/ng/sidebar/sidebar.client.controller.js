(function(){
		
	angular.module('sidebar').controller('SidebarCtrl', SidebarCtrl).controller('LeftCtrl', LeftCtrl);
	
	SidebarCtrl.$inject = ['$scope', '$timeout', '$mdSidenav', '$log']; 
	
	LeftCtrl.$inject = ['$scope', '$timeout', '$mdSidenav', '$log'];  
	
	// ----- ControllerFunctions -----    
  	function SidebarCtrl($scope, $timeout, $mdSidenav, $log){
	
   	 	$scope.toggleLeft = buildToggler('left');
    	$scope.isOpenLeft = function(){
      		return $mdSidenav('left').isOpen();
    	};

    	/**
 	    * Supplies a function that will continue to operate until the
   	  	* time is up.
    	*/
    	function debounce(func, wait, context) {
      		var timer;

      		return function debounced() {
        		var context = $scope,
            	args = Array.prototype.slice.call(arguments);
        		$timeout.cancel(timer);
        		timer = $timeout(function() {
          			timer = undefined;
          			func.apply(context, args);
        		}, wait || 10);
      		};
    	}

    	/**
     	* Build handler to open/close a SideNav; when animation finishes
     	* report completion in console
     	*/

    	function buildToggler(navID) {
    		return function() {
      			if( window.innerWidth <= 1250){
        			// Component lookup should always be available since we are not using `ng-if`
        			$mdSidenav(navID)
	         		.toggle()
	          		.then(function () {
    	        		$log.debug("toggle " + navID + " is done");
          			});
          		}
      		}	    
	    }
    } 
  	  
	function LeftCtrl($scope, $timeout, $mdSidenav, $log){
		$scope.close = function () {
			// Component lookup should always be available since we are not using `ng-if`
			$mdSidenav('left').close()
			.then(function () {
				$log.debug("close LEFT is done");
			});
    	};
	}
	
})();


