/*eslint-env node*/

//Erstellt für die aktuelle Session eines Benutzers einen Token aus dem Passwort und der Benutzeremail. 

//Bezieht bcrypt zum Vergleich des gespeicherten kodierten Passworts und des angegebenen Passworts.
var bcrypt = require('bcrypt');
//Bezieht eine jwt-simple Instanz zur Verwendung von jwt Token in der Session.
var jwt = require('jwt-simple');
//Bezieht eine config Instanz um das Secret zur Erstellung von Sessions zu erhalten. 
var config = require('../../config/config.js');
//Beziehe mongoose zur Verwendung des mongoose Datenbank Connectors.
var mongoose = require( 'mongoose' );
//Das Benutzer model wird bereit gestellt. Wird benötigt um den User zu finden und mittels useremail (Login Formular) 
//und Session Secret ein token zu erstellen. Wird benötigt um ein neues Dashboard in der User Variable zu speichern.
var User = mongoose.model('User');
//One username may be given one time, the database will only find the first user with the name for password comparison.
//So every username should be unique.
exports.post = function (req, res, next) {
  //Auslesen kann über req.body.parameter geschehen weil der json body parser zuvor verwendet wurde. 
  //Liest die von Benutzer angegebene Email aus.
  var useremail = req.body.useremail;  
  //Liest das vom Benutzer angegebene Passwort aus.
  var password = req.body.password;
  console.log("Login: useremail "+useremail+", password "+password);
  //Lese einen Benutzer aus um das angegebene Passwort mit dem gespeicherten Passwort zur useremail zu vergleichen.
  User.findOne({useremail: useremail})
  //Wähle das Passwort Parameter aus dem user Eintrag aus. 
  .select('password')
  //Führe eine Funktion aus um das Passwort zu vergleichen und einen Session Token zum Client zu schicken.
  .exec(function (err, user) {
  	//Ein grundsätzlicher Fehler.
    if (err) { return res.send("Fehler beim Einloggen ") }
    //Ein Fehler bei der Abfrage der useremail
    if (!user) { return res.send("useremail nicht vorhanden") }
    //Vergleiche das Passwort aus dem request body und das Benutzer Passwort. 
    bcrypt.compare(req.body.password, user.password, function (err, valid) {
		//Ein Fehler beim Abgleich des Passworts ist aufgetreten, antworte mit einem Fehlerstatus.
		if (err) { return res.send("Fehler beim Passwort Vergleich") }
		//Das Passwort ist falsch, antworte mit einem Fehlerstatus.
		if (!valid) { return res.send("password falsch") }
		//Das Passwort ist korrekt, antworte mit dem Session Token, dieser wird aus der useremail gewonnen.
		var token = jwt.encode({useremail: useremail}, config.secret);
		//Sende den Token zurück.
		return res.send(token);
    });
  });
}

 	 		