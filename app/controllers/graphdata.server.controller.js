/*eslint-env node*/
var bcrypt = require('bcrypt')
var jwt    = require('jwt-simple')

//Beziehe mongoose zur Verwendung des mongoose Datenbank Connectors.
var mongoose = require( 'mongoose' );

//Beziehe das GraphSchema um Graphen zu beziehen, zu löschen und zu speichern
var GraphSchema = mongoose.model('Graph');

//Beziehe das User model um über die get Route die Daten zu dem aktuellen user zu erhalten
var User = mongoose.model('User');

//Beziehe die config Datei
var config = require('../../config/config.js');

//Beziehe das Webtrends Modul zur Behandlung von Webtrends Server Daten als Datenquelle
var Webtrends = require('../modules/webtrends.server.module.js')

//Füge einen Graphen in die Graphdatenbank hinzu. Ein Graph wird gespeichert mit Useremail, Dashboard und Name. 
//Der Body enthält den Graphen nach dem gefragt wurde. 
exports.getGraphdata = function (req, res, next) {
	//Lösche den Graphen, wenn die header zur Autorisierung nicht vorhanden sind
	if (!req.headers['x-auth']) {
    	return res.status(401).send("Authorization failed");
  	}
	//Verwende das config secret zur Dekodierung des Sessiontokens
  	var auth = jwt.decode(req.headers['x-auth'], config.secret);
	//Verwende das dekodierte Sessiontoken um den aktuellen user in der Datenbank zu finden  	
  	User.findOne({useremail: auth.useremail}, function (err, user) {
    	console.log("found user: "+user);
    	//Falls der user nicht in der Datenbank gefunden wurde
    	if (err) {
      		console.log("user server controller"+err);
      		return res.sendStatus(402);
      	}	
		//Findet den vorher durch post angelegten Graphen in der Graphdatenbank mit den Keyparametern.
		var name = req.get('name');
		var useremail = user.useremail;
		var dashboard = req.get('dashboard');
		//Findet des Graphobjekt in der Graphdatenbank und gibt den Graphen
		//weiter an das Webtrends Modul um es um die Plotdaten zu ergänzen.
		GraphSchema.findOne( {useremail: useremail, dashboard: dashboard, name: name } , function (err, graph) {
			if (err) {
				console.log(err);
				return next(err);
			}
			console.log("the graph is now: " + graph);
			//Gibt den Graphen weiter an das Webtrends Modul um die Graphdaten zu erhalten. 
			Webtrends.fetchGraphdata(graph, res); 		     	
	    });	    
	});
};
	
//TODO append graphnames and plot data for multiple graphs, get plot data, this uses the selected profile for now
//= Webtrends.getGraphplot(graph);
//now concatenate the graph and the graphdata
//var graphdata = graph.concat(graphplot);
//console.log("The graphdata is: " + JSON.stringify(graphplot));
//TODO append graph and graph plotdata for graph data
//res.status(200).json(graphplot);
//console.log("ergebnis des get requests");
//res.status(200);   

//Export zum löschen der Daten. 
exports.delete =  function (req, res) {	
	//Sende status 401, wenn der header zur autorisierung nicht vorhanden ist. 
	if (!req.headers['x-auth']) {
    	return res.status(401).send('Authorization missing');
  	}
  	/*id is the name of the dashboard that should be deleted,
  	 *userdashboards in the user database need modification
	 *and all graphs that belong to this dashboard need to be deleted
	 *from the graph database */
	//Prüft ob die notwenidgen header vorliegen.
    var auth = jwt.decode(req.headers['x-auth'], config.secret);
    //Findet den aktuellen Benutzer über die useremail
    User.findOne({useremail: auth.useremail}, function (err, user) {
	   	//Wenn kein Benutzer gefunden wurde, dann sende status 402
	   	if (err) {
	   		console.log('user server controller'+err);
	   		return res.status(402).send('Authorization failed.');
	   	}
    	//Lese den Namen des Graphens aus der Query, hier wird eine Query
    	//verwendet und kein body json, weil es sich um ein delete handelt.
	    var graph = req.query._graph;
	  	
	  	console.log('Grap from the query is: '+JSON.stringify(graph)); 	
	  	//Löscht alle Graphen, die dem user zugeordnet sind. 
	  	GraphSchema.remove({ 'useremail' : auth.useremail, 'dashboard' : graph.dashboard, 'name' : graph.name }, function (err) {
	  		//bei Misserfolg des löschens von Graphen sende 401
	  		if (err){
	  			res.status(401).send('Delete graphs for dashboard failed.');
	  		}
	  		
	      	console.log("Deleted graph."); 	      	
	      	//Bei erfolgreichem Löschen von Graphen sende status 200.     	  		
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
