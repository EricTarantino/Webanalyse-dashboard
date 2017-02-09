/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------
process.env.NODE_ENV = 'development';

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('./config/express'),
	mongooseConnector = require('./config/mongoose.js'),
	mongoDBDriver = require('./config/mongoDB.js');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

module.exports = app; 



	/////////////////////////////////////////////////////////////////////////////
	//  Sonntag
	//		Aktuelles Dashboard mit x-Achse
	//		Manuels FrontEnd
	//		Auswahl aus Leveln soll möglich sein, level sind in total, all, country
	//		Zweiten Space auswählen
	//		Wenn loader visibility in app.js invisible ist, dann starte mit Loader invisible
	//		Login Load Dashboard
	//  	Load graphs at beginning
	//		Management Board Gesamt
	//		Manuels Frontend in Bluemix
	//		Mehrere Brands in einem Graph erlauben (Space)
	//		Für jeden Space ein Level
	//		Speichere Auswahl in der Database im Graph
	//		Mehrere Request
	//		Adde Dataseries
	//  	Löschen der Graphen in der Database
	// 		Drag n Drop
	//		Annotation
	//		Timeline
	//  	Minimum Data is one day
	//  	Code cleaning
	//		Promises, Oboe.js streaming, JSON.stream, Geschwindigkeit
	//
    ///////////////////////////////////////////////////////////////////////////////
    //
    //	TODO Jira, Dokumetation
    //  TODO Promises, Oboe.js streaming (JSON.stream()), Geschwindigkeit
    //  TODO Increase page spead with Grunt: https://www.sitepoint.com/5-minutes-to-min-safe-angular-code-with-grunt/
	//	TODO Annotation, Timeline, Share Dashboards
	//	TODO Handle streams with oboe.js
	//	TODO Error Search
	//  TODO Von bis im analytics dashboard (date picker for every graph)
	//  TODO Security control
	//  TODO Date restrictions
	//	TODO Finishing, positioning
	//	TODO Responsive
	//	TODO Error search
	//  TODO Clean code, remove code duplication
	//  TODO extract css stylesheets, check name consistency documentation
    //	TODO Graph editing (edit name, update dates, ... )
    //	TODO Share graphs
	//	TODO More Graph choices
	//	TODO Frontend Finishing, exclude style sheets
	//  TODO res status uniformity
	//  TODO Dokumentation
	//  TODO Finishing, error search, Frontend, Documentation, Validations
	//	TODO error feedback if name is used already
	//	TODO Same to google analytics
	//	TODO make request to google analytics
	//	TODO google search console
	//	TODO Querries, google analytics, search console
	//	TODO Check different sources possibilites, how is the company set up
	//	TODO Build Averages and other calculations over the graph like date and so on
	//	TODO Frontend Dashboards and functionality
	//	TODO More Graphs
	//	TODO Kommentare: Comments: https://sroze.github.io/ngInfiniteScroll/index.html
	//	TODO Documentation
	//	
	/////////////////////////////////////////////////////////////////////////////
	//
	//	TODO Social Media, Facebook, Twitter Source
	//	TODO Watson with predictive analytics
	//	TODO Search
	//	TODO Script injection mit gulp
	//	TODO Promises (node.js way)
	//	TODO Multilanguage
	//  TODO Optional (Check nejo4 graphdatabase/ Hadoop)
	// 	TODO Promises, Script Injection für die Bibliotheken, Security
	//	TODO Streaming, Graphdatabase nejo4, Social Media
	//  TODO Hadoop
	//
	/////////////////////////////////////////////////////////////////////////////
	//
	//  TODO Code Fragments:	//
	//	TODO Datepicker example is adopted from https://plnkr.co/edit/eV2Kmt?p=preview
	//
	/////////////////////////////////////////////////////////////////////////////
	
	
    /////////////////////////////////////////////////////////////////////////////
    //
    //	Databases
    //
    //	Users: 			18_15_pm
    //	Graphdata: 		graph
    //	Webtrendsdata:	amigo
    //
    /////////////////////////////////////////////////////////////////////////////