/* 
 * This is a server to server commuicating script without asking for user - 
 * consent. However, it requires the website to be tracked and queried added 
 * into the console properties at https://www.google.com/webmasters/tools/user-admin.
 * To add our Bossch-pt.de website at this location in Manuel's account, first we 
 * need to verify that we OWN that property (bosch website). There is a separate procedure
 * for that... 
 * So for now (for PoC), forget about this script and focus on './GoogSearchCon.server.controller.js'.
 * Cheers!
 */

var google = require('googleapis');
var webmasters = google.webmasters('v3');

/**
 * The JWT authorization is ideal for performing server-to-server
 * communication without asking for user consent.
 *
 * Suggested reading for Admin SDK users using service accounts:
 * https://developers.google.com/admin-sdk/directory/v1/guides/delegation
 *
 * Note on the private_key.pem:
 * Node.js currently does not support direct access to the keys stored within
 * PKCS12 file (see issue comment
 * https://github.com/joyent/node/issues/4050#issuecomment-8816304)
 * so the private key must be extracted and converted to a passphrase-less
 * RSA key: openssl pkcs12 -in key.p12 -nodes -nocerts > key.pem
 *
 * See the defaultauth.js sample for an alternate way of fetching compute credentials.
 */
var authClient = new google.auth.JWT(
	'318598080318-compute@developer.gserviceaccount.com',
	null, // 'path/to/key.pem',
	// Contents of private_key.pem if you want to load the pem file yourself
	// (do not use the path parameter above if using this param)
	"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyDEIYf5cT0gmt\nrCCdvXIBLddVZRLLQVF3mJlTRhhS4lyiaPVZZGzkqJnOAtnWPy2gjvhCuj3S+CwM\nItIx9dg2d1khPXtUHRXdL6jrQkBCeRJJezDIdvKJa3feKFbP0wJKFtVBFAKKH1xz\nXmDcTe+BPv3tWy7HFVO4bX6olJy1i5WuwHxNQ/imf0YTurxRqu0JwNkbsTau5KXw\ngS/x2idQdaCTbyAqp0Lt2WIqHIoqIJBL9Mh97iG5HKpHt76+sD737ZCkWfXwLQAo\nL+aXlh0tsIWvN60FscUjZ0Xsqo119eeGUrOb7nArtiZcV0VfuWCGWzbKzNwYyQX5\nTdmvkU2TAgMBAAECggEAKcGqNqilu+ZEktCNjbECbbhcihB8SeL1wkCtpNQJnFau\nNwC6mc5to2rPN3t/rzl97+vX2X5oRXQikG4SMdlgbdWrt5n9tIpluEwXJ6WQAIb4\nfPdBR6Jt20CzCg0X3wGzxcB5HxwcRFx6iCwYN1Kn2v30+5eo7tPXoKc9TzgbUJAZ\n0evXuLl9+2Pi92XFkKi1PNxhqE4oPsY/Qf6/+ow+TpK2keLurSCuDkusK3VzXhOm\nq2cgLUGU6A9c3qDvZnFws7n1wEWGOcafobO/TZwl+3dV8YCkqauWdZ1Q8ICTt0wI\nfDh5KZxVb2IUbPfj+VQXz4knI4W44nV0IZxb5S4JIQKBgQDYmD8K3IxmQ54a9RAU\nDRvVS99hyz7bIh6xRxTQW6b4empxj8uKcFGWCJq/NZ5908BhkHC22E13nyCmFa4X\ncGfEWfm4kEsmpJMG8BsGHRKRmUcNsmcuOm/zJBzKog3Fj/8s0BZSK9zjWR1nerKj\ngGngfNkaN2KtVmF9krVNtbtlewKBgQDScLgdDW2bsuV1ruTNq2u3rZkBLgFsBg2C\nMu8FqC886dBWFCt8rS/yZpCkXlz0ujGZtkGNdcNFxdWxSG0nqnnLYNkR+FrJC1zK\nNf5GWzXE8uUqKFfN7+3W6Ea90V234KNamoEt78KvGuQZicuGTaM6BbHWArHUSC2p\nIN3PVvngyQKBgQCauSdPuv0QkH0BBM7XhAW9+NU6JtZf85+5Q+26ab59AfXH6dCc\ntF+TrdHdhZASkpF7IJNkCmBMc3//JL2YQNPfj+az0V/d2vKsohir5Vi+aaA4SJks\njNIr/kATAHCWEKdYe812JZ9FSQOYSC4UXkdD9eugrq/u4yYBbivVt1yGwQKBgQCm\nd/p9KPky+KKhpJdkxxzv8QifMUh4rpUTEL2aCQBNPFzNKyl3d/z80PvMusTn5z6D\nbPSQNb8iO6yekD+g6C9ung85MvCGJ1HguDOMbmyrfsWfwsgqpYjMv3PuhmePpMk0\nTBKyRv8Hy8rzFNkGRfZAWO7j77/CwNI1/0TX1uLWWQKBgEmZzpMyfPQ8qSamkJAs\nM5+z3fZqblRob7k8pihByaMx5L2P0NBhUs7WNWCr8nOReuh6Q55iW1L34pZNWP4c\n0h3hfUgzKT13Rh5DUZtNd6HiJvgKM3DDXw62Tsn8l4meWHkvtM4Kq6Hh6/AjuF5t\n+tlnb+TbEPSTvkasnz6BQx3d\n-----END PRIVATE KEY-----\n",
	// Scopes can be specified either as an array or as a single, space-delimited string
	['https://www.googleapis.com/auth/webmasters'],
	// User to impersonate (leave empty if no impersonation needed)
	null // 'subject-account-email@example.com'
);

authClient.authorize(function(err, tokens) {
	if (err) {
		return console.log(err);
	}

	// Make an authorized request to list sites.
	webmasters.sites.list({
		auth: authClient
	}, function(err, resp) {
		// handle err and response
		if (err) {
			return console.log(err);
		}
		console.log(resp);
	});

	// get data from search analytics
	var params = {
		auth: authClient,
		siteUrl: encodeURIComponent("http://www.bosch-pt.de/"),
		resource: {
			startDate: "2016-12-22",
			endDate: "2016-12-29",
			dimensions:['query', 'page']
		}
	};
	webmasters.searchanalytics.query(params, function(err, response) {
		if (err) return console.log(err);

		console.log("response is: ");
		console.log(response);
		return response;
	});
});
