/*eslint-env node*/
//var mongoose = require('../../config/mongoose.js');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
 

var options = { collection : "18_15_pm" }

var PostSchema = new mongoose.Schema({
	
	username: { type: String, required: true },
	body:     { type: String, required: true },
	date:     { type: Date,   required: true, default: Date.now }
	
}, options);

PostSchema.plugin(uniqueValidator);

var post = mongoose.model('Post', PostSchema);

module.exports = post;