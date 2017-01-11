/*eslint-env node*/

var express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

module.exports = function() {

	var app = express();

	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(bodyParser.json());
	app.use(methodOverride());

	app.use(require('../app/routes/index.server.routes.js'));

	//redirect to default in case of invalid route
	app.get('*', function(req, res) {
		res.redirect('/');
	});

	//set the views folder
	app.set('views', './public/views');
	app.set('view engine', 'ejs');

	/*old code
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));
   
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    
    //add the index routing
    
    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/users.server.routes.js')(app);
    require('../app/routes/posts.server.routes.js')(app);
    
    // serve the files out of ./public as our main files
    app.use(express.static('./public'));    
    */

	return app;

};
