/*eslint-env node*/
//var mongoose = require('../../config/mongoose.js');
var mongoose = require('mongoose');

var options = { collection : "management", strict: false }

var webtrendsSchema = new mongoose.Schema({}, options);

var management = mongoose.model('Management', webtrendsSchema);

module.exports = management;