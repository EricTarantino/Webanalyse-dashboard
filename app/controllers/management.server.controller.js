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
exports.getManagementDashboard = function (req, res, next) {
	console.log("get mmdb")
	if (!req.headers['x-auth']) {
    	return res.status(401).send("Authorzation failed");
  	}

  	var auth = jwt.decode(req.headers['x-auth'], config.secret);
  	
  	User.findOne({useremail: auth.useremail}, function (err, user) {
    	console.log("found user: " + user)
    	if (err) {
      		console.log("user server controller" + err);
      		return res.sendStatus(402);
      	}
		
		console.log("Going to fetch management data");
		
		console.log("user.mmdbStartDate: " + user.mmdbStartDate);
		console.log("user.mmdbEndDate: " + user.mmdbEndDate);
		console.log("user.mmdbAccess: " + user.mmdbAccess);
		
		Webtrends.fetchManagementData(user.mmdbStartDate, user.mmdbEndDate, user.mmdbAccess, res);
		
	})
}

exports.changeData = function (req, res, next) {
	
	if (!req.headers['x-auth']) {
    	return res.status(401).send("Authorzation failed");
  	}

  	var auth = jwt.decode(req.headers['x-auth'], config.secret);
  	
  	User.findOne({useremail: auth.useremail}, function (err, user) {
    	console.log("found user: " + user)
    	if (err) {
      		console.log("user server controller"+err);
      		return res.sendStatus(402);
      	}
		console.log(req.body.mmdbAccess)
		//assign the dates to the user document
		if(req.body.mmdbEndDate){
			console.log("change date")
			user.mmdbStartDate = req.body.mmdbStartDate;
			user.mmdbEndDate = req.body.mmdbEndDate;	
		} else {
			user.mmdbAccess = req.body.mmdbAccess;
		}
		
		//save the user
		user.save();		
		
		//return the status
		return res.sendStatus(201);	
	})
}
