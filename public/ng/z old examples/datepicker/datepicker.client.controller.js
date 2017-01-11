(function(){
		
	angular.module('datepicker').controller('DatepickerCtrl', DatepickerCtrl);
	
	//Login injections
 	DatepickerCtrl.$inject = ['$scope']; 
  
	// ----- ControllerFunction -----    
  	function DatepickerCtrl($scope){
		
		var dp = this;
		
		dp.myDateVon = new Date();
		
		dp.myDateBis = new Date();
		
		dp.maxDateVon = new Date(
      		dp.myDateVon.getFullYear(),
      		dp.myDateVon.getMonth(),
      		dp.myDateVon.getDate());
      		
      	dp.maxDateBis = new Date(
      		dp.myDateBis.getFullYear(),
      		dp.myDateBis.getMonth(),
      		dp.myDateBis.getDate());
		
	}
	
})();


