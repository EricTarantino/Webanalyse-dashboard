/*eslint-env node*/

//Questions
//https://docs.mongodb.com/v3.2/reference/method/connect/
//https://www.tutorialspoint.com/mongodb/mongodb_environment.htm
//http://mongodb.github.io/node-mongodb-native/2.2/tutorials/connect/
	
//node modules are singletons, we only need to load this one time
var MongoClient = require('mongodb').MongoClient;
var	assert = require('assert'),
	fs = require('fs'),
	config = require('./config');

var connectedMongoDB;	

// MongoDB Driver Connection Connection URL 
var url = config.db;
// Use connect method to connect to the Server 

var ca = [fs.readFileSync(__dirname + "/servercert.crt")];

var options = {
	//promiseLibrary: require('es6-promise'),
    mongos: {
        ssl: true,
        sslValidate: true,
        sslCA: ca,
    }
};



MongoClient.connect(url, options, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  connectedMongoDB = db;
});

module.exports.mongoDB = connectedMongoDB;

module.exports.getMongoDB = function (){
	console.log("Mongo DB Exported");
	return connectedMongoDB;
}