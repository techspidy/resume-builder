(function () {
   'use strict';
	angular.module('apollo').controller('AdminUserListCtrl', function($scope, $routeParams, $rootScope, UserListService) {
			console.log('USERS controller ');

			$scope.page = 0;
			$scope.isSearching = false;
			$scope.users = [];
			$scope.totalUsers = 0;

			var getUsers = function() {
				UserListService.getUsers($scope.page)
				.then(function(result) {
					$scope.isSearching = false;
					$scope.totalUsers = result.data.no;
					if (result.data.data.length === 0) {
						$scope.allLoaded = true;
					}
					for (var i = 0; i < result.data.data.length; i++) {
						$scope.users.push(result.data.data[i]);
					}
				})
				.catch(function(err) {
					$scope.isSearching = false;
					console.log('Error, users list ', err);
				});
			};

			getUsers();

			$scope.loadMore = function(e) {
				e.preventDefault();
				$scope.page++;
				$scope.isSearching = true;
				getUsers();
			};	

	});

}());

