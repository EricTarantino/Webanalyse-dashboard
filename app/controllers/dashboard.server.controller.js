/*eslint-env node*/
var bcrypt = require('bcrypt-nodejs'); // require('bcrypt')
var jwt = require('jwt-simple')
	//var User   = require('../models/user.server.model.js')
var config = require('../../config/config.js')
var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Graph = mongoose.model('Graph');

//TODO Also save in the graph database
exports.get = function(req, res, next) {
	if (!req.headers['x-auth']) {
		return res.status(401).send("authorization failed");
	}

	var dashboard = req.get('dashboardname');
	var auth = jwt.decode(req.headers['x-auth'], config.secret);

	//find all graphs for the given dashboard name
	Graph.find({
		useremail: auth.useremail,
		dashboard: dashboard
	}, function(err, dashboard) {
		if (err) {
			console.log(err);
			return next(err);
		}
		console.log(dashboard);
		
		//return array of graphs which are in the given dashboard
		res.json(dashboard);
	});
};

//TODO make model for dashboard, save dashboards name, graphname string array and kategorie and useremail string array
//every dashboard gets saved in the dashboard database


exports.post = function(req, res) {

	var userNewDBName = req.body.selectedNameDB;

	if (!req.headers['x-auth']) {
		return res.status(401).send("Authorzation failed");
	}

	console.log("post dashboard")
	var auth = jwt.decode(req.headers['x-auth'], config.secret);
	User.findOne({
		useremail: auth.useremail
	}, function(err, user) {
		console.log("found user: " + user)
		if (err) {
			console.log("user server controller" + err);
			return res.sendStatus(402);
		}
		console.log("new nb name: " + userNewDBName);

		//insert new dashboard in List
		var userdashboards = user.userdashboards;
		userdashboards.push(userNewDBName);

		user.userdashboards = userdashboards;

		user.save(function(err, user) {
			if (err) {
				console.log("user server controller" + err);
				return res.sendStatus(406);
			}
			console.log("der user json:" + user);
			console.log("my username: " + user.username);
			console.log("my useremail: " + user.useremail);
			console.log("my dashboards: " + user.userdashboards);

			/*Response status 201 means content was created specified in 
			https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
			the result is not being sended in the post response, but should
			be requested in a get resonse. The result is an updated user,
			but the local user dashboard is already updated clientside.
			The clientside takes care of an error response.*/
			return res.status(201)

			//var jsonResult = JSON.parse(JSON.stringify(user));
			//res.status(201).json(jsonResult);     
		})
	});
}

//TODO also delete all graphs 
exports.delete = function(req, res) {

	//console.log("query param: "+req.query._db)

	if (!req.headers['x-auth']) {
		return res.status(401).send('Authorization missing');
	}

	/*id is the name of the dashboard that should be deleted,
	 *userdashboards in the user database need modification
	 *(could this be done with put User (REST Application)?),
	 *and all graphs that belong to this dashboard need to be deleted
	 *from the graph database */
	var auth = jwt.decode(req.headers['x-auth'], config.secret);

	//find the user document 
	User.findOne({
		useremail: auth.useremail
	}, function(err, user) {

		if (err) {
			console.log("user server controller" + err);
			return res.status(401).send('Authorization failed');
		}

		//read out the query, name of the dashboard that should be deleted
		var id = req.query._db;

		//delete all graphs that belong to the dashboard
		Graph.remove({
			dashboard: id
		}, function(err) {

			if (err) {
				res.status(401).send('Delete graphs for dashboard failed');
			} // removed!   

			console.log("delete id: " + id);

			//if all graphs could be deleted, delete the dashboard from dashboard array
			var index = user.userdashboards.indexOf(id)
			if (index >= 0) {
				user.userdashboards.splice(index, 1);
			}

			//tell mongoose that the array has changed
			user.markModified("userdashboards");

			/*long version without mark modified but with a helper variable: 
			var arr = user.userdashboards; var index = arr.indexOf(id); if (index >= 0) {arr.splice( index, 1 )};user.userdashboards = arr;*/

			//save changes to the user, especially save the change of the dashboard list
			user.save(function(err, user) {
				if (err) {
					console.log("user server controller" + err);
					return res.status(401).send("Updating list of dashboards failed");
				}
				console.log("der user json:" + user);
				console.log("my dashboards : " + user.userdashboards);

				/*var jsonResult = JSON.parse( JSON.stringify( user ) )*/

				//send status: ok
				return res.status(200)
			})
		});
	});
}
