/*eslint-env node*/
//var mongoose = require('../../config/mongoose.js');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var options = { collection : "webtrends", strict: false }

var webtrendsSchema = new mongoose.Schema({}, options);

var webtrends = mongoose.model('Webtrends', webtrendsSchema);

module.exports = webtrends;