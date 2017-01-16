angular.module('management')
.service('ManagementSvc',['$http', function ($http) {
  var svc = this
  
  //change management dashboard 
  svc.getManagementDashboard = function (header) {
  	
  	var req = {
 	  	method: 'GET',
 		url: '/api/management',
 		headers: header
  	}
  	//alert(JSON.stringify(req))
    return $http(req).then(function successCallback(res) {
      	//alert(res.data);
      	return res.data;
    		    		
  	  }, function errorCallback(data) {
   		 // called asynchronously if an error occurs
    	 // or server returns response with an error status.
    	 alert("an error in get graph plot data occured");
    	 
  	  })
  }
  
  //change time range
  svc.changeTimeRange = function (mmdbStartDate, mmdbEndDate) {
    return $http.post('/api/management', {
      mmdbStartDate: mmdbStartDate, mmdbEndDate: mmdbEndDate })
      .then(function () {
     	//get management dashboard after response arrived
     	//Header information about the change that took place
     	return svc.getManagementDashboard({'update':"mmdbTime"})
    })
  }
  
  //change user access in management dashboard
  svc.changeAccess = function (mmdbAccess) {
    return $http.post('/api/management', {
      mmdbAccess:mmdbAccess })
      .then(function () {
     	//get management dashboard after response arrived
     	//Header information about the change that took place
     	return svc.getManagementDashboard({'update':"mmdbAccess"})
    })
  }
}])