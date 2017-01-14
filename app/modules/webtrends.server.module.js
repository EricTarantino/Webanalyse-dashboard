/*eslint-env node*/
var bcrypt = require('bcrypt')
var jwt    = require('jwt-simple')

var mongoose = require( 'mongoose' ),  
    Webtrends = mongoose.model('Webtrends'),
    Webtrends = mongoose.model('Dummydata');
    
var streamToMongoDB = require("stream-to-mongo-db").streamToMongoDB;
var JSONStream      = require("JSONStream");
var mongoDB = require('../../config/mongoDB.js')

var config = require('../../config/config.js')
var request = require('request')
const https = require('https')
var extend = require('util')._extend
var dataTranformation = require('../modules/datatransformation.server.module.js')

// for google API data
var GoogSearchCon = require('../controllers/GoogSearchCon.server.controller.js');


/* 
This function is used to request the data from the server, also the transformation
takes place here.

Performance may be raised in several ways later on:
If the results are clean: use library to make queries on the stream and save minified
data to the database. If the data is minifed and transformed, not many queries are necesarry.
The data is then saved in the database.
More precise queries can also be used to avoid any for loops on the JSON data. 
Hadoop may be used to make the transformation on multiple data at the same time, 
but this is not necessary for small amount of data and only useful for long term queries. 
*/


exports.fetchGraphdata = function (graph, responseObject) {

	//request the data
	var user = 'BOSCH\\eric.van.lessen';
	//console.log(user)
  
	var password = 'N-/b{.ML1';
	//console.log(password)
  
	var auth = 'Basic ' + new Buffer( user + ':' + password ).toString('base64');	

	//fetch webtrends data from webtrends profil
	var webtrendsApiPath; //start_period=2016m11d12h00&end_period=2016m12d12h00&period_type=agg&format=html&suppress_error_codes=true

	if(graph.profile === "bosch do it desktop" ){
		webtrendsApiPath = '/v3/Reporting/spaces/122578/Keymetrics/?start_period='+graph.startDate+'&end_period='+graph.endDate+'&period_type=agg&format=json'
  	}
	
	if(graph.profile === "law & garden"){
		webtrendsApiPath = '/v3/Reporting/spaces/124925/Keymetrics/?start_period='+graph.startDate+'&end_period='+graph.startDate+'&period_type=agg&format=json'
  	}
  	
	// chck if asked for gogle data
	if (graph.profile === "google search console") { 
		return GoogSearchCon.getGoogSearchConData(graph.startDate, graph.endDate, graph, responseObject);
	}
	
	//console.log("webtrendsApiPath:" + webtrendsApiPath);
	
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
	var outputDBConfig = { dbURL : "mongodb://bdb_db:BFArwdHJPgYUkGjG@aws-us-east-1-portal.8.dblayer.com:15226/bdb_db?ssl=true", collection : "amigo" };
 
	// create the writable stream 
	var writableStream = streamToMongoDB(outputDBConfig);
	
	var req = https.request(options, (res) => {
  		const statusCode = res.statusCode;
  		const contentType = res.headers['content-type'];

  		var error;
  		if (statusCode !== 200) {
    		error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`);
  		} else if (!/^application\/json/.test(contentType)) {
    		error = new Error(`Invalid content-type.\n` +
                      `Expected application/json but received ${contentType}`);
  		} if (error) {
    		console.log(error.message);
    		// consume response data to free up memory
    		res.resume();
    		return;
  		}
  		
  		res.setEncoding('utf8');  		
  		
  		res.pipe(JSONStream.parse('*')).pipe(writableStream);
  		
  		//This works -> writes single profiles to database  		
  		res.on('end', function(){
  			console.log("sending data to data transformation//")
  			dataTranformation.transformDatas(graph, responseObject)  		
  		});
	})
	
	.on('error', (e) => {
		console.log(`Got error: ${e.message}`);
		responseObject.status(400).send('error getting plotData')
	})
		
	req.end()

};


exports.fetchManagementData = function (mmdbStartDate, mmdbEndDate, mmdbAccess, responseObject) {
	
	//for testing
	//////  access database and drop the content
	var db = mongoDB.getMongoDB()
  	var  _collection = db.collection("management");
  	
  	_collection.drop();

	//request the data
	var user = 'BOSCH\\eric.van.lessen';
	//console.log(user)
  
	var password = 'N-/b{.ML1';
	//console.log(password)
  
	var auth = 'Basic ' + new Buffer( user + ':' + password ).toString('base64');	

	//fetch webtrends data from webtrends profil
	var webtrendsApiPath; //start_period=2016m11d12h00&end_period=2016m12d12h00&period_type=agg&format=html&suppress_error_codes=true

	if(mmdbAccess === "Gesamt"){
		webtrendsApiPath = '/v3/Reporting/spaces/122578/Keymetrics/?start_period='+mmdbStartDate+'&end_period='+mmdbEndDate+'&period_type=agg&format=json'
 	}

	if(mmdbAccess === "DIY" ){
		webtrendsApiPath = '/v3/Reporting/spaces/122578/Keymetrics/?start_period='+mmdbStartDate+'&end_period='+mmdbEndDate+'&period_type=agg&format=json'
  	}
	
	if(mmdbAccess === "PRO"){
		webtrendsApiPath = '/v3/Reporting/spaces/145335/Keymetrics/?start_period='+mmdbStartDate+'&end_period='+mmdbEndDate+'&period_type=agg&format=json'
  	}
  	
  	if(mmdbAccess === "HG"){
		webtrendsApiPath = '/v3/Reporting/spaces/124925/Keymetrics/?start_period='+mmdbStartDate+'&end_period='+mmdbEndDate+'&period_type=agg&format=json'
  	}

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
	
	//write data to management dashboard
	var collection = "management";
	
	// where the data will end up 
	var outputDBConfig = { dbURL : "mongodb://bdb_db:BFArwdHJPgYUkGjG@aws-us-east-1-portal.8.dblayer.com:15226/bdb_db?ssl=true", collection:collection };
 
	// create the writable stream 
	var writableStream = streamToMongoDB(outputDBConfig);
	
	console.log("request to webtrends");
	console.log("Webtrends API path " + webtrendsApiPath);
	
	var req = https.request(options, (res) => {
  		const statusCode = res.statusCode;
  		const contentType = res.headers['content-type'];

  		var error;
  		if (statusCode !== 200) {
    		error = new Error(`Request Failed.\n` +
                      `Status Code: ${statusCode}`);
  		} else if (!/^application\/json/.test(contentType)) {
    		error = new Error(`Invalid content-type.\n` +
                      `Expected application/json but received ${contentType}`);
  		} if (error) {
    		console.log(error.message);
    		// consume response data to free up memory
    		res.resume();
    		return;
  		}
  		
  		res.setEncoding('utf8');  
  		
  		res.pipe(process.stdout);
  		res.pipe(JSONStream.parse('*')).pipe(writableStream);
  		
  		//writableStream.end( dataTranformation.transformManagement(mmdbAccess, responseObject, _collection) )
  		
  		//This works -> writes single profiles to database  	
  
  		res.on('end', function(){
  			var delay=1000; //1 second
			console.log("going to send data to data transformation")
			setTimeout(function() {
				//code after one second
  				console.log("sending data to data transformation now")
  				dataTranformation.transformManagement(mmdbAccess, responseObject, _collection);	
			}, delay);
  			
  		});
  		
	})
	
	.on('error', (e) => {
		console.log(`Got error: ${e.message}`);
		responseObject.status(400).send('error getting ManagementData')
	})
	req.end()
};




	
	
	
	
