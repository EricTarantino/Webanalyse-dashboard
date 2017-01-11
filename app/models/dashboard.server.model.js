/*eslint-env node*/
//var mongoose = require('../../config/mongoose.js');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var options = { collection : "dashboard" }

var DashboardSchema = new mongoose.Schema({	
	useremail:     { type: String, required: true },
	dbname:     { type: String, required: true},
	graphs:     { type: [String], required: true }	
}, options);

DashboardSchema.plugin(uniqueValidator);

var graph = mongoose.model('Dashboard', DashboardSchema);

module.exports = graph;