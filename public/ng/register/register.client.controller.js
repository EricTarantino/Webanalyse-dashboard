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
        user.mmdbStartDate = "";
        user.mmdbEndDate = "";

        user.registerSubmit = registerSubmit;
        user.loginSubmit = loginSubmit;
        user.logout = logout;

		//	On registration, the user gets also a date for the management dashboard, 
		//	the default value is start date yesterday and next date tomorrow. 
        function registerSubmit() {
        	
      		//create a new end date
       		var endDate = new Date();
        		
       		var yesterday = new Date();

			yesterday.setDate(yesterday.getDate() - 1);
		        	
       		var dayEnd = '';
			if(parseInt(endDate.getDate(), 10) < 10){
				dayEnd = "0"+endDate.getDate() 
			}else{
				dayEnd = endDate.getDate()
			}
				
			var monthEnd = '';
			if(parseInt(endDate.getMonth(), 10) < 10){
				monthEnd = "0"+endDate.getMonth() 
			}else{
				monthEnd = endDate.getMonth()
			}
								
			var dayStart = '';
			if(parseInt(yesterday.getDate(), 10) < 10){
				dayStart = "0"+yesterday.getDate() 
			}else{
				dayStart = yesterday.getDate()
			}		
				
			var monthStart = '';
			if(parseInt(yesterday.getMonth(), 10) < 10){
				monthStart = "0"+yesterday.getMonth() 
			}else{
				monthStart = yesterday.getMonth()
			}
		
	  		user.mmdbStartDate = ""+yesterday.getFullYear()+"m"+(parseInt(monthStart)+1)+"d"+(parseInt(dayStart))+"h00";
	  		user.mmdbEndDate = ""+endDate.getFullYear()+"m"+(parseInt(monthEnd)+1)+"d"+(parseInt(dayEnd))+"h00";  
	  		alert(1)
       		//alert(JSON.stringify(user));
       		
        	RegisterSvc.register(user.name, user.password,  user.email, user.rights, user.mmdbStartDate, user.mmdbEndDate)
            //RegisterSvc.register(user.name, user.password, user.email, user.rights, user.mmdbStartDate, user.mmdbEndDate)
            //now what exactly is this user, does it come from the post request answer or all the way from the following returns 
            //and the final get request.
            //The user in function(user) is the last return of the register.svc.js file which is not the register route itself
            //But the get user request
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

        }
	}
})();


