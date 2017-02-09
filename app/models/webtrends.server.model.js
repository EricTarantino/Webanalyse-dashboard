/*eslint-env node*/

//Bezieht mongoose als Schnittstelle zur MongoDB Datenbank.
var mongoose = require('mongoose');

//Bezieht für das Dashboard den uniqueValidator.
var uniqueValidator = require('mongoose-unique-validator');

//Legt die verwendete Datenbank fest.
var options = { collection : "webtrends", strict: false }

//Definiert eine freie Struktur für das Datenformat.
var webtrendsSchema = new mongoose.Schema({}, options);

//Define the webtrends-model to be used on runtime with the mongoose functionality.
var webtrends = mongoose.model('Webtrends', webtrendsSchema);

//Exportiert das webtrends model.
module.exports = webtrends;

