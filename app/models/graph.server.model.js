/*eslint-env node*/
//var mongoose = require('../../config/mongoose.js');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
 

var options = { collection : "graph" }

var GraphSchema = new mongoose.Schema({
	
	useremail:     { type: String, required: true },	
	dashboard:     { type: String, required: true },
	name:     { type: String, required: true },
	kategorie:     { type: String, required: true, default: 'Keine' },
	graph:     { type: String, required: true},
	method:     { type: String, required: true},
	profile:     { type: String, required: true},
	startDate:     { type: String, required: true },
	endDate:     { type: String, required: true },
	xplot: 		{ type: [String], required: false },
	yplot: 		{ type: [String], required: false }
	
}, options);

GraphSchema.plugin(uniqueValidator);

var graph = mongoose.model('Graph', GraphSchema);

module.exports = graph;