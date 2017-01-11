angular.module('analytics')
	.service('DBSvc', ['$http', function($http) {
		var svc = this

		//this service is used in analytics, this is how the service is used
		//the service posts a graph to api/graphdata
		//the service then gets the graph data
		//this is a json with the (updated) graph configuration and and also 
		//the plot data

		svc.deleteDB = function(db_name, scope) {

			var url = '/api/dashboard?_db=' + db_name;

			return $http.delete(url).then(function successCallback(res) {

				//this will remove the data localy
				scope.$emit('deletedDB', [db_name]);


			}, function errorCallback(err) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				scope.$emit('undeleteDB', [db_name])
			})
		}

		//TODO post only the name of the graph
		svc.newDB = function(answer, scope) {

			//this is emitted from here 
			//scope.$emit('newDBCard', [answer.selectNameDB]);

			return $http.post('/api/dashboard', answer).then(function successCallback() {

			}, function errorCallback(err) {
				/* called asynchronously if an error occurs,
				the dashboard needs to be deleted localy*/
				scope.$emit('deleteDB', answer.selectNameDB);
			})
		}

		//this function fetches the whole dashboard data in a stream 
		//this stream is read out and objects are attached to the 
		//dashboard data model: vm.mygraphs when the user logs in 
		svc.getDB = function(name, scope) {

			var req = {
				method: 'GET',
				// url: 'https://prototype-84629.mybluemix.net/api/graphdata',
				// url: 'http://localhost:6014/api/graphdata',
				url: '/api/graphdata',
				headers: {
					'graphName': name
				}
			}

			//return the plot data
			$http(req).then(function successCallback(res) {

				var data = JSON.stringify(res.data);

				// this callback will be called asynchronously, when the response is available    	
				console.log("got db ");

				//emit data upwards, get the chartID number according to angular module, as scope variable
				scope.$emit('updateAnalyticsChart', [data]);

			}, function errorCallback(data) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				console.log("an error in get graph plot data occured");

			});
		}

	}])
