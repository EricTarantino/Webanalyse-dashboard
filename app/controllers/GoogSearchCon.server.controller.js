//The file: GoogSearchCon.server.controller.js
/*eslint-env node*/

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var googCreds = {
	"type": "service_account",
	"project_id": "boschdashboard3",
	"private_key_id": "06ad9837fd74287050ea514ab34244d269204819",
	"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2N4yWM+U9rbxU\niP22ckHx0pZXbVmLoCDY/Nl5Xo/OrS7gYmo1hWyOPgxzVEX8RjpL5QcHzKBdMfoN\n5ijEAmBPltywDXflOGvqLebBn4usTX/FoQ0wjHIsHQ5s6jwf71r2oGlNgQuvvGZq\nYZqZ+yX/UzevF1l1oQdDkUf8WmuGEUh3rpNE/03BBY1TFbrNShaabuOWKWx9x8u6\nSe6f4iC2d6D9Y/mXEf0yPSMkr96K7+3PopjaTKCTNcJZsrvz5pGoA+6myri0R30L\nT19DBL64+xMY2umUZ01+0ZzY8vFEgNcW7wcB7Na5IAynhHL4M8zCtvCqshgJQBIp\nWNEPbOo/AgMBAAECggEAFmmcvDjj4INHH+q9sjw5ikIJxfUoR3lJsQbgxQHxlE1O\n78CLKcwgfxp4s5LRDOeicgVYqQftTalBBYaiywEz0XZP7MOrVKFs/J/quzQhnO7n\nYWqe0bLktDJavODOxmrNeHpgmWzfAB2fR0R8HKZ8lPwqZDnuAf7tgs0S2qJQiWvP\nk3oBbr4Ht0Pyzqnr6mE0d8RTns82Z7f+uVf5Yxcg73QL/Dpgks0YundBPwISdawr\nFiMmGMejQET09ebQm+AC6oFfMJ1o2aIXfxNyTbF8JtbblNUlghg4rjAm3lh8afo0\nih/Jkl/AlONhnwtrYXO2SMrd6mCyiBhKZEC6B03nyQKBgQDklau+FJM53UiBoSph\nmrMs4F/9FR0WGksw3KHaUTiXyZy2TR0Ux0zKDakF63ZJsk99TS4fGRzYEbDGdhph\n8qkt8hH6thrlzhA/1XfDgKMrPQIw0xJuaVcz8IpMwZA8nXP4w+MZgjsq5JZRzQbs\nwOBjaGMoWsamzeSujEb3TGRe4wKBgQDMEjuWQMtmc1usf05RuZaZqoj/PTf/Z/Ou\nzIx1Y5MEij9ieG9kL8jmDHmS4MTrhX8Z9bJdPQTYe6tfM0hefheKcFrDckWD+sv0\n/Na1CLtD44jD7AMop1cFsbGi5mdZloxcG1U8B+Sk2tvnLIUBcM35MypAooi95uMC\n7Oe7FTFp9QKBgGb4DR9ZAWElj03lncPN/jyO7m6BHlMgkRJ3sOk5gTbO+Ssd3aXI\niYzTTnp+MRDNpAUbyVT06QtkHK+p8ASDXTZ3PyYi9kbi5mr67DJDNj16BAyeaEUY\natHY31PoNeM4Qk+jXh/VjHWr9xLuOtpXoDznfxNkoOvu/76pLiakYOplAoGBAJnS\nxIeln6xCGEAWVfrUYejC2zFJ/APRX6XLGbUCsbciXlTjY1OpkU2W6a0FMGo33m66\n/Q+7BwQHdE32Yf6YHTaFKmVYpX2udj7ctxsO0dmCkXzdUiQ6vyXTo4qfEhg9mt9y\n2vS9HmQFdOz0ae2EEj5diuPdoCVE/Kkf2izy9KRhAoGATz1KuBqvmlAQLo7TPx+h\nH/1Qea0Qvi8rlkgxFKToai2ivvN/Oy9N6pEhIApbnr8KFX45Iw8afCUqhAnOMaxz\nWpTFLB/z3yzI4NaI0Ie1I48EgI0YCRp6n81WQ1oWFua55tdbJHEPaIb+lPryAEcz\ncu+Pu/llreUaKcAbTn6vwM0=\n-----END PRIVATE KEY-----\n",
	"client_email": "318598080318-compute@developer.gserviceaccount.com",
	"client_id": "115545375531179356282",
	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
	"token_uri": "https://accounts.google.com/o/oauth2/token",
	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
	"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/318598080318-compute%40developer.gserviceaccount.com"
};

/*
//client id 1044766240397-jii8m7glmmaarmdp6lahm6fqnq0rp7fb.apps.googleusercontent.com
//client schlüssel a-DoxUdUZ-BGwDuL4frPD9Bn
{"web":

{	
		"client_id":"1044766240397-jii8m7glmmaarmdp6lahm6fqnq0rp7fb.apps.googleusercontent.com",
		"project_id":"boschdashboard2-1",
		"auth_uri":"https://accounts.google.com/o/oauth2/auth",
		"token_uri":"https://accounts.google.com/o/oauth2/token",
		"auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
		"client_secret":"a-DoxUdUZ-BGwDuL4frPD9Bn",
		"redirect_uris":["https://prototype-84629.mybluemix.net/analytics"]
		
		}
}
*/
var scopes = [
	"https://www.googleapis.com/auth/webmasters"
];

var key = googCreds; // require('/path/to/key.json');
var jwtClient = new google.auth.JWT(
	key.client_email,
	null,
	key.private_key,
	scopes, // [scope1, scope2],
	null
);

// console.log(jwtClient);

var webmasters = google.webmasters('v3');
for (var property in webmasters) {
	console.log(property);
}

jwtClient.authorize(function(err, tokens) {
	if (err) {
		console.log(err);
		return;
	}

	// get a list of tracked websites
	var param1 = {
		auth: jwtClient,
		'content-type': 'application/json'
	};
	webmasters.sites.list(param1, function(err, resp) {
		if (err) return console.log(err);

		console.log("resp1 is: ");
		console.log(resp); // should contain "http://www.bosch-pt.de/"
	});


	// get data from search analytics
	var param2 = {
		auth: jwtClient,
		siteUrl: "http://www.bosch-pt.de/",
		// path: '',
		startDate: "2016-12-22",
		endDate: "2016-12-29",
		'content-type': 'application/json'
	};
	webmasters.searchanalytics.query(param2, function(err, resp) {
		if (err) return console.log(err);

		console.log("resp2 is: ");
		console.log(resp);
	});


	//// in a data stream way
	// var data = [];

	// sites.on('data', function(chunk) {
	// 	data.push(chunk);
	// });
	// sites.on('end', function() {
	// 	console.log(data);
	// 	var buff = new Buffer(data.join('')).toString();

	// 	console.log('////////////////////////// Success //////////////////////////\n')
	// 	console.log(buff);

	// });

	// sites.on('error', function(e) {
	// 	console.log(e);
	// });

	// console.log(JSON.stringify(sites.toJSON(), null, 3));

	// sites.readResponseBody();
});