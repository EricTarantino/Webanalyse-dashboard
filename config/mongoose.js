/*eslint-env node*/
//source: https://help.compose.com/docs/connecting-to-mongodb#mongoose-node-and-compose
//Best Practive 
//Connection http://theholmesoffice.com/mongoose-connection-best-practice/


var mongoose = require('mongoose'),
	assert = require('assert'),
	fs = require('fs'),
	config = require('./config');

var ca = [fs.readFileSync(__dirname + "/servercert.crt")];

var options = {
	//promiseLibrary: require('es6-promise'),
    mongos: {
        ssl: true,
        sslValidate: true,
        sslCA: ca,
    }
};

// If the connection throws an error
mongoose.connection.on('error',function (err) {
	console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('open', function (err) {
   	assert.equal(null, err);   	
   	mongoose.connection.db.listCollections().toArray(function(err, collections) {
       assert.equal(null, err);       
       collections.forEach(function(collection) {
           console.log(collection);
       });     
   	});
});

var MongoClient = require('mongodb').MongoClient, assert = require('assert');


mongoose.Promise = global.Promise;

mongoose.connect(config.db, options);


// BRING IN YOUR SCHEMAS & MODELS // For example 
//require('../app/models/dummydata.server.model.js');  
require('../app/models/graph.server.model.js');  
//require('../app/models/post.server.model.js');  
require('../app/models/user.server.model.js');  
require('../app/models/webtrends.server.model.js'); 



// If the Node process ends, close the Mongoose connection and MongoDB connection
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

