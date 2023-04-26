/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------
process.env.NODE_ENV = 'development';

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('./config/express'),
	mongooseConnector = require('./config/mongoose.js'),
	mongoDBDriver = require('./config/mongoDB.js');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

module.exports = app; 
