/*eslint-env node*/
//var mongoose = require('../../config/mongoose.js');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
 
 
var options = { collection : "webtrends" }

var DummydataSchema = new mongoose.Schema({
	
	data: { type: String },
	content: [Number]
	
}, options);

DummydataSchema.plugin(uniqueValidator);

var dummydata = mongoose.model('Dummydata', DummydataSchema);

module.exports = dummydata;