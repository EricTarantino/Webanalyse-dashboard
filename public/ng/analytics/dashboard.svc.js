angular.module('analytics')
.service('DBSvc',['$http', function ($http) {
  var svc = this
  
  //this service is used in analytics, this is how the service is used
  //the service posts a graph to api/graphdata
  //the service then gets the graph data
  //this is a json with the (updated) graph configuration and also 
  //the plot data
  
  svc.deleteDB = function(db_name, scope){

  	var url = '/api/dashboard?_db=' + db_name;
  	
	return $http.delete(url).then(function successCallback(res) {
           	
     	//this will remove the data localy
     	scope.$emit('deletedDB', [db_name]);     	
 		
     	}, function errorCallback(err) {
   			// called asynchronously if an error occurs
    		// or server returns response with an error status.
    		scope.$emit('undeleteDB', [db_name])
    })
  }

  //TODO post only the name of the graph
  svc.newDB = function (answer, scope) {
  	   	 
  	 //this is emitted from here 
  	 //scope.$emit('newDBCard', [answer.selectNameDB]);  	 
     return $http.post('/api/dashboard', answer).then(function successCallback() {      
     
     }, function errorCallback(err) {
   		 /* called asynchronously if an error occurs,
   		 the dashboard needs to be deleted localy*/
    	 scope.$emit('deleteDB', answer.selectNameDB);
  	  })
  }
         
  //this function fetches the whole dashboard data in a stream 
  //this stream is read out and objects are attached to the 
  //dashboard data model: vm.mygraphs when the user logs in 
  svc.getDB = function (name, scope) {
	  
  	  var req = {
 	  	method: 'GET',
 		url: 'https://prototype-84629.mybluemix.net/api/graphdata'
  	  }
	  
      //return the plot data
      $http( req ).then(function successCallback(res) {
      	
      		var data = JSON.stringify(res.data);
      		
    		// this callback will be called asynchronously, when the response is available    	
    		//alert("loading dashboard");
    		
    		//TODO oboe.js for streaming and resolving results
     		
     		//for every graph in the data do:     		
     		scope.$emit('newGraph', [data.graph]);
       		scope.$emit('updateAnalyticsChart', [data.graph]);
       		
       		//scope.$emit('newGraph', [data_i.graph]);
       		//scope.$emit('updateAnalyticsChart', [data_i.graph]);
    		    		
  	  }, function errorCallback(data) {
   		 // called asynchronously if an error occurs
    	 // or server returns response with an error status.
    	 alert("an error in get graph plot data occured");
    	 
  	  });           
  }
}])