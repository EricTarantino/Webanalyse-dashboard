angular.module('analytics')
	.service('AnalyticsSvc', ['$http', function($http) {
		var svc = this

		//this service is used in analytics, this is how the service is used
		//the service posts a graph to api/graphdata
		//the service then gets the graph data
		//this is a json with the (updated) graph configuration and and also 
		//the plot data

		//TODO post only the name of the graph
		svc.newGraph = function(answer, scope) {

			//post the graph
			return $http.post('/api/graphdata', answer).then(function() {

				//get the graph
				return svc.getGraphplot(answer.useremail, answer.dashboard, answer.name, scope)

			})
		}


		//add user to get a clearly specified graph
		svc.getGraphplot = function(useremail, dashboard, name, scope) {

			var req = {
				method: 'GET',
				// url: 'https://prototype-84629.mybluemix.net/api/graphdata',
				// url: 'http://localhost:6014/api/graphdata',
				url: '/api/graphdata',
				headers: {
					'useremail': useremail,
					'dashboard': dashboard,
					'name': name
				}//,
				//cache: true
			}


			//return the plot data
			$http(req).then(function successCallback(res) {

				var graph = JSON.stringify(res.data);
				// alert("got graph");
				console.log("got graph");

				//emit data upwards, get the chartID number according to angular module, as scope variable
				//the graph is emitted, assigned and saved locally by the information it holds (db, name)
				scope.$emit('updateAnalyticsChart', [graph]);

			}, function errorCallback(data) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				// alert("an error in get graph plot data occured");
				console.log("an error in get graph plot data occured");

			});

		}

	}])
