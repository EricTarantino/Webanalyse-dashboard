angular.module('analytics')
.service('AnalyticsSvc',['$http', function ($http) {
  var svc = this
  
  //this service is used in analytics, this is how the service is used
  //the service posts a graph to api/graphdata
  //the service then gets the graph data
  //this is a json with the (updated) graph configuration and and also 
  //the plot data

  //TODO post only the name of the graph
  svc.newGraph = function (answer, scope) {
  	  	  	
  	//post the graph
    return $http.post('/api/graphdata', answer).then(function () {
      
      //get the graph
      return svc.getGraphplot(answer.useremail, answer.dashboard, answer.name, scope);
      
    });
  };
  
       
  //add user to get a clearly specified graph
  svc.getGraphplot = function (useremail, dashboard, name, scope) {
	  	  
  	  var req = {
 	  	method: 'GET',
 		url: 'https://prototype-84629.mybluemix.net/api/graphdata',
 		headers: {'useremail':useremail, 'dashboard':dashboard, 'name': name },
 		//cache: true
  	  }

      //return the plot data
      $http( req ).then(function successCallback(res) {
      	
      		var graph = JSON.stringify(res.data);
      		alert("got graph")
    		// this callback will be called asynchronously, when the response is available    	
    		//alert("in response data " + graph);

     		//emit data upwards, get the chartID number according to angular module, as scope variable
     		//the graph is emitted, assigned and saved locally by the information it holds (db, name)
     		//show the graph and unshow the loader
       		scope.$emit('updateAnalyticsChart', [graph]);
       		alert(""+dashboard+name+"_card")
       		var graphCardToShow = document.getElementById(""+dashboard+name+"_card");
       		var loaderToDisplayNone = document.getElementById(""+dashboard+"_"+name+"_loader");
       		graphCardToShow.style.display = 'block';
       		loaderToDisplayNone.style.display = 'none';       		
    		    		
  	  }, function errorCallback(data) {
   		 // called asynchronously if an error occurs
    	 // or server returns response with an error status
    	 // unshow the loader
    	 alert("an error in get graph plot data occured");
    	 alert(""+dashboard+"_"+name+"_card")
       	 var loaderToDisplayNone = document.getElementById(""+dashboard+"_"+name+"_loader");
       	 loaderToDisplayNone.style.display = 'none';   
    	 
  	  });           
  }
  
  svc.deleteGraph = function(db_name, graph_name, scope){

	var db_graph_shortform = { dashboard: db_name, name: graph_name }
	
  	var url = '/api/graphdata?_graph='+JSON.stringify(db_graph_shortform);
  	
	return $http.delete(url).then(function successCallback(res) {
           	
     	//this will remove the data localy
     	scope.$emit('deletedGraph', [db_graph_shortform]);     	
 		
     	}, function errorCallback(err) {
   			// called asynchronously if an error occurs
    		// or server returns response with an error status.
    		scope.$emit('undeleteDB', [db_graph_shortform])
    })
  }
}])