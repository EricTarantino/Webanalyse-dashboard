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
      //when is line 15 ever used?
      svc.token = response.data
      $http.defaults.headers.common['X-Auth'] = response.data
      return svc.getUser()
    })
  }
  //use user input date and default date 
  svc.register = function (username, password,  useremail, userrights, mmdbStartDate, mmdbEndDate) {
  	//this could be posted with user, just to see better
	//alert(2)
	
	//The mmdbSpace are the userrights in the beginning
    return $http.post('/api/user', {
      username: username, password: password, useremail: useremail, userrights:userrights, userdashboards: [],
      mmdbAccess: userrights, mmdbStartDate : mmdbStartDate, mmdbEndDate : mmdbEndDate
    }).then( function () {
      alert("login")
      return svc.login(useremail, password)
    })
  }
}]) 