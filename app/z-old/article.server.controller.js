/*eslint-env node*/
//verbinde mit der datenbank
//definiere ein JSON object mit Null oder ein Schema, dass gespeichert wird
/*
//error message
var getErrorMessage = function(err) {
  if (err.errors) {
    for (var errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName]. 
        message;
    }
  } else {
    return 'Unknown server error';
  }
};


//user sollte in models als datentyp definiert sein
//create article from the req.body and save it to the database
//req.user wird als password verwendet.
exports.create = function(req, res) {
   
  var article = new Article(req.body);
  article.creator = req.user;
  article.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};


//get all the users mit couch express cloudant find()
exports.list = function(req, res) {
  Article.find().sort('-created').populate('creator', 'firstName    
    lastName fullName').exec(function(err, articles) {
    if (err) {
    	      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
};

//finde einen user über die ID, das ist eine middelware vor read
exports.articleByID = function(req, res, next, id) {
  Article.findById(id).populate('creator', 'firstName lastName  
    fullName').exec(function(err, article) {
    if (err) return next(err);
    if (!article) return next(new Error('Failed to load article '  
      + id));
    req.article = article;
    next();
  });
};

exports.read = function(req, res) {
  res.json(req.article);
};
  
//update eines users
exports.update = function(req, res) {
  var article = req.article;
  article.title = req.body.title;
    article.content = req.body.content;
  article.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

//löschen eines users
exports.delete = function(req, res) {
  var article = req.article;
  article.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};    	
*/
    	
    	
    	
    	
    	