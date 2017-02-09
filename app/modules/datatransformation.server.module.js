/*eslint-env node*/
//var bcrypt = require('bcrypt')
//var jwt    = require('jwt-simple')


//var mongoose = require( 'mongoose' );  
//var Webtrends = mongoose.model('Webtrends');
//var Dummydata  = mongoose.model('Dummydata');  

//var config = require('../../config/config.js');
//var request = require('request');
//const https = require('https');
//var extend = require('util')._extend
//var jsonQuery = require('json-query');


//Beziehe die Mongo Datenbank direkt um präzise querries zu stellen.
var mongoDB = require('../../config/mongoDB.js');

//Transformation der Daten von Webtrends
exports.transformDatas = function(graph, responseObject){
	
	//Beziehe den Mongo Datenbank Connector.  
	var db = mongoDB.getMongoDB();
		
	//Stelle die Verbindung zur Compose Database her.
  	var  collection = db.collection('amigo');  	
  	
  	//Stelle Variablen breit um Graphdaten zu speichern.  		
  	var _indexValue = []; 
  	var _xAxis 		= []; 
    var _yAxis 		= [];
  	
  	//Finde alle Einträge für die eine Profile ID existiert
  	collection.find( {'definition.profileID':{$exists:true}}, {'_id':0} ).toArray(function(err, docs) {
  		 
  		//Erhalte die Werte von der Datenbank die gesucht sind, dazu wird die Profile ID benötigt.
    	for(var i = 0; i < docs.length; i++){
    		//Lese die profile id aus.
    		try{
    			var profileID = docs[i].definition['profileID'];
    			_indexValue.push(profileID);
    		} catch (e){
    			console.log(e);
    			_indexValue.push("");
    		}
    		
    		//Lese zu einer Profile ID den Profilnamen aus, dieser wird im Frontend angezeigt. 
    		try{
    			var profileName = docs[i].definition['profileName'];
    			_xAxis.push(profileName);
    		} catch (e){
    			//Falls der Wert nicht lesbar ist, schreibe eine Leerstelle als x-Wert.
    			console.log(e);
    			_xAxis.push("");
    		}
    		
    		//Lese zu einem profil namen die Pageviews aus (oder eine andere beliebige Metrik).
    		try{
    			var yValue = docs[i].data[0].SubRows[profileID].measures['PageViews'];
    			//Füge die ausgelesene Metrik als y-Achsen Wert ein.
    			_yAxis.push(yValue)
    		} catch (e){
    			console.log("No Data Available: Error");
    			//Falls kein y-Wert lesbar ist, entferne den x-WErt an dieser Stelle. 
    			_xAxis.pop();
    		}
    		
    		if(i >= docs.length-1){
    			console.log( _xAxis.length );
				console.log( _yAxis.length );	
				
      			//Speichere die ausgelesenen Werte im Graphobjekt, dass zurück geschickt wird. 
      			graph.xplot= _xAxis;
				graph.yplot= _yAxis; 	
				
				//Speichere den Graphen in der Graphdatenbank ab.
				graph.save()
				
				console.log(graph);
				
				//Transformiere den Graphen, in ein JSON Objekt, dass zum lient geschickt wird. 
				var jsonResult = JSON.parse(JSON.stringify(graph));
				console.log( JSON.stringify(jsonResult ));	
				
				//Leere die Webtrendsdatenbank (Dieser Schritt fällt weg, unter Verwendung von predictive analytics).
				collection.drop();
				
				//Schicke ein JSON Objekt an den Client zurück mit dem Graphen. 
				return responseObject.json(jsonResult).status(205);
    		}
    	} 	
	});	
}

//Transformation der Daten für ein Management Dashboard
exports.transformManagement = function(mmdbAccess, responseObject, collection){
	
	//Deklariere eine Variable, in der der Profilname gespeichert wird.     
    var profileID;
    
    //Deklariere Variablen der anzuzeigenden Metriken bereit.
	var PageViews=0;
	var Visits=0;
  	var Visitors=0;
  	
 	//Deklariere eine Variable, welche die query enthält, diese ist von des Clientrequests abhängig. 
	var query;
	
	//Initialisiere die query an Webtrends entsprechend des Clientrequests, berücksichtige das gewählte Profil. 
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
		//Finde die Daten entsprechend der initialisierten query.  
		collection.find( query, {'_id':0} ).toArray(function(err, _doc){
			
			//Loggen in der Serverconsole
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
	  		
	  		//Initialisiere eine Variable mit dem Ergebnis der query. 
	  		var doc = _doc[0];
	  		
	  		//Lese die id aus, um die Metriken auslesen zu können.
	  		//Dies hängt mit der Datenstruktur zusammen, die von Webtrends bereit gestellt wird.
	  		try{
	  			profileID = doc.definition['profileID'];
	  		}catch (e){
	  			console.log("doc.definition.profileID is probably undefined")	
	  		}
	  		
	  		//Lese die Metrik Werte aus und speichere sie in der Variable. 
	  		try{	  			
	  			PageViews = doc.data[0].SubRows[profileID].measures['PageViews'];
	  			Visits = doc.data[0].SubRows[profileID].measures['Visits'];
	  			Visitors = doc.data[0].SubRows[profileID].measures['Visitors'];
	  			console.log("PageViews "+PageViews+", Visits "+Visits+", Visitors "+Visitors);
	  			
	  		}catch (e){
	  			console.log("datatransformation.server.module.js, Line 170, metrics not defined in the API-JSON-res?")	
	  		}
	  		
	  		try{
	  			//Erstelle ein JSON, welches zurück geschickt wird zum Client mit den Werten. 
				var	managementDB = JSON.stringify({"PageViews" : PageViews, "Visits": Visits, "Visitors": Visitors});
			}catch(e){
				console.log("error writing the managementDB")
			}	
			
			console.log(JSON.stringify(managementDB));
				
			//Schicke das Objekt zurük. 
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






