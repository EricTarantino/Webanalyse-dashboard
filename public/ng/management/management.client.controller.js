(function(){
		
	angular.module('management').controller('ManagementCtrl', ManagementCtrl);
	
	//Login injections
 	ManagementCtrl.$inject = ['$scope', '$location']; 
  
	// ----- ControllerFunction -----    
  	function ManagementCtrl($scope, $location){
		
		var vm = this;
		
		vm.imagePath = "../../img/bosch_background_small.jpg"
		
		//this is the text of the toggle button
		vm.toggleButtonUmsatz = "Einblenden";
		vm.toggleButtonVisits = "Einblenden";
		vm.toggleButtonLeads = "Einblenden";
	
		//this variable defines if the cover Image covers the Number
		vm.imageUmsatzShow = true;
		vm.imageVisitsShow = true;
		vm.imageLeadsShow = true;
		
		//this variable defines the percentages
		vm.percentUmsatz = "+ 1.4 %";
		vm.percentVisits = "- 2.3 %";
		vm.percentLeads  = "+ 3.0 %";
		
		//this variable defines the number, it depends on the access right
		vm.umsatz = "45,607 Mrd";
		vm.visits = "18,98 Mio";
		vm.leads  = "12,31 Mio";	
		
		vm.accessRight = null;
		
		//this variable defines the functions that are called by the toggle button
		vm.toggleUmsatz = toggleUmsatz;
		vm.toggleVisits = toggleVisits;
		vm.toggleLeads  = toggleLeads;
		
		//function to change the size
		vm.zoomin = zoomin;
		vm.zoomout = zoomout;
		
		//route of the graph icon
		vm.graphIconPath = "../../icon/managementGraphView.svg"
		
		//funcitons for the routing
		vm.umsatzGraph = umsatzGraph;
		vm.visitsGraph = visitsGraph;
		vm.leadsGraph = leadsGraph;
		
		vm.graphTemplate = ".3dBar";
				
		$scope.$on('access', accessChanged);
		
		function toggleUmsatz(){			
			if(vm.imageUmsatzShow){
				vm.toggleButtonUmsatz = "Ausblenden";
				vm.imageUmsatzShow = false;
			} else {
				vm.toggleButtonUmsatz = "Einblenden";
				vm.imageUmsatzShow = true;
			}
		}
				
		function toggleVisits(){
			if(vm.imageVisitsShow){
				vm.toggleButtonVisits = "Ausblenden";
				vm.imageVisitsShow = false;			
			} else {
				vm.toggleButtonVisits = "Einblenden";
				vm.imageVisitsShow = true;	
			}			
		}		
		
		function toggleLeads(){
			if(vm.imageLeadsShow){
				vm.toggleButtonLeads = "Ausblenden";
				vm.imageLeadsShow = false;			
			} else {
				vm.toggleButtonLeads = "Einblenden";
				vm.imageLeadsShow = true;
			}			
		}
		
		function zoomout (id){

			if(document.getElementById(id).className === "col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"){
				document.getElementById(id).className = "col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-2";
			}
			else if(document.getElementById(id).className === "col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"){
				document.getElementById(id).className = "col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4";
			}
			else if(document.getElementById(id).className === "col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8"){
				document.getElementById(id).className = "col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6";
			}			
		}
		
		function zoomin (id){
	
			if(document.getElementById(id).className === "col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-2"){
				document.getElementById(id).className = "col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4";
			}
			else if(document.getElementById(id).className === "col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4"){
				document.getElementById(id).className = "col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6";
			}
			else if(document.getElementById(id).className === "col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6"){
				document.getElementById(id).className = "col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8";
			}
		}
		
		/*
		function updateGraphdata(){
			$scope.emit('graphDataUpdate', _ )
		}
		*/
		
		function umsatzGraph(){
			$location.path('/management/3dGraph');
			//updateGraphdata();
		}
		
		function visitsGraph(){
			$location.path('/management/3dGraph');
			//updateGraphdata();
		}
				
		function leadsGraph(){
			$location.path('/management/3dGraph');
			//updateGraphdata();
		}
		
		function accessChanged( _ , access){//receive the data as second parameter
			setNumber(access);
			//$scope.$broadcast('access', access);
		}
		
		function setNumber(access){
			if(access==="Gesamt"){
 	 			vm.umsatz = "45,607 Mrd";
				vm.visits = "18,98 Mio";
				vm.leads  = "12,31 Mio";	
 	 		}
  			if(access==="DIY"){
  				//1/3 Umsatz
  				vm.umsatz = "15,202 Mrd";
				vm.visits = "6,32 Mio";
				vm.leads  = "4,10 Mio";	
	  		}
	  		if(access==="PRO"){
	  			//1/4 Umsatz
	  			vm.umsatz = "11,401 Mrd";
				vm.visits = "4,74 Mio";
				vm.leads  = "3,07 Mio";	
	  		}
	  		if(access==="HG"){
	  			//5/12 Umsatz
	  			vm.umsatz = "19,00 Mrd";
				vm.visits = "7,01 Mio";
				vm.leads  = "5,13 Mio";	
	  		}
		}		
	}
})();


