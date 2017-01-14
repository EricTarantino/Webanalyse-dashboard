/*eslint-env node */
/* First run of this script requires user to authenticate and allow access to the 
 * asked 'scopes' in this script (which user calls as 'user-consent'). On successful
 * granting of these scopes, the scripts downloads a 'drive-nodejs-quickstart.json' to
 * the home directory of local machine, which I have copied into the local project dir and 
 * renamed into 'webmasters-nodejs-auth.json'. 
 * Cheers!
 */

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var bcrypt = require('bcrypt'); // require('bcrypt')
var jwt = require('jwt-simple');
var mongoose = require('mongoose'),
	Webtrends = mongoose.model('Webtrends'),
	Webtrends = mongoose.model('Dummydata');
var streamToMongoDB = require("stream-to-mongo-db").streamToMongoDB;
var JSONStream = require("JSONStream");
var config = require('../../config/config.js');
var request = require('request');
const https = require('https');
var extend = require('util')._extend;
var dataTranformation = require('../modules/datatransformation.server.module.js');

//this was created in a singleton on app start, directly access mongo
var mongoDB = require('../../config/mongoDB.js')


// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
var SCOPES = [
	'https://www.googleapis.com/auth/webmasters'
];
// var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
// 	process.env.USERPROFILE) + '/.credentials/';
// var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

// store the ~/.credentials/drive-nodejs-quickstart.json locally into this folder
var TOKEN_PATH = './app/controllers/webmasters-nodejs-auth.json';


/* 
 *
 */
exports.getGoogSearchConData = function(startdate, enddate, graph, responseObject) {
	// Load client secrets from a local file. 
	// This file is downloaded from google search console API developers page, from 
	// Manuel's account.
	fs.readFile('./app/controllers/client_secret.json', function processClientSecrets(err, content) {
		if (err) {
			console.log('Error loading client secret file: ' + err);
			return;
		}
		// Authorize a client with the loaded credentials, then call the webmaster API.

		// var mySites = authorize(JSON.parse(content), listSites);
		// var myQueryData = authorize(JSON.parse(content), mySites.siteEntry[0].siteUrl, getSitesQuery);

		authorize(JSON.parse(content), getSitesQuery, startdate, enddate, graph, responseObject);
	});
}


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, startdate, enddate, graph, responseObject) {
	var clientSecret = credentials.installed.client_secret;
	var clientId = credentials.installed.client_id;
	var redirectUrl = credentials.installed.redirect_uris[0];
	var auth = new googleAuth();
	var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, function(err, token) {
		if (err) {
			getNewToken(oauth2Client, callback, startdate, enddate, responseObject);
		} else {
			oauth2Client.credentials = JSON.parse(token);
			callback(oauth2Client, null, startdate, enddate, responseObject);
		}
	});
}

/*
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */

function getNewToken(oauth2Client, callback, startdate, enddate, responseObject) {
	var authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES
	});
	console.log('Authorize this app by visiting this url: ', authUrl);
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	rl.question('Enter the code from that page here: ', function(code) {
		rl.close();
		oauth2Client.getToken(code, function(err, token) {
			if (err) {
				console.log('Error while trying to retrieve access token', err);
				return;
			}
			oauth2Client.credentials = token;
			storeToken(token);
			callback(oauth2Client, null, startdate, enddate, responseObject);
		});
	});
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
	try {
		fs.mkdirSync(TOKEN_DIR);
	} catch (err) {
		if (err.code != 'EEXIST') {
			throw err;
		}
	}
	fs.writeFile(TOKEN_PATH, JSON.stringify(token));
	console.log('Token stored to ' + TOKEN_PATH);
}


/**
 * Lists sites.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listSites(auth) {
	var service = google.webmasters('v3');
	service.sites.list({
		auth: auth
	}, function(err, response) {
		if (err) {
			console.log('The API returned an error: ' + err);
			return;
		}
		console.log("webmasters response : ");
		console.log(response);
		return response;
	});
}


/**
 * Get sites search query data.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getSitesQuery(auth, website, startdate, enddate, responseObject) {
	// assign defaults
	website = website || "http://www.bosch-pt.de/";
	startdate = startdate || "2016-12-22";
	enddate = enddate || "2016-12-29";
	
	startdate =  "2016-12-22";
	enddate =  "2016-12-29";
	website = "http://www.bosch-pt.de/";

	// google service
	var service = google.webmasters('v3');
	// get data from search analytics
	var params = {
		auth: auth,
		siteUrl: encodeURIComponent(website),
		resource: {
			startDate: startdate,
			endDate: enddate,
			dimensions: ['query', 'page', 'country', 'device'] // these columns will be returned from the google API
		}
	};
	// console.log(service.sites.list.toString());
	// console.log(service.searchanalytics.query.toString());
	service.searchanalytics.query(params, function(err, response) {
		if (err) return console.log(err);

		console.log("response received from google webmasters API.");

		var db = mongoDB.getMongoDB();
	
		var collection = db.collection('webtrends');
		
		collection.drop();
		
		collection.save(response, function(err, result){
			
			if(err){
				console.log("could not save from search console");
				responseObject.status(400).send("error saving from search console");
			}
			
			if(!err){
				responseObject.status(207).send("successfully loaded into search console mongo");
			}
		});

		
		
		/*
		// create the writable stream 
		var writableStream = streamToMongoDB(outputDBConfig);
		
		response.pipe(JSONStream.parse('*')).pipe(writableStream);

		//This works -> writes single profiles to database  		
		response.on('end', function() {
			//console.log("sending data to data transformation//");
			//dataTranformation.transformDatas(graph, responseObject);
			return responseObject.status(200).send("succesfully loaded into search console mongo");
		}).then(console.log("end of stream"));
		*/
			
	})
}




// // /*eslint-env node*/

// var google = require('googleapis');
// var OAuth2 = google.auth.OAuth2;

// // var googCreds = {
// // 	"type": "service_account",
// // 	"project_id": "boschdashboard",
// // 	"private_key_id": "1d1f78bb21a58740676fc1a68e7a4c43b1a00050",
// // 	"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDGixOBHmKqKzim\nUmBkRkggv9Y0MUwYJffonTUQHX4gC8TM7PqUa3W88kzPfFAU8FIL64sF6C8p0XHa\nslyp9wk2gcn7qFrYs/MvD76EsupNlarE6as5Vms3nG5sp+NkX6fegzyKjyEdBE2C\nlAwIg8pMxwnM3b1sr53Di1fijDtDLLwreZqjJE6fWUnoS43ZmNXEPldMtFvcGuJI\nfaHc9PpDE5Qp7fIbGsRpNY+CWXbwI8nr917Wqto56DBDmHDLRerjVGi9gjVJC7dy\n/bCdkUgONaqwilMrqAegiEocs+yGmtD9YwVyTw9yVi3DY17GFYXNc6k84Qx3tGmq\n+I9Lz4u9AgMBAAECggEAR2MCJE7UkvLvb333ApbyoDPZxPJktdoRBSZhSeYQz1zr\n6fLbNjpdHw7P51p/QMgX+Ak892bAbnzMPyIah1I3kc2g3kduQrSRH769deEOtc62\nlA6gbgFQk7I/UfobnJ94MF1nizpjYZeGdwjcOsOIHYsDTxH7ZfTO+NxFQUPCmyf7\nkDzo6KI73VwcxfLtj923gy75oZHxEXjn/1tx7+2eWdy3Gpr7/ZZL12qvAUw4ta+X\ncjfy1nrQ2LR5xZc3cchFn65l+ryfh9D2IF9G6fOmVYgKSc/ALaso6SX3zLeCf573\ncixUMFH8DS5MjF0/ilwz2c7BATU46pkOEZRSu3rnUQKBgQD6Jsa817Ajb506x2wM\nuUJRYmgQEzbb9HbTYpSY8Qt0RuIv3ePaovYuuZM00z0l+U5v2VGxaiAwd6rRupsZ\n8MWZvZjZEPWna/36IrdEEHFteCEZi2rAV/X54lAqkO7bCCW10BnjQS3BphJ1EZdG\n3l8OSAf9/fNyQnlBWe5w36uehwKBgQDLL2kyIFU492ps4mLrx95/gVvwvbA6S2UH\n5hcVkvZck7wMvYYslTCxhdhuSG6k0FP4foMIDA0VDp8IHzTojRDFhfzblFvyEYsW\n3LXEMFx41zH9HQSyL9RmQoMIAc3a4Qsgd1ZcrUK3taROPdY4PaDYXO9EV5ZGpM4T\nTHNdvXjwmwKBgES+Rzs6IsN6NsEicIUGnDz1SBey0A6eHdF1c9Sb2UP4/suctLMu\nuWyZvuRzcIhw/KcsF5Ej0vi+ygicuWbljcf0HH76dCewO7lztN1Vj3Y/3wjAEXQO\nOCCVmuY3sgwrLwHJ0HNtQ//FfakCTopBLeokzV11XmN19RCKgEYwkV8dAoGACiwQ\ndyr5OUXhtRvMWgOClx2RzcahWPnHUBLr2u+ll9LpmjWuzvKVIn4R7MuBhozLd2hW\nBQQdb41w1sZBLtdJHKptk0ylIcRRE07vZqgJKR+U6BgY0Rbl6kywJKl6ddfIZ9Kx\npygha/MTC7u6yswDDnHwpJpB8r1zd7HfILVIpbsCgYEAgjNvTJD7Jwdv8uVqyf4I\nXLreSsKCN4Ep4yPHNJaj1wq7qBQPcwsfBS+5taxNKqIQnyIELPTbTUSCbTlHEoc0\n1SZ0sQiP1i3sMLytUgHGlovtMRoVc7FqheniCy4Xz7RYrIt/L75cbPt7niZsMDkg\nn2nFaM/SE7LR9+aYreKiGkE=\n-----END PRIVATE KEY-----\n",
// // 	"client_email": "bluetrade@boschdashboard.iam.gserviceaccount.com",
// // 	"client_id": "104804905754467253423",
// // 	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
// // 	"token_uri": "https://accounts.google.com/o/oauth2/token",
// // 	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
// // 	"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/bluetrade%40boschdashboard.iam.gserviceaccount.com"
// // };
// var googCreds = {
// 	"type": "service_account",
// 	"project_id": "boschdashboard3",
// 	"private_key_id": "a66524a10c48df63d0202fd0b50ca14fbd9c625f",
// 	"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyDEIYf5cT0gmt\nrCCdvXIBLddVZRLLQVF3mJlTRhhS4lyiaPVZZGzkqJnOAtnWPy2gjvhCuj3S+CwM\nItIx9dg2d1khPXtUHRXdL6jrQkBCeRJJezDIdvKJa3feKFbP0wJKFtVBFAKKH1xz\nXmDcTe+BPv3tWy7HFVO4bX6olJy1i5WuwHxNQ/imf0YTurxRqu0JwNkbsTau5KXw\ngS/x2idQdaCTbyAqp0Lt2WIqHIoqIJBL9Mh97iG5HKpHt76+sD737ZCkWfXwLQAo\nL+aXlh0tsIWvN60FscUjZ0Xsqo119eeGUrOb7nArtiZcV0VfuWCGWzbKzNwYyQX5\nTdmvkU2TAgMBAAECggEAKcGqNqilu+ZEktCNjbECbbhcihB8SeL1wkCtpNQJnFau\nNwC6mc5to2rPN3t/rzl97+vX2X5oRXQikG4SMdlgbdWrt5n9tIpluEwXJ6WQAIb4\nfPdBR6Jt20CzCg0X3wGzxcB5HxwcRFx6iCwYN1Kn2v30+5eo7tPXoKc9TzgbUJAZ\n0evXuLl9+2Pi92XFkKi1PNxhqE4oPsY/Qf6/+ow+TpK2keLurSCuDkusK3VzXhOm\nq2cgLUGU6A9c3qDvZnFws7n1wEWGOcafobO/TZwl+3dV8YCkqauWdZ1Q8ICTt0wI\nfDh5KZxVb2IUbPfj+VQXz4knI4W44nV0IZxb5S4JIQKBgQDYmD8K3IxmQ54a9RAU\nDRvVS99hyz7bIh6xRxTQW6b4empxj8uKcFGWCJq/NZ5908BhkHC22E13nyCmFa4X\ncGfEWfm4kEsmpJMG8BsGHRKRmUcNsmcuOm/zJBzKog3Fj/8s0BZSK9zjWR1nerKj\ngGngfNkaN2KtVmF9krVNtbtlewKBgQDScLgdDW2bsuV1ruTNq2u3rZkBLgFsBg2C\nMu8FqC886dBWFCt8rS/yZpCkXlz0ujGZtkGNdcNFxdWxSG0nqnnLYNkR+FrJC1zK\nNf5GWzXE8uUqKFfN7+3W6Ea90V234KNamoEt78KvGuQZicuGTaM6BbHWArHUSC2p\nIN3PVvngyQKBgQCauSdPuv0QkH0BBM7XhAW9+NU6JtZf85+5Q+26ab59AfXH6dCc\ntF+TrdHdhZASkpF7IJNkCmBMc3//JL2YQNPfj+az0V/d2vKsohir5Vi+aaA4SJks\njNIr/kATAHCWEKdYe812JZ9FSQOYSC4UXkdD9eugrq/u4yYBbivVt1yGwQKBgQCm\nd/p9KPky+KKhpJdkxxzv8QifMUh4rpUTEL2aCQBNPFzNKyl3d/z80PvMusTn5z6D\nbPSQNb8iO6yekD+g6C9ung85MvCGJ1HguDOMbmyrfsWfwsgqpYjMv3PuhmePpMk0\nTBKyRv8Hy8rzFNkGRfZAWO7j77/CwNI1/0TX1uLWWQKBgEmZzpMyfPQ8qSamkJAs\nM5+z3fZqblRob7k8pihByaMx5L2P0NBhUs7WNWCr8nOReuh6Q55iW1L34pZNWP4c\n0h3hfUgzKT13Rh5DUZtNd6HiJvgKM3DDXw62Tsn8l4meWHkvtM4Kq6Hh6/AjuF5t\n+tlnb+TbEPSTvkasnz6BQx3d\n-----END PRIVATE KEY-----\n",
// 	"client_email": "318598080318-compute@developer.gserviceaccount.com",
// 	"client_id": "115545375531179356282",
// 	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
// 	"token_uri": "https://accounts.google.com/o/oauth2/token",
// 	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
// 	"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/318598080318-compute%40developer.gserviceaccount.com"
// };



// var scopes = [
// 	"https://www.googleapis.com/auth/webmasters",
// 	"https://www.googleapis.com/auth/drive",
// 	"https://www.googleapis.com/auth/drive.appdata",
// 	"https://www.googleapis.com/auth/drive.file",
// 	"https://www.googleapis.com/auth/drive.metadata",
// 	"https://www.googleapis.com/auth/drive.metadata.readonly",
// 	// "https://www.googleapis.com/auth/drive.photos.readonly",
// 	"https://www.googleapis.com/auth/drive.readonly" //,

// 	// "https://www.googleapis.com/auth/drive.appfolder",
// 	// "https://www.googleapis.com/auth/drive.file",
// 	// "https://www.googleapis.com/auth/drive.install",

// ];

// var key = googCreds; // require('/path/to/key.json');
// var jwtClient = new google.auth.JWT(
// 	key.client_email,
// 	null,
// 	key.private_key,
// 	scopes, // [scope1, scope2],
// 	null
// );

// // console.log(jwtClient);

// var webmasters = google.webmasters('v3');
// // for (property in webmasters) {
// // 	console.log(property);
// // }

// var drive = google.drive('v3');
// for (property in drive) {
// 	console.log(property);
// }


// jwtClient.authorize(function(err, tokens) {
// 	if (err) {
// 		console.log(err);
// 		return;
// 	}

// 	// console.log(tokens);
// 	// console.log(jwtClient);

// 	// get a list of tracked websites
// 	var param1 = {
// 		auth: jwtClient,
// 		'content-type': 'application/json'
// 	};
// 	webmasters.sites.list(param1, function(err, resp) {
// 		if (err) return console.log(err);

// 		console.log("resp1 is: ");
// 		console.log(resp); // should contain "http://www.bosch-pt.de/"
// 	});


// 	// get data from search analytics
// 	var param2 = {
// 		auth: jwtClient,
// 		siteUrl: "http://www.bosch-pt.de/",
// 		// path: '',
// 		startDate: "2016-12-22",
// 		endDate: "2016-12-29",
// 		'content-type': 'application/json'
// 	};
// 	webmasters.searchanalytics.query(param2, function(err, resp) {
// 		if (err) return console.log(err);

// 		console.log("resp2 is: ");
// 		console.log(resp);
// 	});

// 	// Make an authorized request to list Drive files.
// 	drive.files.list({
// 		auth: jwtClient
// 	}, function(err, resp) {
// 		// handle err and response
// 		console.log('err : ');
// 		console.log(err);
// 		console.log('resp : ');
// 		console.log(resp);
// 	});


// 	//// in a data stream way
// 	// var data = [];

// 	// sites.on('data', function(chunk) {
// 	// 	data.push(chunk);
// 	// });
// 	// sites.on('end', function() {
// 	// 	console.log(data);
// 	// 	var buff = new Buffer(data.join('')).toString();

// 	// 	console.log('////////////////////////// Success //////////////////////////\n')
// 	// 	console.log(buff);

// 	// });

// 	// sites.on('error', function(e) {
// 	// 	console.log(e);
// 	// });

// 	// console.log(JSON.stringify(sites.toJSON(), null, 3));

// 	// sites.readResponseBody();
// });
