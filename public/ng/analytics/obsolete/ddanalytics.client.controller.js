angular.module('analytics')

.controller('showAdvanced', function($scope, AnalyticsSvc, DBSvc,  $mdDialog, $mdToast) { //, $location, 

  $scope.customFullscreen = true;
  $scope.test = null;
  $scope.currentDB = null;
  
  $scope.analyticsGraph1Show = true;
  $scope.analyticsGraph2Show = true;
  $scope.analyticsGraph3Show = true;
  $scope.analyticsGraph4Show = true; 
  
  //funciton for the toast
  $scope.showSimpleToast = showSimpleToast;
  
  //variables for the graph setting in new graph dialog, variables to hold the user input
  $scope.graphSetting = {
  	name: 'Name',
  	kategorie: 'Keine',
  	graph: '3dBar',
  	startDate : '',
  	endDate: '',
  };

  /*This funciton is called by the delete button in the analytics view.
  this function deletes a dashboard, emits delete to the app controller
  the dashboard is taken out of the database. If the delete request is sucessful,
  dashboard data is deleted localy as well. If the delete request is not succesfull,
  the dashboard name is pushed back into the dashbaord array vm.myddd*/  
  $scope.deleteDB = function(db_name){  	
  	$scope.$emit('deleteDB', [db_name]);
  	DBSvc.deleteDB(db_name, $scope); 	
  }
  
  $scope.setDB = function(db_name){
  	$scope.$emit('currentDBChange', [db_name]);	  	  	
    //TODO getDashboardGraphs - for every graph: get plot data run through array    
  }
  
  $scope.$on('currentDBChange', function(event, answer) {
  	if(answer[0]!==null){
  		var result = document.getElementById("newGraphButton");
  		result.style.visibility='visible';	  		
  	} else {
  		result.style.visibility='hidden';	  	
  	}
  	
  	$scope.currentDB = answer[0];
  })
  
  $scope.$on('newGraphBroadcast', function(event, answer) {
  	
  	//TODO: now onclose, we can only hide the section and current db change, 
  	//this way, we dont have to reload
  	
  	//set up the chart, it is allready appended to lis with ng-repeat
  	
  	
    //alert("the answer after broadcast: "+ JSON.stringify(answer[0]))	
    //After postGraph use getGraph just like in login      
    AnalyticsSvc.newGraph(answer[0], $scope);

    //show graph - routing
    //$location.path('/analytics/Graph1');
    	
  });
    
  //Show the graph select dialog
  $scope.showAdvanced = function(ev) { 
  	/*alert ("currentDB " + $scope.currentDB)
  	if( $scope.currentDB === null) {
  		showSimpleToast(); 
  		return 
  	}*/
  	
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
  
  /*set the rights on login, the right are the authorization of the user
  	$scope.$on('dashboard', function (_, db) {
  		
  		$scope.mydashboards = db;

  	});
  */

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
    $scope.kategories = ('Keine,K1,K2,K3,K4').split(',').map(function(kategorie) {
  		return {abbrev: kategorie};
  	});
  	
  	//graphs in new gaph dialog
    $scope.graphs = ('3dBar').split('Line,Pie ').map(function(graph) {
  		return {abbrev: graph};
    });
    
    //TODO choose from an array, so it is not split
  	//graphs in new gaph dialog
    $scope.methods = ('key metrics for all profiles').split(',').map(function(method) {
  		return {abbrev: method};
    });
    
  	//graphs in new gaph dialog
    $scope.profiles = ('bosch do it desktop,law und garden').split(',').map(function(profile) {
  		return {abbrev: profile};
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
      if(!($scope.selectedName === '' || $scope.selectedKategorie === '' || $scope.selectedGraph === '' ||
      	$scope.selectedMethod === '') ||  	!($scope.selectedProfile === "bosch do it desktop") ){
      		
      	var dayEnd = '';
		if(parseInt($scope.endDate.getDate(), 10) < 10){
			dayEnd = "0"+$scope.endDate.getDate() 
		}else{
			dayEnd = $scope.endDate.getDate()
		}
		
		var monthEnd = '';
		if(parseInt($scope.endDate.getMonth(), 10) < 10){
			monthEnd = "0"+$scope.endDate.getMonth() 
		}else{
			monthEnd = $scope.endDate.getMonth()
		}
		
		
		var dayStart = '';
		if(parseInt($scope.startDate.getDate(), 10) < 10){
			dayStart = "0"+$scope.startDate.getDate() 
		}else{
			dayStart = $scope.startDate.getDate()
		}		
		
		var monthStart = '';
		if(parseInt($scope.startDate.getMonth(), 10) < 10){
			monthStart = "0"+$scope.startDate.getMonth() 
		}else{
			monthStart = $scope.startDate.getMonth()
		}
		
		//build the 
	  	var answer = {
	  		"useremail": "",
	  		"dashboard": "",
	  		"selectedName": $scope.selectedName, 
	  		"selectedKategorie": $scope.selectedKategorie, 
	  		"selectedGraph": $scope.selectedGraph, 
	  		"selectedMethod": $scope.selectedMethod, 
	  		"selectedProfile": $scope.selectedProfile, 
	  		"startDate": ""+$scope.startDate.getFullYear()+"m"+(parseInt(monthStart)+1)+"d"+(parseInt(dayStart))+"h00", 
	  		"endDate": ""+$scope.endDate.getFullYear()+"m"+(parseInt(monthEnd)+1)+"d"+(parseInt(dayEnd))+"h00",
	  		"xplot": [],
	  		"yplot": []
	  	};
      	
      	$mdDialog.hide(answer);
      	
      } else {
      	
        //TODO give out a warning, promt for some seconds
      }
    };
  }
  
  //Show the graph select dialog
  $scope.showNewDBDialog = function(ev) {
  		
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
  
  /*set the rights on login, the right are the authorization of the user
  	$scope.$on('dashboard', function (_, db) {
  		
  		$scope.mydashboards = db;

  	});
  */

  function NewDBController($scope, $mdDialog) {
  	
  	//Input save variables
  	$scope.selectedNameDB = '';
  	$scope.selectedKategorieDB = '';
  	
  	//The options available in the frontend //
  	//Kategorien in new graph dialog
    $scope.kategories = ('Keine,K1,K2,K3,K4').split(',').map(function(kategorie) {
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
      	
        //TODO give out a warning, promt for some seconds
      }
    };
  }
  
  
  //Toast functionality
  var last = {
      bottom: false,
      top: true,
      left: false,
      right: true
  };
    
  $scope.toastPosition = angular.extend({},last);

  $scope.getToastPosition = function() {
    sanitizePosition();

    return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  };

  function sanitizePosition() {
    var current = $scope.toastPosition;

    if ( current.bottom && last.top ) current.top = false;
    if ( current.top && last.bottom ) current.bottom = false;
    if ( current.right && last.left ) current.left = false;
    if ( current.left && last.right ) current.right = false;

    last = angular.extend({},current);
  }

  function showSimpleToast(){
    var pinTo = $scope.getToastPosition();

    $mdToast.show(
      $mdToast.simple()
        .textContent('Toast')
        .position(pinTo )
        .hideDelay(3000)
    );
  };
  
});