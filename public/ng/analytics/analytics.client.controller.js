angular.module('analytics')

.controller('analyticsCtrl', function($scope, AnalyticsSvc, DBSvc,  $mdDialog, $mdToast) {
	//scope variables
	$scope.currentDB = "";
	$scope.customFullscreen = true;
	$scope.datatable = [];
	$scope.datatableJSON;    
	$scope.datatableString;
	//variables for the graph setting in new graph dialog, variables to hold the user input
	$scope.graphSetting = {name: 'Name',kategorie: 'Keine',graph: '3dBar',startDate : '',endDate: ''}; 
	//This is a test data List, angular data table
	$scope.nutritionList = [];
	$scope.test = true;
	$scope.topIndex = 0;
 
	
	//functions
	$scope.click = click;
	$scope.deleteDB = deleteDB;
	$scope.deleteGraph = deleteGraph;
	$scope.deleteRowCallback = deleteRowCallback;
	$scope.selectedRowCallback = selectedRowCallback;
	$scope.showAdvanced = showAdvanced;
	$scope.showNewDBDialog = showNewDBDialog;
	$scope.setDB = setDB;
	$scope.zoomin = zoomin;
	$scope.zoomout = zoomout;
	
	function click(){
        	$scope.topIndex = 0;
    }        
	/*This funciton is called by the delete button in the analytics view.
	this function deletes a dashboard, emits delete to the app controller
	the dashboard is taken out of the database. If the delete request is sucessful,
	dashboard data is deleted localy as well. If the delete request is not succesfull,
	the dashboard name is pushed back into the dashbaord array vm.myddd*/  
	function deleteDB(db_name){  	
		$scope.$emit('deleteDB', [db_name]);
	  	DBSvc.deleteDB(db_name, $scope); 	
	}  
	function deleteGraph(db_name, graph_name){  	
	  	$scope.$emit('deleteGraph', [db_name, graph_name]);
	  	DBSvc.deleteDB(db_name, graph_name, $scope);	
	}
	function deleteRowCallback(rows){
	    /*$mdToast.show(
	        $mdToast.simple()
	            .content("Deleted")
	            .hideDelay(3000)
	            .position('bottom center')
	    );
	    */
	   alert("Elemente gelöscht")
	};
	function selectedRowCallback(rows){
		/*
	    $mdToast.show(
		    $mdToast.simple()
		        .content("Selected")
		        .hideDelay(3000)
		        .position('bottom center')
	    );
	    */
	    alert("Zeilenauswahl")
	};
	function setDB(db_name){
	  	//alert(db_name);
	  	$scope.$emit('currentDBChange', [db_name]);
	  	$scope.currentDB = db_name;
	  	$scope.CDB = db_name;
	  	//alert(db_name)
	    //TODO getDashboardGraphs - for every graph: get plot data run through array    
	}
	//Show the graph select dialog
	function showAdvanced(ev) { 
	    //alert ("currentDB " + $scope.currentDB)
	  	if( $scope.currentDB === null) {
	  		return 
	  	}
	    $mdDialog.show({
		    controller: DialogController,
		    templateUrl: '../templates/newgraphDialog.ejs',
		    parent: angular.element(document.body),
		    targetEvent: ev,
		    clickOutsideToClose:true,
		    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
	    })
	    //show an alert with the answer,  save the answer in the local scope or directly post it to the database
	    .then(function(answer) {
		    //show that the graph is loading
		    //$scope.$emit('loadingChart1', []);	      
		    //Alerts the Javascript object from the answer
		    //alert("the answer: "+ JSON.stringify(answer))  
		    $scope.$emit('newGraph', [answer]);
		    //After postGraph use getGraph just like in login 
		    //AnalyticsSvc.newGraph(answer, $scope);
		    //show graph - routing
		    //$location.path('/analytics/Graph1');
	    }, function() {
	
	    });
	};
	//Show the graph select dialog
	function showNewDBDialog(ev) {
	    $mdDialog.show({
		    controller: NewDBController,
		    templateUrl: '../templates/newDBDialog.ejs',
		    parent: angular.element(document.body),
		    targetEvent: ev,
		    clickOutsideToClose:true,
		    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
		})
	    //show an alert with the answer,  save the answer in the local scope or directly post it to the database
	    .then(function(answer) {
		    /*A new dashboard was configured by the user in the dialog 
		    window. The answer holds the dashboard object. The dashboard
		    name is emited and handled by the app controller, 
		    the dashboard name is pushed to the vm.myddd array.
		    and then display in the sidebar with an ng-repeat.*/
		    $scope.$emit('newDBCard', [answer.selectedNameDB]) 
		    /*The new dashboard is also posted to the database, it is 
		    saved in the user database in the dashboard array for this user
		    in the user.userdashboards property, see user model.
		    The service handles any errors while posting (deletion of the dashboard).
		    The scope is given to the Service function, in order to $emit to the 
		    controller*/
		    DBSvc.newDB(answer, $scope);	      
		}, function() {      
    	});
	};
	function DialogController($scope, $mdDialog) {
  	
	  	//Input save variables
	  	$scope.selectedName = '';
	  	$scope.selectedKategorie = '';
	  	$scope.selectedGraph = '';
	  	$scope.selectedMethod = '';
	  	$scope.selectedProfile = '';
	  	$scope.startDate = new Date();
	  	$scope.endDate = new Date();
	  	
	  	//The options available in the frontend /////////////////////////////////////
	  	//Kategorien in new graph dialog
	  	
	    $scope.kategories = ('Keine,Vorstand,Management,Lawn and garden,Professional').split(',').map(function(kategorie) {
	  		return {abbrev: kategorie};
	  	});
  	
  	
	  	//graphs in new gaph dialog
	    $scope.graphs = ('3D Bar,Linie mit Labeln').split(',').map(function(graph) { //, Linie mit Labeln, Buntes Säulendiagramm
	  		return {abbrev: graph};
	    });
	    
	  	//graphs in new gaph dialog
	    $scope.methods = ('Views').split(',').map(function(method) {
	  		return {abbrev: method};
	    });
	    
		//graphs in new gaph dialog
		// $scope.profiles = ('bosch do it desktop,law und garden').split(',').map(function(profile) { //,law und garden
		$scope.profiles = ('bosch do it desktop,google search console').split(',').map(function(profile) { //,law und garden
			return {
				abbrev: profile
			};
		});
		/////////////////////////////////////  	
			
	  	//Dialog opening and closing /////////////////////////////////////
	    $scope.hide = function() {
			$mdDialog.hide();
	    };
	
	    $scope.cancel = function() {
			$mdDialog.cancel();
	    };
	    /////////////////////////////////////
	    
		//function on submit dialog
	    $scope.answer = function() {
			//test if not empty 	
			if (!($scope.selectedName === '' || $scope.selectedKategorie === '' || $scope.selectedGraph === '' ||
						$scope.selectedMethod === '') || !($scope.selectedProfile === '')) {
	      		//parse the day, if it is a single digit, prepend a zero
				var dayStart = parseInt($scope.startDate.getDate(), 10);
				if(dayStart <= 9){
					dayStart = "0"+dayStart;
				}
				//alert("parsed start date day "+dayStart);			
				//Month is by default January as 0, so we have to add 1 to match Webtrends API;
				var monthStart = parseInt($scope.startDate.getMonth(), 10)+1;			
				if(monthStart <= 9){
					monthStart = "0"+monthStart;
				}
				//alert("parsed start date month "+monthStart);		
				//parse the day, if it is a single digit, prepend a zero		
				var dayEnd = parseInt($scope.endDate.getDate(), 10);
				if(dayEnd <= 9){
					dayEnd = "0"+dayEnd;
				}
				//alert("parsed end date day "+dayEnd);			
				//Month is by default January as 0, so we have to add 1 to match Webtrends API;
				var monthEnd = parseInt($scope.endDate.getMonth(), 10)+1;			
				if(monthEnd <= 9){
					monthEnd = "0"+monthEnd;
				}
				//alert("answer 2")
				//build the 
		  		var answer = {
			  		"useremail": "",
			  		"dashboard": "",
			  		"name": $scope.selectedName, 
			  		"kategorie": $scope.selectedKategorie, 
			  		"graph": $scope.selectedGraph, 
			  		"method": $scope.selectedMethod, 
			  		"profile": $scope.selectedProfile, 
			  		"startDate": ""+$scope.startDate.getFullYear()+"m"+monthStart+"d"+dayStart+"h00", 
			  		"endDate": ""+$scope.endDate.getFullYear()+"m"+monthEnd+"d"+dayEnd+"h00",
			  		"xplot": [],
			  		"yplot": []
		  		};
			  	if(answer.profile==="google search console"){
			  		var startDate = String($scope.startDate.getFullYear()) + "-" + monthStart + "-" + dayStart;
			  		var endDate   = String($scope.endDate.getFullYear()) + "-" +  monthEnd + "-" + dayEnd;	
				  	answer.startDate = startDate;
				  	answer.endDate = endDate; 
			  	}
			  	/*//TODO Check if name is taken and give out warning that name has been used
			  	var isNewName = true;
			  	alert("answer 3")
			  	//alert("current BD "+vm.currentDB)
			  	alert("scope mygraphs " + $scope.mygraphs.length)
			  	//check if this dashbaord name/ graph name combination has been used before. 
			  	for (var i = 0; i < $scope.mygraphs.length; i++  ) {
		  			if($scope.mygraphs[i].dashboard === $scope.currentDB && $scope.mygraphs[i].name === answer.name){
		  				isNewName = false;
		  				alert(isNewName);
		  			}
				}
				alert("answer 4")
				if(isNewName){*/
		      	$mdDialog.hide(answer);
		      	//}     	
	     	} else {
				alert("Some fields are missing!");
				//TODO give out a warning, promt for some seconds
	      	}
	    }
  	}//Dialog Controller
  	function NewDBController($scope, $mdDialog) {
	  	//Input save variables
	  	$scope.selectedNameDB = '';
	  	$scope.selectedKategorieDB = '';
	  	//The options available in the frontend //
	  	//Kategorien in new graph dialog
	    $scope.kategories = ('Keine,Keine,Vorstand,Management,Lawn and garden,Professional').split(',').map(function(kategorie) {
	  		return {abbrev: kategorie};
	  	});
	  	//Dialog opening and closing /////////////////////////////////////
	    $scope.hide = function() {
	    	$mdDialog.hide();
	    };
	    $scope.cancel = function() {
	    	$mdDialog.cancel();
	    };
		//function on submit dialog
	    $scope.answer = function() {
	      //test if not empty 	
	      if(!($scope.selectedNameDB === '' || $scope.selectedKategorieDB === '') ){     		
		  	var answer = {
		  		"selectedNameDB": $scope.selectedNameDB, 
		  		"selectedKategorieDB": $scope.selectedKategorieDB,
		  		"useremail": $scope.useremail
		  	};
	      	$mdDialog.hide(answer);
	        } else {
	        }
	    }
	}
	//////////Zoom functionality
	function zoomin (dashboard, name){
		var id = dashboard+"_"+name;  
		var element = document.getElementById(id).parentNode.parentNode.parentNode.parentNode;
		if(element.className === "col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-2 _md"){
			element.className = "col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 _md";
		}
		else if(element.className === "col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 _md"){
			element.className = "col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 _md";
		}
		else if(element.className === "col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 _md"){
			element.className  = "col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 _md";
		}
		else if(element.className === "col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 _md"){
			element.className = "col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 _md";
		}	
	} 
	function zoomout (dashboard, name){  	
	  	var id = dashboard+"_"+name; 
		var element = document.getElementById(id).parentNode.parentNode.parentNode.parentNode;	
		if(element.className === "col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 _md"){
			element.className = "col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-2 _md";
		}
		else if(element.className === "col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 _md"){
			element.className = "col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 _md";
		}
		else if(element.className === "col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 _md"){
			element.className = "col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 _md";
		}		
		else if(element.className === "col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 _md"){
			element.className = "col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 _md";
		}	
	}
	$scope.$on('currentDBChange', function(event, answer){
	  	var result = document.getElementById("newGraphButton");
	  	var result1 = document.getElementById("newGraphButtonDisabled");
	  	if(answer[0]===null){  		
	  		result.style.display='none';
	  		result1.style.display='block';	  	
	  	} else {
	  		result.style.display='block';	
	  		result1.style.display='none';
		}
	  	$scope.currentDB = answer[0];
	  	$scope.CDB = answer[0];
	})  
	$scope.$on('newGraphBroadcast', function(event, answer) {
	  	//TODO: now onclose, we can only hide the section and current db change, 
	  	//this way, we dont have to reload
	  	//set up the chart, it is allready appended to lis with ng-repeat
	  	//alert("ein neuer graph wurde gebroadcasted, scope.cdb ist "+ $scope._CDB);
	    //alert("the answer after broadcast: "+ JSON.stringify(answer[0]))	
	    //After postGraph use getGraph just like in login      
	    AnalyticsSvc.newGraph(answer[0], $scope);
	    //show graph - routing
	    //$location.path('/analytics/Graph1');
	}); 
});