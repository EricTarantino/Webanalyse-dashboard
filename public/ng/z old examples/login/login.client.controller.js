(function() {

    'use strict';

    angular.module('login')
        .controller('LoginCtrl', LoginCtrl);

	//Login injections
    LoginCtrl.$inject = ['$mdDialog', '$scope', 'LoginSvc', '$location'];

	// ----- ControllerFunction -----
    function LoginCtrl($mdDialog, $scope, LoginSvc, $location) {

        var vm = this;
        vm.username = null;
        vm.password = null;

        vm.handleSubmit = handleSubmit;
        vm.handleCancel = handleCancel;

        function handleSubmit() {
            return $mdDialog.hide();
        }

        function handleCancel() {
            return $mdDialog.hide();
        }
    }
})();