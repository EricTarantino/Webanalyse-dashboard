/*eslint-env node*/
//
// This model also holds the start date and end date for the management dashboard (date picker)
// mmdbStartDate, mmdbEndDate
//
//Bezieht mongoose als Schnittstelle zur MongoDB Datenbank
var mongoose = require('mongoose');

//Für das Dashboard wird der uniqueValidator aktiviert. 
//Dient der Festlegung, ob Einträge eindeutig sein müssen in der Datenbank 
//und erlaubt bei Nichteindeutigkeit keinen write Zugriff.
var uniqueValidator = require('mongoose-unique-validator');

//Legt die verwendete Datenbank fest
var options = { collection : "18_15_pm" }

//Definiert die Schema Datei. Die Schema legt das Datenformat in der Datenbank fest.
//Ein Nutzer hat die Parameter username (Benutzer), password (Passwort), useremail (Email), userrights (Benutzerrechte), 
//userdashboards (Dashboards), mmdbAccess (Management Dashboard Authorisierung), mmdbStartDate (Management Dashboard Start Datum), 
//mmdbEndDate (Management Dashboard End Datum), xplot (x-Plot des Graphen) und yplot (y-plot des Graphen). 
//Die Email Adress, der Dashboardname und der Graphname bilden den eindeutigen Schlüssel für einen Graphen.
var UserSchema = mongoose.Schema({
	
  username: 		{ type: String, 	required: true, 	unique: false  },
  password: 		{ type: String, 	required: true, 	select: false },
  useremail: 		{ type: String, 	required: true, 	unique: true, uniqueCaseInsensitive: true  },
  userrights: 		{ type: String, 	required: true,	 	unique: false },
  userdashboards: 	{ type: [String], 	required: false, 	unique: false },
  mmdbAccess: 		{ type: String, 	required: false,	unique: false },
  mmdbStartDate: 	{ type: String, 	required: false, 	unique: false },
  mmdbEndDate: 		{ type: String, 	required: false, 	unique: false }

}, options);

//Für das Dashboard wird der uniqueValidator aktiviert. 
//Stellt fest, ob Einträge eindeutig sind in der Datenbank und erlaubt ansonsten keinen write Zugriff.
UserSchema.plugin(uniqueValidator);

//Definiert das user-model, dass zur Runtime als Datenbankenschnittstelle verwendet wird.
var user = mongoose.model('User', UserSchema);

//Exportiert das Dashboard Model
module.exports = user;







