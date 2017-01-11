angular.module('post').service('PostsSvc', function ($http) {
  this.fetch = function () {
    return $http.get('/posts')
    .then(function (response) {
      return response.data
    })
  }
  this.create = function (post) {
    return $http.post('/posts', post)
  }
})