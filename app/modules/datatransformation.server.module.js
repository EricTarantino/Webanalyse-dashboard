/*eslint-env node*/
var bcrypt = require('bcrypt')
var jwt    = require('jwt-simple')
//var Webtrends   = require('../models/webtrends.server.model.js')
//var Dummydata   = require('../models/dummydata.server.model.js')


// TODO: include streaming

var mongoose = require( 'mongoose' ),  
    Webtrends = mongoose.model('Webtrends'),
	Dummydata  = mongoose.model('Dummydata');  

var config = require('../../config/config.js')
var request = require('request')
const https = require('https')
var extend = require('util')._extend
var jsonQuery = require('json-query')

//this was created in a singleton on app start
var mongoDB = require('../../config/mongoDB.js')

exports.transformDatas = function(graph, responseObject){
	
	//////  access database
	var db = mongoDB.getMongoDB()
		
	//////  obsolete 1 																	
	//////	code was here (see bottom). Option to test database and to drop databases  	  	
  	//////	collection.drop()  	
  	//////	http://stackoverflow.com/questions/10885044/mongodb-how-to-query-for-a-nested-item-inside-a-collection
  	//////	var profileIDArray = []  	  	

  	var  collection = db.collection('amigo');  	
  	
  	//////	x-Axis and y-Axis results  		
  	var _indexValue = []; 
  	var _xAxis 		= []; 
    var _yAxis 		= [];
  	
  	//to log the result => Select fields, use fields to find value and acces doc by name
  	collection.find( {'definition.profileID':{$exists:true}}, {'_id':0} ).toArray(function(err, docs) {
  		 
  		//var profileID
  		 
  		//retrieve the values from the file that we got from the database 
    	for(var i = 0; i < docs.length; i++){
    		//get profile ID
    		try{
    			var profileID = docs[i].definition['profileID'];
    			_indexValue.push(profileID);
    		} catch (e){
    			console.log(e);
    			_indexValue.push("");
    		}
    		
    		//get profile Name
    		try{
    			var profileName = docs[i].definition['profileName'];
    			_xAxis.push(profileName);
    		} catch (e){
    			console.log(e);
    			_xAxis.push("");
    		}
    		
    		//try to get page views if they are defined
    		try{
    			var yValue = docs[i].data[0].SubRows[profileID].measures['PageViews'];
    			//console.log("PageViews-xy, i " + i + ", " + yValue);
    			_yAxis.push(yValue)
    		} catch (e){
    			console.log("No Data Available: Error");
    			//_yAxis.push("");
    			_xAxis.pop();
    		}
    		
    		if(i >= docs.length-1){
    			console.log( _xAxis.length );
				console.log( _yAxis.length );	
				
      			//console.log("plotdata request für: " + graph);
      			graph.xplot= _xAxis;
				graph.yplot= _yAxis; 	
				
				graph.save()
				
				console.log(graph);
		
				var jsonResult = JSON.parse(JSON.stringify(graph));
				console.log( JSON.stringify(jsonResult ));	
				
				//the data from webtrends is emptied, we have the graph saved 
				//with the plot data in the graph collection with the graph object
				collection.drop();
				
				//We are sending a json object
				return responseObject.json(jsonResult).status(205);
    		}
    	} 	
	});	
}

//gets a user right from the user choice, gets a response object from the request 
//and gets the collection where the data is saved
exports.transformManagement = function(mmdbAccess, responseObject, collection){
	
	//////  access database
	//var db = mongoDB.getMongoDB()
		
	//////  obsolete 1 																	
	//////	code was here (see bottom). Option to test database and to drop databases  	  	
  	//////	collection.drop()  	
  	//////	http://stackoverflow.com/questions/10885044/mongodb-how-to-query-for-a-nested-item-inside-a-collection
  	//////	var profileIDArray = []  	  	

  	//var  collection = db.collection(collectionName);
 
 	//TODO Transform data to aggregated data and return in datatransformation, fetchManagementData
  	//////	x-Axis and y-Axis results  		
  	var _indexValue = [];
  	var _xAxis 		= []; 
    var _yAxis 		= [];
    
    var profileID;	
	var PageViews=0;
	var Visits=0;
  	var Visitors=0;
  	
  	/*
  	if(mmdbAccess === "DIY"){
		//to log the result => Select fields, use fields to find value and acces doc by name
	  	console.log("Access DIY")
	  	collection.find( {'definition.profileName' : "DIY - in total"}, {'_id':0} ).toArray(function(err, doc){
	  		console.log(JSON.stringify(doc));
	  		
	  		profileID = doc.definition['profileID'];	
	  		
	  		PageViews = doc.data[0].SubRows[profileID].measures['PageViews'];
	  		Visits = doc.data[0].SubRows[profileID].measures['Visits'];
	  		BounceRate = doc.data[0].SubRows[profileID].measures['BounceRate'];
	  	})
	}
	*/
	var query;
	
	if(mmdbAccess === "DIY"){
		console.log("Access DIY")
		query =  {"definition.profileName" : "DIY - in total"};
	}
	
	if(mmdbAccess === "PRO"){
		console.log("Access PRO")
		query = {"definition.profileName": "PT-BE in total"};
	}
	
	if(mmdbAccess === "HG"){
		console.log("Access HG")
		query =  {"definition.profileName" : "LG Bosch Garden - in total"};
	}
		
	var test = true;
	
	if(test){
		collection.find( query, {'_id':0} ).toArray(function(err, _doc){
			console.log("_doc length in real query is " + _doc.length);
			
			try{
				console.log(JSON.stringify(_doc));
			}catch(e){
				console.log("can not log doc, try0")	
			}			
			try{
				console.log(JSON.stringify(_doc[0]));
			}catch(e){
				console.log("can not log doc[0], try0")	
			}
			try{
				console.log(_doc);
			}catch(e){
				console.log("can not log doc, try1")	
			}			
			try{
				console.log(_doc[0]);
			}catch(e){
				console.log("can not log doc[0], try1")
			}
	  		
	  		var doc = _doc[0];
	  		
	  		//read out the profile ID to find other metrics
	  		try{
	  			profileID = doc.definition['profileID'];
	  		}catch (e){
	  			console.log("doc.definition.profileID is probably undefined")	
	  		}
	  		
	  		//get the metric values, the profile ID is necessary to get access
	  		try{	  			
	  			PageViews = doc.data[0].SubRows[profileID].measures['PageViews'];
	  			Visits = doc.data[0].SubRows[profileID].measures['Visits'];
	  			Visitors = doc.data[0].SubRows[profileID].measures['Visitors'];
	  			console.log("PageViews "+PageViews+", Visits "+Visits+", Visitors "+Visitors);
	  			
	  		}catch (e){
	  			console.log("datatransformation.server.module.js, Line 170, metrics not defined in the API-JSON-res?")	
	  		}
	  		
	  		try{
				var	managementDB = JSON.stringify({"PageViews" : PageViews, "Visits": Visits, "Visitors": Visitors});
			}catch(e){
				console.log("error writing the managementDB")
			}	
			
			console.log(JSON.stringify(managementDB));
				
			return responseObject.status(201).json(managementDB);
	  	})	  
	}
}
	
	/*
	if(mmdbAccess === "HG"){
		console.log("Access HG")
		collection.find( {'definition.profileName' : "LG Bosch Garden - in total"}, {'_id':0} ).toArray(function(err, doc){
	  		console.log(JSON.stringify(doc));
	  		
	  		profileID = doc.definition['profileID'];		  		
	  		PageViews = doc.data[0].SubRows[profileID].measures['PageViews'];
	  		Visits = doc.data[0].SubRows[profileID].measures['Visits'];
	  		BounceRate = doc.data[0].SubRows[profileID].measures['BounceRate'];
	  	})	
	}
	
	if(mmdbAccess === "Gesamt"){
		console.log("Access Gesamt")
		PageViews = 10;
	  	Visits = 10;
	  	BounceRate = 10;
	}
	*/
	
	
	
	
	/*
	test the connection by logging the status of the Database.
	 
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
  	
  	//Select database
  	
  	
  	Possibility to empty the Database (only amigo and 18_15_pm are in use)
  	
  	collection.drop();

  	var  collection = db.collection('benutzer');
  	collection.drop();	
  	
  	var  collection = db.collection('devTestOutput');
  	collection.drop();
  	
	var  collection = db.collection('graph');
  	collection.drop();
  	
	var  collection = db.collection('test');
  	collection.drop();
  	
  	var  collection = db.collection('users');
  	collection.drop();
  	
  	var  collection = db.collection('webtrends');
  	collection.drop();




	/////////////////////////////////////////////////     obsolete 2     //////////////////////////////////
	 
	////build up queries///
	
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
		
		db.collection.remove()
		
		console.log(rawData1)
		
		console.log(JSON.stringify(rawData1))
		
		responseObject.status(200).json(rawData1);		

	}	
	
	traverse_Profilenames( rawData1 )	
}
*/






