/*eslint-env node*/
var bcrypt = require('bcrypt')
var jwt    = require('jwt-simple')

//var GraphSchema   = require('../models/graph.server.model.js')
var mongoose = require( 'mongoose' ),  
    GraphSchema = mongoose.model('Graph'),
     User = mongoose.model('User');

var config = require('../../config/config.js')
var request = require('request')
const https = require('https')
var Webtrends = require('../modules/webtrends.server.module.js')

//get a graph, return the graph data which is the graph configuration and the plot data the request 
//body holds the selectedName, this is the name of the graph which the plot data is requested for
exports.getGraphdata = function (req, res, next) {
	
	if (!req.headers['x-auth']) {
    	return res.status(401).send("Authorzation failed");
  	}

  	var auth = jwt.decode(req.headers['x-auth'], config.secret);
  	
  	User.findOne({useremail: auth.useremail}, function (err, user) {
    	console.log("found user: "+user)
    	if (err) {
      		console.log("user server controller"+err);
      		return res.sendStatus(402);
      	}
	
		//fetch dummy data and show in graph with service
		//var graphName =  JSON.stringify(req.header.selectedName)	
		//TODO useremail should be replaced by auth.useremail with jwt token
		var name = req.get('name');
		var useremail = user.useremail;
		var dashboard = req.get('dashboard');
		
		//var useremail = req.get('useremail');		
		//console.log("U are getting data for graph: " + selectedName + ", "+ useremail+ ", "+dashboard);	
	  	//querry the graph by name, useremail and dashboard
	  	
		GraphSchema.findOne( {useremail: useremail, dashboard: dashboard, name: name } , function (err, graph) {
			if (err) {
				console.log(err);
				return next(err);
			}
			console.log("the graph is now: " + graph);
			//then save plot data to graph. 
			//initialisation of dashboard can threfore take place in dashboard server by sending back 
			//the whole graph data for the dashboard
			Webtrends.fetchGraphdata(graph, res); 		     	
	    })	    
	})
}
	
	/*.then( function( graph ) {
	     	
	     		//get the graph plot with respect to the graph configuration
	    	 	return Webtrends.getGraphplot(graph);
	 		
	 		}).then(function( Graphplot){ console.log("Der graph plot ist: " + Graphplot) });
	 	*/
	
	
		//TODO append graphnames and plot data for multiple graphs, get plot data, this uses the selected profile for now
		 //= Webtrends.getGraphplot(graph);
		
		//now concatenate the graph and the graphdata
		//var graphdata = graph.concat(graphplot);
					
		//console.log("The graphdata is: " + JSON.stringify(graphplot));
		
		//TODO append graph and graph plotdata for graph data
	    //res.status(200).json(graphplot);
	
	    //console.log("ergebnis des get requests");
	    //res.status(200);

	    


//delete graph
exports.delete =  function (req, res) {
	
	//console.log("query param: "+req.query._db)
	
	if (!req.headers['x-auth']) {
    	return res.status(401).send('Authorization missing');
  	}
  	
  	/*id is the name of the dashboard that should be deleted,
  	 *userdashboards in the user database need modification
	 *and all graphs that belong to this dashboard need to be deleted
	 *from the graph database */
    var auth = jwt.decode(req.headers['x-auth'], config.secret);
    
    //find the user document 
    User.findOne({useremail: auth.useremail}, function (err, user) {
	    	
	   if (err) {
	   		console.log('user server controller' + err);
	   		return res.status(401).send('Authorization failed.');
	   	}
    	
    	//read out the query, name of the dashboard that should be deleted
	    var graph = req.query._graph;
	  	
	  	//delete all graphs that belong to the dashboard and the user
	  	console.log('Grap from the query is: ' + JSON.stringify(graph)); 	
	  	
	  	GraphSchema.remove({ 'useremail' : auth.useremail, 'dashboard' : graph.dashboard, 'name' : graph.name }, function (err) {
	  		
	  		if (err){
	  			res.status(401).send('Delete graphs for dashboard failed.');
	  		}// removed!		
	  		
	      	console.log("Deleted graph."); 	      	
	      	      	  		
	  		return res.status(200);
	  	});  	
  	});
}


//save the graph to the database, no plot data yet, will be added on get data response time
exports.insertNewGraphConfig =  function (req, res, next) {
	console.log("in new graph config");
	var graph = new GraphSchema({useremail: req.body.useremail, dashboard: req.body.dashboard, name: req.body.name, 
		kategorie: req.body.kategorie, graph: req.body.graph, method: req.body.method, 
		profile: req.body.profile, startDate: req.body.startDate, endDate: req.body.endDate});
  	console.log("you saved the graph "+graph);
	graph.save();
	
	return res.sendStatus(207);
};
