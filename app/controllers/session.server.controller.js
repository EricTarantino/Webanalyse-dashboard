/*eslint-env node*/
var bcrypt = require('bcrypt-nodejs'); // require('bcrypt-nodejs'); // require('bcrypt')
var jwt = require('jwt-simple')
var config = require('../../config/config.js')
	//var User   = require('../models/user.server.model.js')

var mongoose = require('mongoose'),
	User = mongoose.model('User');



//one username may be given one time, the database will only find the first user with the name for password comparison
//so every username should be unique

exports.post = function(req, res, next) {
	//TODO email adress is missing
	//var username = req.body.username;
	var useremail = req.body.useremail;
	var password = req.body.password;
	console.log("Login: useremail " + useremail + ", password " + password)
	User.findOne({
			useremail: useremail
		})
		.select('password')
		.exec(function(err, user) {
			if (err) {
				return next(err)
			}
			if (!user) {
				return res.send("user nicht vorhanden")
			}
			bcrypt.compare(req.body.password, user.password, function(err, valid) {
				if (err) {
					return next(err)
				}
				if (!valid) {
					return res.send("password falsch")
				}
				var token = jwt.encode({
					useremail: useremail
				}, config.secret)
				return res.send(token)
			})
		})
}
