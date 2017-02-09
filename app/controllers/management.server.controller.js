/*eslint-env node*/
var bcrypt = require('bcrypt')
var jwt    = require('jwt-simple')

//Beziehe mongoose zur Verwendung des mongoose Datenbank Connectors.
var mongoose = require( 'mongoose' );
//Beziehe mongoose zur Verwendung des mongoose Datenbank Connectors.
var User = mongoose.model('User');
//Beziehe das client secret um sessions zu autorisieren.
var config = require('../../config/config.js');

var Webtrends = require('../modules/webtrends.server.module.js');

//Bezieht die Daten für ein Management Dashboard. 

//Anwortet mit den kompletten Graphen der Management Konfiguration eines users.
//(Die Konfiguration des Management Dashboards - aktueller Zustand - wird in der 
//get Route Methode - changeData - zuvor festgelegt.
exports.getManagementDashboard = function (req, res, next) {
	//Sende status 401, wenn der header zur autorisierung nicht vorhanden ist. 
	if (!req.headers['x-auth']) {
    	return res.status(401).send("Authorzation failed");
  	}
    //Bezieht das Objekt zur Kodierung der useremail aus dem jwt token, zwecks Suche in der Datenbank,
  	var auth = jwt.decode(req.headers['x-auth'], config.secret);
  	//Findet den aktuellen Benutzer in der Datenbank
  	User.findOne({useremail: auth.useremail}, function (err, user) {
    	console.log("found user: " + user)
    	//Wenn kein Benutzer gefunden wurde, dann sende status 402
    	if (err) {
      		console.log("user server controller" + err);
      		return res.sendStatus(402);
      	}
		
		console.log("Going to fetch management data");		
		console.log("user.mmdbStartDate: " + user.mmdbStartDate);
		console.log("user.mmdbEndDate: " + user.mmdbEndDate);
		console.log("user.mmdbAccess: " + user.mmdbAccess);
		
		//Bezieht die Daten zu dem Management dashboard
		Webtrends.fetchManagementData(user.mmdbStartDate, user.mmdbEndDate, user.mmdbAccess, res);	
	})
}

//Post Request für eine Management Dashboard Kofiguration. Hier werden 
//das Startdatum, das Enddatum und das aktuelle Zugriffsrecht festgelegt.
exports.changeData = function (req, res, next) {
  	//Prüft ob die notwendigen header vorliegen.
	if (!req.headers['x-auth']) {
    	return res.status(401).send("Authorzation failed");
  	}
    //Bezieht das Objekt zur kodierung der useremail zwecks Suche in der Datenbank
  	var auth = jwt.decode(req.headers['x-auth'], config.secret);
	//Das Benutzer model wird bereit gestellt. Wird benötigt um ein neues Dashbaord in der User Variable zu speichern.
  	User.findOne({useremail: auth.useremail}, function (err, user) {
    	console.log("found user: " + user);
    	//Wenn kein Benutzer gefunden wurde, dann sende status 402.
    	if (err) {
      		console.log("user server controller"+err);
      		return res.sendStatus(402);
      	}
		console.log(req.body.mmdbAccess);
		//Gegebenenfalls: Speichere die ausgewählten Daten im Management Dashboard des aktuellen users.
		//mmdbStartDate = Management Dashboard startDate. mmdbEndDate = Management Dashboard endDate.
		if(req.body.mmdbEndDate){
			console.log("change date");
			user.mmdbStartDate = req.body.mmdbStartDate;
			user.mmdbEndDate = req.body.mmdbEndDate;	
		//Gegebenenfalls: Speichere das Zugriffsrecht des Benutzers in der Datenbank
		//mmdbAccess = Management Dashboard Zugriff.
		} else {
			user.mmdbAccess = req.body.mmdbAccess;
		}		
		//Speichere den aktualisierten Benutzer in der Datenbank
		user.save();
		//Sende Erfolgsstatus 201 zurück an den Client
		return res.sendStatus(201);	
	})
}
