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
      		//alert(graph)
    		// this callback will be called asynchronously, when the response is available    	
    		//alert("in response data " + graph);
    		var graph_json = res.data;
    		var laenge = graph_json.xplot[0].length
    		//alert("laenge "+laenge)
    		/*
    		alert(graph_json.xplot[0])
    		alert(JSON.parse(graph_json.xplot[0]))
    		
    		alert((JSON.parse(graph_json.xplot[0]))[0])
    		
    		alert((JSON.parse(graph_json.xplot[0]))[0].keys)
    		alert(3)
    		alert((JSON.parse(graph_json.xplot[0]))[1].keys)
    		alert(4)
    		alert((JSON.parse(graph_json.xplot[0]))[2].keys)
    		alert(5)
    		alert((JSON.parse(graph_json.xplot[0]))[0].clicks)
    		alert(6)
    		alert((JSON.parse(graph_json.xplot[0]))[1].clicks)
    		alert(7)
    		alert((JSON.parse(graph_json.xplot[0]))[2].clicks)
    		alert(8)
    		alert((JSON.parse(graph_json.xplot[0]))[0].keys[0])
    		alert(9)
    		alert((JSON.parse(graph_json.xplot[0]))[1].keys[2])
    		alert(10)
    		alert((JSON.parse(graph_json.xplot[0]))[0].impressions)
    		alert(11)
			alert((JSON.parse(graph_json.xplot[0]))[0].ctr)
			alert(12)
			alert((JSON.parse(graph_json.xplot[0]))[0].position)
			alert(13)
    		alert((JSON.parse(graph_json.xplot[0]))[1].impressions)
    		alert(14)
			alert((JSON.parse(graph_json.xplot[0]))[1].ctr)
			alert(15)
			alert((JSON.parse(graph_json.xplot[0]))[1].position)
			alert(16)
			alert("länge "+ JSON.parse(graph_json.xplot[0]).length)
    		*/
    		
    		
    		var table = []
    		for(var i = 0; i< 100; i++){
    			try{
	    		
	    			var row = {
	    				land: (JSON.parse(graph_json.xplot[0]))[i].keys[2],
	    				seite: (JSON.parse(graph_json.xplot[0]))[i].keys[0],     				
	    				protein: (JSON.parse(graph_json.xplot[0]))[i].clicks,
	    				sodium: (JSON.parse(graph_json.xplot[0]))[i].impressions,
	    				calcium: (JSON.parse(graph_json.xplot[0]))[i].ctr,
	    				iron: (JSON.parse(graph_json.xplot[0]))[i].position
	    			}
	    			//alert(JSON.stringify(row));
	    			//table.push(JSON.stringify(row));	
	    			table.push(row)
	    		} catch (e){
	    			
	    		}
    		}
    		  		
    		//alert(table)
     		//emit data upwards, get the chartID number according to angular module, as scope variable
     		//the graph is emitted, assigned and saved locally by the information it holds (db, name)
     		//show the graph and unshow the loader
       		scope.$emit('updateAnalyticsChart', [graph]);
       		//alert(""+dashboard+"_"+name+"_card")
       		var loaderToDisplayNone = document.getElementById(""+dashboard+"_"+name+"_loader");
       		loaderToDisplayNone.style.display = 'none';    
       		
       		//console.log(graph_json.profile)
       		//console.log(graph_json.xplot)
       		if(graph_json.profile === "google search console"){
    	   		var cardToDisplayNone = document.getElementById(""+dashboard+"_"+name+"_datatable");
       			cardToDisplayNone.style.visibility = 'visible';	
       			
       			//alert(table)
    			//alert(JSON.stringify(table))
    			//scope.datatable = table;
    			scope.datatableString = JSON.stringify(table);
    			scope.datatableJSON = JSON.parse(JSON.stringify(table));
				//alert("parsed")  
       			//scope.datatable = JSON.stringify(JSON.parse(graph_json.xplot).rows);
       			/*
       			
       			alert(graph_json.xplot[0].toArray()[1].clicks)
       			alert(JSON.parse(graph_json.xplot[0].toArray()[1]).clicks)
       			alert(graph_json.xplot[0][2].clicks)
       			alert(graph_json.xplot[0][2].keys[0])
       			alert(graph_json.xplot[0][2].keys[1])
       			
       			
       			//scope.datatable = graph_json.xplot[0];
       			
       			scope.datatable = [
					{
    				protein: (JSON.parse(graph_json.xplot[0]))[0].clicks,
    				sodium: (JSON.parse(graph_json.xplot[0]))[0].impressions,
    				calcium: (JSON.parse(graph_json.xplot[0]))[0].ctr,
    				iron: (JSON.parse(graph_json.xplot[0]))[0].position
			        },
			        {
            protein: 4.0,
            sodium: 87,
            calcium: '14%',
            iron: '1%'
			        }];
			    */
			        
			    scope.datatable = table;
       			
       			//alert("scope datatable ist: " + scope.datatable);
       			
       		} else {      		       		
  	     		var graphCardIconsToShow = document.getElementById(""+dashboard+"_"+name+"_card_actions");
    	   		var cardToDisplayNone = document.getElementById(""+dashboard+"_"+name);
       			graphCardIconsToShow.style.display = 'block';
       			cardToDisplayNone.style.display = 'block';
			}
    		    		
  	  }, function errorCallback(data) {
   		 // called asynchronously if an error occurs
    	 // or server returns response with an error status
    	 // unshow the loader
    	 //alert("an error in get graph plot data occured");
    	 //alert(""+dashboard+"_"+name+"_card")
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