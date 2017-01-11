angular.module('register')
.service('RegisterSvc',['$http', function ($http) {
  var svc = this
  svc.getUser = function () {
    return $http.get('/api/user')
    .then(function (response) {
      return response.data
    })
  }
  svc.login = function (useremail, password) {
    return $http.post('/api/login', {
      useremail: useremail, password: password
    }).then(function (response) {
      svc.token = response.data
      $http.defaults.headers.common['X-Auth'] = response.data
      return svc.getUser()
    })
  }
  svc.register = function (username, password, useremail, rights) {
    return $http.post('/api/user', {
      username: username, password: password,  useremail: useremail, userrights: rights, userdashboards: [] 
    }).then(function () {
      return svc.login(useremail, password)
    })
  }
}])