/*eslint-env node*/
//Bezieht bcrypt zum Vergleich des gespeicherten kodierten Passworts und des angegebenen Passworts.
var   bcrypt = require('bcrypt')
//Bezieht eine jwt-simple Instanz zur Verwendung von jwt Token in der Session.
var   jwt    = require('jwt-simple')
//Bezieht eine config Instanz um das Secret zur Erstellung von Sessions zu erhalten. 
var   config = require('../../config/config.js')
//Beziehe mongoose zur Verwendung des mongoose Datenbank Connectors.
var mongoose = require( 'mongoose' );
//Das Benutzer model wird bereit gestellt. Wird benötigt um den User zu finden und mittels useremail (Login Formular).
//und Session Secret ein token zu erstellen. Wird benötigt um ein neues Dashboard in der User Variable zu speichern.
var 	User = mongoose.model('User');

//Erhalte einen User mittels get request. Der user wird über seine Emailadresse gefunden. 
exports.get = function (req, res, next) {
  //Prüft ob die notwendigen header vorliegen. Falls ja, antworte mit einem 401 Fehler Status.
  if (!req.headers['x-auth']) {
    return res.status(401).send("Can not find user");
  }
  //Bezieht das Objekt zur Kodierung der useremail zwecks Suche in der Datenbank.
  var auth = jwt.decode(req.headers['x-auth'], config.secret);
  //Verwende das dekodierte Sessiontoken um den aktuellen user in der Datenbank zu finden.  
  User.findOne({useremail: auth.useremail}, function (err, user) 
  {
  	 //Falls kein User gefunden wurde, sende den Fehlerstatus, user ist nicht zu finden. 
     if (err) {
     console.log(err);
     return res.status(401).send("Can not find user");
     }
     //console.log("der user json:"+user);
     //console.log("my username: "+user.username);
     //console.log("my useremail: "+user.useremail);
     //console.log("my dashboards: "+user.userdashboards);
     //Schicke den user an den Client
     return res.json(user);
  });
};

//Poste einen user über die post Route des user.server.controllers
exports.post =  function (req, res, next) {
//Erstelle einen neuen user unter Verwendung des user Datenbanken Schemas. Ein user hat die Parameter
//username (Benutzer Name), useremail (Benutzer Email), userrights (Benutzer Rechte), userdashboards (Benutzer Dashboards),
//mmdbAcess (management Dashboard Zugriffsrechte), mmdbStartDate (management Dashboard Startdatum), 
//mmdbEndDate (management Dashboard Enddatum).
var user = new User({username: req.body.username, useremail: req.body.useremail, userrights: req.body.userrights, 
	userdashboards:req.body.userdashboards,  mmdbAccess:req.body.mmdbAccess, 
	mmdbStartDate: req.body.mmdbStartDate, mmdbEndDate: req.body.mmdbEndDate})
	//Kodiere das Benutzer Passwort mit einer Hashfunktion.
	bcrypt.hash(req.body.password, 10, function (err, hash) {
		//Wenn das kodierte passwort aus dem userpasswort (Login) nicht 
		//erzeugt werden konnte, dann lege einen neuen Benutzer an.
	    if (err) { return res.status(401).send("Can not encode user password"); }
	    //Speichere als user passwort das erzeugt Hashpasswort.
	    user.password = hash;
	    //Speichere den neu angelegten Benutzer.
	    user.save(function (err, updatedUser) {
	    	//Antworte mit einem Fehlerstatus, falls der neue Benutzer nicht gespeichert werden konnte.  
	        if (err) {
	      	    console.log(err); 
	      	    return res.status(401).send("Can not save new user");
	        }
	        //Sende den Erfolgsstatus 200 zurück.
	        return res.sendStatus(200);
	    });
	});
};

































/*
exports.post =  function (req, res, next) {
  var user = new User({username: req.body.username})
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    if (err) { return next(err) }
    user.password = hash
    user.save(function (err) {
      if (err) { return next(err) }
      res.sendStatus(201)
    })
  })
}
*/

/*
var User = require('../models/user.server.model.js'),
	passport = require('passport');
	
//functions for the user
	
var getErrorMessage = function(err) {
  var message = '';
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Username already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }
  return message;
};

exports.renderSignin = function(req, res, next) {
  if (!req.user) {
    res.render('signin', {
      title: 'Sign-in Form',
      messages: req.flash('error') || req.flash('info')
    });
  } else {
    return res.redirect('/');
  }
};

exports.renderSignup = function(req, res, next) {
  if (!req.user) {
    res.render('signup', {
      title: 'Sign-up Form',
      messages: req.flash('error')
    });
  } else {
    return res.redirect('/');
  }
};

exports.signup = function(req, res, next) {
  if (!req.user) {
    var user = new User(req.body);
    var message = null;
    user.provider = 'local';
    user.save(function(err) {
      if (err) {
        var message = getErrorMessage(err);
        req.flash('error', message);
        return res.redirect('/signup');
      }
      req.login(user, function(err) {
        if (err) return next(err);
        return res.redirect('/');
      });
    });
  } else {
    return res.redirect('/');
  }
};

exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

exports.create = function(req, res, next) {
   var user = new User(req.body);
    user.save(function(err) {
    if (err) {
      return next(err);
    } else {
      res.json(user);
    }
  });
};

exports.list = function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) {
      return next(err);
    } else {
      res.json(users);
    }
  });
};

exports.read = function(req, res) {
  res.json(req.user);
};

exports.userByID = function(req, res, next, id) {
  User.findOne({
    _id: id
  }, function(err, user) {
    if (err) {
      return next(err);
    } else {
      req.user = user;
      next();
    }
  });
};

exports.update = function(req, res, next) {
  User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
    if (err) {
      return next(err);
    } else {
      res.json(user);
    }
  });
};

exports.delete = function(req, res, next) {
  req.user.remove(function(err) {
    if (err) {
      return next(err);
          } else {
      res.json(req.user);
    }
  })
};
*/








