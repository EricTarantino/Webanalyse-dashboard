/*eslint-env node*/

//Bezieht mongoose als Schnittstelle zur MongoDB Datenbank.
var mongoose = require('mongoose');

//Bezieht für das Dashboard den uniqueValidator.
var uniqueValidator = require('mongoose-unique-validator');
 
//Legt die verwendete Datenbank fest.
var options = { collection : "webtrends" }

//Definiert die Schema Datei. Die Schema legt das Datenformat in der Datenbank fest.
//Ein Dashboard hat einen Besitzer, einen Namen und Graphen, welche mit einem Namen definiert sind. 
//Die Email Adress, der Dashboardname und der Graphname bilden den eindeutigen Schlüssel für einen Graphen.
var DummydataSchema = new mongoose.Schema({
	
	data: { type: String },
	content: [Number]
	
}, options);

//Für das Dashboard wird der uniqueValidator aktiviert. 
//Stellt fest, ob Einträge eindeutig sind in der Datenbank 
//und erlaubt ansonsten keinen write Zugriff.
DummydataSchema.plugin(uniqueValidator);

//Define the dummydata-model to be used on runtime with the mongoose functionality
var dummydata = mongoose.model('Dummydata', DummydataSchema);

//exportiert das graph model
module.exports = dummydata;