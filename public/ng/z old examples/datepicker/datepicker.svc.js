angular.module('datepicker')
.service('DatepickerSvc',['$http', function ($http) {
  var svc = this
  svc.getUser = function () {
    return $http.get('/api/user')
    .then(function (response) {
      return response.data
    })
  }
  svc.login = function (username, password) {
    return $http.post('/api/login', {
      username: username, password: password
    }).then(function (response) {
      svc.token = response.data
      $http.defaults.headers.common['X-Auth'] = response.data
      return svc.getUser()
    })
  }
  svc.register = function (username, password, email, rights) {
    return $http.post('/api/user', {
      username: username, password: password,  useremail: email, userrights: rights
    }).then(function () {
      return svc.login(username, password)
    })
  }
}])