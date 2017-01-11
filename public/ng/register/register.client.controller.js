(function(){
		
	angular.module('register').controller('RegisterCtrl', RegisterCtrl);
	
	//Login injections
 	RegisterCtrl.$inject = ['$scope', 'RegisterSvc', '$location']; 
  
	// ----- ControllerFunction -----    
  	function RegisterCtrl($scope, RegisterSvc, $location){
				
		var user = this;
        user.name = "";
        user.password = "";
        user.email = "";
        user.rights = "";

        user.registerSubmit = registerSubmit;
        user.loginSubmit = loginSubmit;
        user.logout = logout;

        function registerSubmit() {      	
        	
            RegisterSvc.register(user.name, user.password, user.email, user.rights)
            .then(function(user){
            	$scope.$emit('login', [user])
      			$location.path('/management')
    		})
        }  
        
        function loginSubmit() {        	      	
        	
            RegisterSvc.login(user.email, user.password)
            .then(function(user){

            	$scope.$emit('login', [user])
      			$location.path('/management')
    		})
        }
        
        
        function logout() {
        	/*
        	alert("in logout")
        	user.name = null;
        	user.password = null;
        	user.email = null;
        	user.rights = null;	        	
            $scope.$emit('logout', [user] )
      		$location.path('/signout')*/
        }
	}
})();


