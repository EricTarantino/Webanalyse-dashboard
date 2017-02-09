(function(){
		
	angular.module('management').controller('ManagementCtrl', ManagementCtrl);
	
	//Login injections
 	ManagementCtrl.$inject = ['$scope', '$location', 'ManagementSvc'];
  
	// ----- ControllerFunction -----    
  	function ManagementCtrl($scope, $location, ManagementSvc){
		
		var vm = this;
		
		vm.accessRight = null;
		//route of the graph icon
		vm.graphIconPath = "../../icon/managementGraphView.svg"
		vm.graphTemplate = ".3dBar";
		vm.imageLeadsShow = true;
		vm.imagePath = "../../img/bosch_background_small.jpg"
		//this variable defines if the cover Image covers the Number
		vm.imageUmsatzShow = true;
		vm.imageVisitsShow = true;
		vm.leads  = { Gesamt: "-", DIY: "0", PRO: "0", HG: "0" }
		//this variable defines the percentages
		vm.percentUmsatz = "+ 1.4 %";
		vm.percentVisits = "- 2.3 %";
		vm.percentLeads  = "+ 3.0 %";
		
		//this is the text of the toggle button
		vm.toggleButtonUmsatz = "Einblenden";
		vm.toggleButtonVisits = "Einblenden";
		vm.toggleButtonLeads = "Einblenden";			
		//this variable defines the number, it depends on the access right
		vm.umsatz = { Gesamt: "-", DIY: "0", PRO: "0", HG: "0" } 
		vm.visits = { Gesamt: "-", DIY: "0", PRO: "0", HG: "0" }
		
		$scope.bisRefreshed = false;
		$scope.vonRefreshed = false;
							
		//if the access changes, use the accessChanged function
		$scope.$on('access', accessChanged);
	
		vm.accessChange = accessChange;
		vm.accessChanged = accessChanged;		
		vm.leadsGraph = leadsGraph;
		//change the available date
		vm.refreshManagementDB = refreshManagementDB;
		vm.setNumber = setNumber;
		//this variable defines the functions that are called by the toggle button
		vm.toggleLeads  = toggleLeads;
		vm.toggleUmsatz = toggleUmsatz;
		vm.toggleVisits = toggleVisits;
		//funcitons for the routing
		vm.umsatzGraph = umsatzGraph;
		vm.visitsGraph = visitsGraph;	
		//function to change the size
		vm.zoomin = zoomin;
		vm.zoomout = zoomout;
		
		function accessChange(useraccess){
			//alert("currentDB is: " + vm.currentDB)
			var managementCards = document.getElementById("managementCards");
    	   	var managementLoader = document.getElementById("managementLoader");
       		managementCards.style.visibility = 'hidden';
       		managementLoader.style.display = 'block';
			ManagementSvc.changeAccess(useraccess[0])
			//Use the return data to change the key indicators
			.then(function(data){
				vm.umsatz.Gesamt = JSON.parse(data).PageViews;
				vm.visits.Gesamt = JSON.parse(data).Visits;
				vm.leads.Gesamt = JSON.parse(data).Visitors;

	       		managementCards.style.visibility = 'visible';
	       		managementLoader.style.display = 'none';
			})
		}	
		function accessChanged( _ , access){//receive the data as second parameter
			setNumber(access);
			//$scope.$broadcast('access', access);
		}				
		function leadsGraph(){
			$location.path('/management/3dGraph');
			//updateGraphdata();
		}
		function refreshManagementDB(von){l
			if(von===true){
				$scope.vonRefreshed = true;
				
				if($scope.bisRefreshed === false){					
					return	
				}
			}
			
			if(von===false){
				$scope.bisRefreshed = true;
				if($scope.vonRefreshed === false){					
					return	
				}
			}
			//on refresh data, make a post to change the time range, on succes, 
			//receive the new management dashboard
			//alert("start date "+$scope.mmdbStartDate);
			//alert("end date "+$scope.mmdbEndDate);
			//alert("start date day "+$scope.mmdbStartDate.getDate());
			//alert("end date day "+$scope.mmdbEndDate.getDate());
			//alert("start date month "+$scope.mmdbStartDate.getMonth());
			//alert("end date month "+$scope.mmdbEndDate.getMonth());
			//transform the date for webtrends purpose
			//this may needs to be a module for itself	
			//depending on the data source, there may 
			//be different transormation needed	
  	     	var managementCards = document.getElementById("managementCards");
    	   	var managementLoader = document.getElementById("managementLoader");
       		managementCards.style.visibility = 'hidden';
       		managementLoader.style.display = 'block';
			//parse the day, if it is a single digit, prepend a zero
			var dayStart = parseInt($scope.mmdbStartDate.getDate(), 10);
			if(dayStart <= 9){
				dayStart = "0"+dayStart;
			}
			//alert("parsed start date day "+dayStart);			
			//Month is by default January as 0, so we have to add 1 to match Webtrends API;
			var monthStart = parseInt($scope.mmdbStartDate.getMonth(), 10)+1;			
			if(monthStart <= 9){
				monthStart = "0"+monthStart;
			}
			//alert("parsed start date month "+monthStart);	
			//parse the day, if it is a single digit, prepend a zero		
			var dayEnd = parseInt($scope.mmdbEndDate.getDate(), 10);
			if(dayEnd <= 9){
				dayEnd = "0"+dayEnd;
			}
			//alert("parsed end date day "+dayEnd);			
			//Month is by default January as 0, so we have to add 1 to match Webtrends API;
			var monthEnd = parseInt($scope.mmdbEndDate.getMonth(), 10)+1;			
			if(monthEnd <= 9){
				monthEnd = "0"+monthEnd;
			}
			//alert("parsed end date month "+monthEnd);
			var startDate = ""+$scope.mmdbStartDate.getFullYear()+"m"+monthStart+"d"+dayStart+"h00";
	  		var endDate   = ""+$scope.mmdbEndDate.getFullYear()+"m"+monthEnd+"d"+dayEnd+"h00";
			ManagementSvc.changeTimeRange(startDate, endDate)
			.then(function(data){
				//alert("got the result "+data);
				//alert("got the result "+JSON.stringify(data));
				vm.umsatz.Gesamt = JSON.parse(data).PageViews;
				vm.visits.Gesamt = JSON.parse(data).Visits;
				vm.leads.Gesamt = JSON.parse(data).Visitors;
				
	       		managementCards.style.visibility = 'visible';
	       		managementLoader.style.display = 'none';
			})
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
		function toggleLeads(){
			if(vm.imageLeadsShow){
				vm.toggleButtonLeads = "Ausblenden";
				vm.imageLeadsShow = false;			
			} else {
				vm.toggleButtonLeads = "Einblenden";
				vm.imageLeadsShow = true;
			}			
		}
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
	}
})();


