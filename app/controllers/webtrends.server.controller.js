/* the url is set in this module, from which the data is requested */

/* is this a controller? this is probably more likely to be a module*/

/*eslint-env node*/
var bcrypt = require('bcrypt-nodejs'); // require('bcrypt')
var jwt = require('jwt-simple');
//var Webtrends   = require('../models/webtrends.server.model.js')
//var Dummydata   = require('../models/dummydata.server.model.js')

var mongoose = require('mongoose'),
	Webtrends = mongoose.model('Webtrends'),
	Webtrends = mongoose.model('Dummydata');

var streamToMongoDB = require("stream-to-mongo-db").streamToMongoDB;
var JSONStream = require("JSONStream");

var config = require('../../config/config.js')
var request = require('request')
const https = require('https')
var extend = require('util')._extend
var dataTranformation = require('./datatransformation.server.controller.js')

// for google API data
var GoogSearchCon = require('./GoogSearchCon.server.controller.js');



exports.fetchGraphdata = function(graph, responseObject) {
	//TODO make this a function that may be called from serverside
	//TODO this function is called on behalf of graphdata server controller 

	//request the data
	var user = 'BOSCH\\eric.van.lessen';

	var password = 'N-/b{.ML1';

	var auth = 'Basic ' + new Buffer(user + ':' + password).toString('base64');

	//Transform Date
	//Put date in querry	

	//fetch webtrends data from webtrends profil
	var webtrendsApiPath; //start_period=2016m11d12h00&end_period=2016m12d12h00&period_type=agg&format=html&suppress_error_codes=true

	if (graph.profile === "bosch do it desktop") {
		webtrendsApiPath = '/v3/Reporting/spaces/122578/Keymetrics/?start_period=' + graph.startDate + '&end_period=' + graph.endDate + '&period_type=agg&format=json'
	}

	if (graph.profile === "law und garden") { // typo caused an error here => law & garden
		webtrendsApiPath = '/v3/Reporting/spaces/124925/Keymetrics/?start_period=' + graph.startDate + '&end_period=' + graph.endDate + '&period_type=agg&format=json'
	}

	// chck if asked for gogle data
	if (graph.profile === "google search console") { 
		return GoogSearchCon.getGoogSearchConData(graph.startDate, graph.endDate, graph, responseObject);
	}

	console.log("webtrendsApiPath:" + webtrendsApiPath);

	var options = {
		host: 'ws.webtrends.com',
		port: 443,
		method: 'GET',
		path: webtrendsApiPath,
		headers: {
			'Authorization': auth
		}
	};

	var webtrendsData;

	// where the data will end up 
	var outputDBConfig = {
		dbURL: "mongodb://bdb_db:BFArwdHJPgYUkGjG@aws-us-east-1-portal.8.dblayer.com:15226/bdb_db?ssl=true",
		collection: "amigo"
	};

	// create the writable stream 
	var writableStream = streamToMongoDB(outputDBConfig);

	// make the http request and create a readable stream via mongo
	var req = https.request(options, (res) => {
		const statusCode = res.statusCode;
		const contentType = res.headers['content-type'];

		// console.log("The response from webtrends : ");
		// console.log(res);
		// console.log("\n\n");

		var error;
		if (statusCode !== 200) {
			console.log(res.json);
			error = new Error(`Request Failed.\n` +
				`Status Code: ${statusCode}`);
		} else if (!/^application\/json/.test(contentType)) {
			error = new Error(`Invalid content-type.\n` +
				`Expected application/json but received ${contentType}`);
		}
		if (error) {
			console.log(error.message);
			// consume response data to free up memory
			res.resume();
			return;
		}

		res.setEncoding('utf8');
		//This works -> writes single profiles to database  		
		res.on('end', function() {
			console.log("sending data to data transformation//");
			dataTranformation.transformDatas(graph, responseObject);
		});

		res.pipe(JSONStream.parse('*')).pipe(writableStream);

	}).on('error', (e) => {
		console.log(`Got error: ${e.message}`);
		responseObject.status(400).send('error getting plotData')
	});

	req.end()
};









/////////////////////////////////
//TODO Aggregated Number
//TODO Von Bis
//TODO Open Close Graphs
//TODO Finishing, Positioning
//TODO Responsive 
//TODO Fehler raus nehmen
//TODO Choose second graph
//TODO Second datasource

/////////////////////////////////////////////////////////////////////////////
//TODO Auswahl Buttons für Einstellungen im Graph -> send to graph controller 
//TODO make safety stops (questions) and so on formular, is name filled out... 	
//TODO Graph Frontend    
//TODO Single number
//TODO Graph Auswahlen
//TODO Update fetch from database
//TODO Responsivness, Bootstrap
//TODO Andere Management Auswahl wird ausgeblendet in Analytics
//TODO Frontend
//TODO Code aufräumen	
//TODO Testing	


//24:00  	
//TODO Search Console


//Fryday///////////////////////
//TODO Same to google analytics
//TODO make request to google analytics
//TODO google search console		
//TODO Querries, google analytics, search console
//TODO Check different sources possibilites, how is the company set up
//TODO Build Averages and other calculations over the graph like date and so on
//TODO Build all request strings
//TODO Build Frontend Dashboards and functionality
//TODO Build more Graphs
//TODO Build frontend -> Neues Dashboard wird in der Seite angezeigt
//TODO Frontend, Kommentare, 

//Comments: https://sroze.github.io/ngInfiniteScroll/index.html

////////////////////////////////////////////////////
//TODO Use a nejo4 database or graphdatabase, much faster
//TODO Several dashboards and get data for them
//TODO Sources
//TODO Social Media
//TODO Facebook Source, Twitter Source
//TODO Forum mit Suche
//TODO Watson, predictive analytics
//TODO Cognitive Search
//TODO Code aufräumen, Documentation, Styles
//TODO seperate scripts and libs
//TODO Kommentieren
//TODO Rename Functions
//TODO Script injection mit gulp
//TODO Best practiced -> make it the node way
//TODO export all strings in a string value directory for multilanguage purpose
//
//TODO Security
//TODO Optimization

//Montag
//TODO Neo4j Application für Online Trading beginnen, C++, Python, Node.js
//TODO Shop programming, Textilinstitut Hiwi Job
//TODO Uni lernen, Pattern Recognition Lehrstuhl
//TODO Apply for node.js job in the internet	

//Done
//TODO fetch the dummy data from the Browser: Bad Daley S. 433, Angular.js by example S. 144, Ken Williamson S. 80
//TODO Brief MLP verschicken

//TODO Datepicker example is adopted from https://plnkr.co/edit/eV2Kmt?p=preview	
//TODO updateChart functions in lib updateChart

//TODO Bestpractive for Callbacks and Headers


//disable scrolling
//http://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
