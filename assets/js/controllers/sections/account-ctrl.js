(function () {
   'use strict';
	angular.module('apollo').controller('MyAccountCtrl', function($scope, $routeParams, $rootScope, ModalService, UtilsService, toastr) {

		$scope.appHost = ApolloConf.host;
		//$scope.permalink = $scope.$parent.user.permalinkSlug;
		
		$scope.$parent.retrieveUser()
		.then(function() {
			$scope.permalink = $scope.$parent.user.permalinkSlug;
		});

		$scope.saveOptions = function(e) {
			e.preventDefault();
			$scope.$parent.udateUserOptions();
		};

		$scope.savePermalink = function(e) {
			e.preventDefault();
			if ($scope.permalink === '') {
				alert('Permalink can not be empty');
				return;
			}
			$scope.$parent.saveUserPermalink($scope.permalink)
			.then(function(result) {
				return $scope.$parent.retrieveUser();
			})
			.then(function() {
				$scope.permalink = $scope.$parent.user.permalinkSlug;
			});
		};

		$scope.removeAccount = function(e) {
			e.preventDefault();
			if (confirm('Are you sure you want to delete your account and all the data?')) {
				$scope.$parent.removeAccount();
			}
		};
		
	});

}());

