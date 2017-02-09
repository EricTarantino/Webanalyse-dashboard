/*eslint-env node*/

//Bezieht mongoose als Schnittstelle zur MongoDB Datenbank.
var mongoose = require('mongoose');

//Definiert für das Management Dashboard die collection "management" als Speicherort.
var options = { collection : "management", strict: false }

//Definiert eine freie Struktur für das Datenformat.
var webtrendsSchema = new mongoose.Schema({}, options);

//Definiert das management Model, dass zur runtime verwendet wird als Datenbankenschnittstelle.
var management = mongoose.model('Management', webtrendsSchema);

//Stellt das management model über export bereit. 
module.exports = management;