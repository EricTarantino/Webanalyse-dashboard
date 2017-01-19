angular.module('analytics')
.service('analyticsGraphSvc',['$http', function ($http) {
  var svc = this
  svc.getGraph = function () {
    return $http.get('/api/graph')
    .then(function (response) {
    	//return plot data
      return response.data
    })
  }
  svc.postGraph = function (graphConfig) {
    return $http.post('/api/graphdata', {graphConfig}).then(function () {
    	
      //TODO get the graph plot with the graph name, also use user name and login or some authorization to querry graph
      return svc.getGraph(graphConfig.name)
    })
  }
}])