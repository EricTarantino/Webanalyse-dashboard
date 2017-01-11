angular
	.module('graphpicker', ['ngMaterial', 'ngMessages'])
	.controller('GraphpickerCtrl', function($scope) {
		$scope.items = ["Basic Line", "Basic Area", "StackedBar", "Column Drilldown", "Pie Chart", "Scatter Plot", "CLP"];
		$scope.selectedItem;
		$scope.getSelectedText = function() {
			if ($scope.selectedItem !== undefined) {
				return "Ihre Auswahl ist: " + $scope.selectedItem;
			} else {
				return "Ihre Auswahl";
			}
		};
	});


/**
Copyright 2016 Google Inc. All Rights Reserved. 
Use of this source code is governed by an MIT-style license that can be foundin the LICENSE file at http://material.angularjs.org/HEAD/license.
**/

/**
Copyright 2016 Google Inc. All Rights Reserved. 
Use of this source code is governed by an MIT-style license that can be foundin the LICENSE file at http://material.angularjs.org/HEAD/license.
**/
