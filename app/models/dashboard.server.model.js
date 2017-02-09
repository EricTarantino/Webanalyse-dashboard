/*eslint-env node*/

//Bezieht mongoose als Schnittstelle zur MongoDB Datenbank.
var mongoose = require('mongoose');

//Bezieht für das Dashboard den uniqueValidator.
var uniqueValidator = require('mongoose-unique-validator');

//Legt die verwendete Datenbank fest
var options = { collection : "dashboard" }

//Definiert die Schema Datei. Die Schema legt das Datenformat in der Datenbank fest.
//Ein Dashboard hat die Attribute useremail (Besitzer), dbname (Name) und graphs (Graphen). 
//Die Email Adresse, der Dashboardname und der Graphname bilden den eindeutigen Schlüssel für einen Graphen. 
var DashboardSchema = new mongoose.Schema({	
	useremail:     	{ type: String, required: true },
	dbname:     	{ type: String, required: true},
	graphs:     	{ type: [String], required: true }	
}, options);

//Für das Dashboard wird der uniqueValidator aktiviert. 
//Stellt fest, ob Einträge eindeutig sind in der Datenbank und erlaubt ansonsten keinen write Zugriff.
DashboardSchema.plugin(uniqueValidator);

//Die Kombination aus useremail and dbname sollte einzigartig sein.
DashboardSchema.index({ useremail: 1, dbname: 1}, { unique: true });

//Definiert das dashboard-model, dass zur Runtime als Datenbankenschnittstelle verwendet wird.
var dashboard = mongoose.model('Dashboard', DashboardSchema);

//Exportiert das Dashboard Model
module.exports = dashboard;



