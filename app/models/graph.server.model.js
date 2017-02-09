/*eslint-env node*/

//Bezieht mongoose als Schnittstelle zur MongoDB Datenbank
var mongoose = require('mongoose');

//Bezieht für das Dashboard den uniqueValidator. 
var uniqueValidator = require('mongoose-unique-validator');

//Legt die verwendete Datenbank fest.
var options = { collection : "graph" }

//Definiert die Schema Datei. Die Schema legt das Datenformat in der Datenbank fest.
//Ein Graph hat die Parameter useremail (Email), dashboard (Dashboard), name (Name), kategorie (Kategorie), graph, methode, profile, startDate, endDate, xplot und yplot. 
//Die Email Adress, der Dashboardname und der Graphname bilden den eindeutigen Schlüssel für einen Graphen.
var GraphSchema = new mongoose.Schema({
	
	useremail:     { type: String, required: true },	
	dashboard:     { type: String, required: true },
	name:     { type: String, required: true },
	kategorie:     { type: String, required: false, default: 'Keine' },
	graph:     { type: String, required: true},
	method:     { type: String, required: true},
	profile:     { type: String, required: true},
	startDate:     { type: String, required: true },
	endDate:     { type: String, required: true },
	xplot: 		{ type: [String], required: false },
	yplot: 		{ type: [String], required: false }
	
}, options);

//Für das Dashboard wird der uniqueValidator aktiviert. 
//Stellt fest, ob Einträge eindeutig sind in der Datenbank und erlaubt ansonsten keinen write Zugriff.
GraphSchema.plugin(uniqueValidator);

//Die Kombination aus useremail, dashboard und name sollte einzigartig sein.
GraphSchema.index({ useremail: 1, dashboard: 1, name: 1}, { unique: true });

//Definiert das graph-model, dass zur Runtime als Datenbankenschnittstelle verwendet wird.
var graph = mongoose.model('Graph', GraphSchema);

//Exportiert das Graph Model
module.exports = graph;







