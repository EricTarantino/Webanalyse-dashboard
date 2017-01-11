/*eslint-env node*/
var bcrypt = require('bcrypt-nodejs'); // require('bcrypt')
var jwt = require('jwt-simple')
	//var Webtrends   = require('../models/webtrends.server.model.js')
	//var Dummydata   = require('../models/dummydata.server.model.js')

var mongoose = require('mongoose'),
	Webtrends = mongoose.model('Webtrends'),
	Dummydata = mongoose.model('Dummydata');


var config = require('../../config/config.js')
var request = require('request')
const https = require('https')
var extend = require('util')._extend
var jsonQuery = require('json-query')

//this was created in a singleton on app start
var mongoDB = require('../../config/mongoDB.js')

exports.transformDatas = function(graph, responseObject) {

	//access database
	var db = mongoDB.getMongoDB()

	/*test the connection by logging the status of the Database. 	
	var getDbStats = function(db, callback) {
    	db.command({'dbStats': 1},
      		function(err, results) {
        		console.log(results);
        		callback();
    		}
  		);
	};	
	getDbStats(db, function() {
    	console.log("in db stats callback");
  	});
  	*/
	//Select database
	var collection = db.collection('amigo');

	//collection.drop()

	//http://stackoverflow.com/questions/10885044/mongodb-how-to-query-for-a-nested-item-inside-a-collection
	var profileIDArray = []

	//x-Axis and y-Axis results
	var _indexValue = []; //auskommentieren, wird nicht benutzt
	var _xAxis = [];
	var _yAxis = [];


	//to log the result => Select fields, use fields to find value and acces doc by name
	collection.find({
		'definition.profileID': {
			$exists: true
		}
	}, {
		'_id': 0
	}).toArray(function(err, docs) {

		//var profileID

		//retrieve the values from the file that we got from the database 
		for (var i = 0; i < docs.length; i++) {
			//get profile ID
			try {
				var profileID = docs[i].definition['profileID'];
				_indexValue.push(profileID);
			} catch (e) {
				console.log(e);
				_indexValue.push("");
			}

			//get profile Name
			try {
				var profileName = docs[i].definition['profileName'];
				_xAxis.push(profileName);
			} catch (e) {
				console.log(e);
				_xAxis.push("");
			}

			/*print profile ID
			try{
				console.log("profileIDs-xy, i " + i + ", " + profileID);
			} catch (e){ console.log(e) }
    		
			//print profile Name
			try{
				console.log("profileName-xy, i " + i + ", " + profileName);
			} catch (e){ console.log(e) }
			*/

			//try to get page views if they are defined
			try {
				var yValue = docs[i].data[0].SubRows[profileID].measures['PageViews'];
				//console.log("PageViews-xy, i " + i + ", " + yValue);
				_yAxis.push(yValue)
			} catch (e) {
				console.log("No Data Available: Error");
				//_yAxis.push("");
				_xAxis.pop();
			}

			if (i >= docs.length - 1) {
				console.log(_xAxis.length);
				console.log(_yAxis.length);

				//console.log("plotdata request für: " + graph);
				graph.xplot = _xAxis;
				graph.yplot = _yAxis;

				graph.save()

				console.log(graph);

				var jsonResult = JSON.parse(JSON.stringify(graph));
				console.log(JSON.stringify(jsonResult));

				//the data from webtrends is emptied, we have the graph saved 
				//with the plot data in the graph collection with the graph object
				collection.drop();

				//We are sending a json object
				return responseObject.json(jsonResult).status(205);
			}
		}

	});
}

/*
	//build up queries
	for(var i = 0; i < profileIDArray.length; i++){
		
		//Build up Query manually, with variables
		var name1 = 'data[0].SubRows.'+profileIDArray[i]+'.measures.PageViews' ;
		var nameValue1 = {$exists:true};
		var query = {};
		query[name1] = nameValue1;
		
		//Build up Options manually, with variables		
		var options1 = '_id' ;
		var optionsValue1 = 0;		
		var options2 = 'data[0].SubRows.'+profileIDArray[i]+'.measures.PageViews' ;
		var optionsValue2 = 1;
		var options = {};
		
		options[options1] = optionsValue1;
		options[options2] = optionsValue2;

    }   	
    */

/*
    	


		
		_value.push("")
		_result.push("")
		
		//control the results
		console.log( _result )
		console.log( _value  )
		
		console.log( _result.length )
		console.log( _value.length  ) 		
		
		var ResponseJsonDataPlot;
		
		var json = JSON.stringify({ xAxis: _result, yAxis: _value });
		
		console.log(json)
		*/
/*
		db.collection.remove()
		
		console.log(rawData1)
		console.log(JSON.stringify(rawData1))
		
		responseObject.status(200).json(rawData1);		

	}	
	
	traverse_Profilenames( rawData1 )	
}
*/
