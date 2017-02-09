/*eslint-env node*/

//Beziehe ein jwt objekt um sessions zu autorisieren.
var jwt    = require('jwt-simple')

//Beziehe mongoose zur Verwendung des mongoose Datenbank Connectors.
var mongoose = require( 'mongoose' );

//Beziehe das client secret um sessions zu autorisieren.
var config = require('../../config/config.js')

//Das Benutzer model wird bereit gestellt. 
//Wird benötigt um ein neues Dashbaord in der User Variable zu speichern.
var User = mongoose.model('User');

//Das Graph model wird bereit gestellt. 
//Dieses wird benötigt um alle Graphen zu einem Dashboard mittels Get request aus der Datenbank zu erhalten.
//Wird auch benötigt um Graphen zu löschen mittels delete request. 
var Graph = mongoose.model('Graph');
    
//Exportiert die get request Funktion für ein Dashboard.
exports.get = function (req, res, next) {
  //Prüft ob die notwendigen header vorliegen.
  if (!req.headers['x-auth']) {
    return res.status(401).send("authorization failed");
  }
  //Bezieht das Dashboard aus dem Dashboard-Name-Parameter  .
  var dashboard = req.get('dashboardname');
  //Bezieht das Objekt zur kodierung der useremail zwecks Suche in der Datenbank.
  var auth = jwt.decode(req.headers['x-auth'], config.secret);
  //Finde alle Graphen für einen Key - Benutzeremail und Dashboard Kombination.
  Graph.find({useremail: auth.useremail, dashboard: dashboard}, function (err, dashboard) {
    if (err) {
      console.log(err);
      return res.status(401).send("Can not find graph in dashboard server");
      }
	 console.log(dashboard);
     //Beantworte das request mit einer json, welche die Graphen enthält.
     res.json(dashboard);
  });
};

//TODO make model for dashboard, save dashboards name, graphname string array and kategorie and useremail string array

//Jedes dashboard wird in der Benutzer Datenbank gespeichert. Ein Benutzer hat Dashboards.
exports.post =  function (req, res) {
	//Prüfe ob die notwendigen header vorliegen.
	if (!req.headers['x-auth']) {
    	return res.status(401).send("Authorzation failed");
 	}
	//Aus dem request wird der gewählte Dashboard Name gelesen.
	var userNewDBName =  req.body.selectedNameDB;
  	//console.log("post dashboard");
  	//Dekodiere die session information im header.
  	var auth = jwt.decode(req.headers['x-auth'], config.secret);
  	//Finde den user mit der kodierten useremail. 
  	User.findOne({useremail: auth.useremail}, function (err, user) {    	
    	//Wenn kein user gefunden wurde, dann sende 402 zurück.
    	if (err) {
      		console.log("user server controller"+err);
      		return res.sendStatus(402);
      	}
      	//Greife auf die userdashboards zu.
      	var userdashboards = user.userdashboards;
      	//Füge das neue dashboards zu dem userdashboard array hinzu.
      	userdashboards.push(userNewDBName);
      	//Speichere für den user das userdashbaord.
      	user.userdashboards = userdashboards;
		//Speichere den user in der datenbank ab.
		user.save(function (err, user ) {
    		if (err){
    			console.log("user server controller"+err);
      			return res.sendStatus(406);
    		}
    		//console.log("der user json:" + user);
     		//console.log("my username: " + user.username);
     		//console.log("my useremail: " + user.useremail);
     		//console.log("my dashboards: " + user.userdashboards );
     		
     		/*Response status 201 means content was created specified in 
     		https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html
     		the result is not being sended in the post response, but should
     		be requested in a get resonse. The result is an updated user,
     		but the local user dashboard is already updated clientside.
     		The clientside takes care of an error response.*/
     		
     		//Send back the success status.
    		return res.status(201);       
  		})
  	});
}

//TODO also delete all graphs 
exports.delete =  function (req, res) {
	//console.log("query param: "+req.query._db)
	//Prüfe ob die notwendigen header vorliegen.
	if (!req.headers['x-auth']) {
    	return res.status(401).send('Authorization missing');
  	}
  	/*id is the name of the dashboard that should be deleted,
  	 *userdashboards in the user database need modification
     *(could this be done with put User (REST Application)?),
	 *and all graphs that belong to this dashboard need to be deleted
	 *from the graph database*/
	//Dekodiere die session information im header.
    var auth = jwt.decode(req.headers['x-auth'], config.secret);
    //Finde den user mit der kodierten useremail. 
    User.findOne({useremail: auth.useremail}, function (err, user) {
	   //Wenn kein user gefunden wurde, dann sende 402 zurück. 	
	   if (err) {
	   		console.log("user server controller"+err);
	   		return res.status(402).send('Authorization failed');
	   	}
    	//Lese die information aus der Query, welches Dashboard gelöscht werden soll.
    	//An dieser Stelle wird eine Query verwendet, und kein json aus dem body des
    	//request gelesen, weil es sich um ein delete request handelt. 
	    var id = req.query._db;
	  	//Lösche alle Graphen die zu dem Dashboard gehören, das geschieht 
	  	//mit zwei von drei key parametern: useremail und dashboard name.
	  	Graph.remove({ dashboard: id }, function (err) {
	  		//wenn ein Fehler beim Löschen vorkommt, sende status 401 zurück.
	  		if (err){
	  			res.status(401).send('Delete graphs for dashboard failed');
	  		}
	      	console.log("delete id: " + id); 
	  		//Nachdem alle Graphen mit der Dashboard Zugehörigkeit gelöscht wurden, lösche das dashboard aus 
	  		//dem Dashboard array des users. Dies ist das eigentliche Löschen des Dashboards.
	  		var index = user.userdashboards.indexOf(id)
	  		if (index >= 0) {
	  			user.userdashboards.splice( index, 1 );
	  		}
	  		//Benachrichtige mongoose über die Veränderung bei dem user.
	  		user.markModified("userdashboards");
			
	  		/*long version without mark modified but with a helper variable: 
	  		var arr = user.userdashboards; var index = arr.indexOf(id); if (index >= 0) {arr.splice( index, 1 )};user.userdashboards = arr;*/	
		  	
		  	//Speichere den user wieder in der Datenbank mit den Veränderungen.
			user.save(function ( err, user ) {
				//Wenn das Speichern des updates an dem Benutzer fehlschlägt
	    		if (err){
	    			console.log( "user server controller" + err );
		   			return res.status(401).send("Updating list of dashboards failed");
		   		}
		   		//console.log( "der user json:" + user );
		   		//console.log( "my dashboards : " + user.userdashboards );
		     		
		   		/*var jsonResult = JSON.parse( JSON.stringify( user ) )*/
		   		
		   		//send status: ok
		   		return res.status(200)
	  		})
	  	});  	
  	});
}

/*
exports.post =  function (req, res, next) {
  var user = new User({username: req.body.username, useremail: req.body.useremail, userrights: req.body.userrights, userdashboards:req.body.userdashboards})
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    if (err) { return next(err) }
    user.password = hash
    user.save(function (err, updatedUser) {
      if (err) {
      	console.log(err); 
      	return next(err);
      }
      res.send(updatedUser);
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
//console.log("found user: "+user)
//console.log("new db for : "+userNewDBName);
*/








