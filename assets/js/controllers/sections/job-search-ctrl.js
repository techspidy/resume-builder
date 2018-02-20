(function () {
   'use strict';
	angular.module('apollo').controller('JobSearchCtrl', function($scope, $routeParams, $rootScope, JobsCountriesService, JobsService) {
		
		var firstLoad = true;
		$scope.jobInput = '';
		$scope.page = 0;
		
		$scope.$parent.retrieveUser()
		.then(function() {
			$scope.indeedSelectedCountry = $scope.$parent.user.options.indeedSelectedCountry;
			$scope.countries = {
				model: $scope.indeedSelectedCountry,
				availableCountries: JobsCountriesService.getAll()
			};
			setTimeout(function() {
				$('select').material_select();
				retrieveJobs('all');
			}, 1000);			
		});		

		// country model change
		$scope.$watch('countries.model', function(newVal) {
			if (firstLoad === true) {
				firstLoad = false;
				return;
			}
			$scope.$parent.user.options.indeedSelectedCountry = newVal;
			$scope.$parent.udateUserOptions(true);
			if (isValidSearchInput()) {
				$scope.page = 0;
				$scope.isSearching = true;
				runQuery();
			} else {
				retrieveJobs('all');
			}
		});

		$scope.isSearching = false;
		var retrieveJobs = function(q) {	
			$scope.isSearching = true;
			var query = !_.isNil(q) ? q	: $scope.jobInput;	
			JobsService.getJobs(query, $scope.$parent.user.options.indeedSelectedCountry, $scope.page)
			.then(function(result) {
				$scope.isSearching = false;
				if ($scope.page === 0) {
					$scope.jobResults = result.data.results;
				} else {
					for (var i = 0; i < result.data.results.length; i++) {						
						$scope.jobResults.push(result.data.results[i]);
					}
				}
			})
			.catch(function(err) {
				$scope.isSearching = false;
				console.log(err);
			});
		};
 
		var runQuery = _.debounce(retrieveJobs, 1500);		

		// job input change
		$scope.$watch('jobInput', function(newVal) {
			if (!isValidSearchInput()) {
				return;
			}
			$scope.page = 0;
			$scope.isSearching = true;
			runQuery();
		});

		var isValidSearchInput = function() {
			if ($scope.jobInput.length < 3) {
				$scope.jobResults = [];
			}
			return $scope.jobInput.length > 2;
		};

		$scope.loadMore = function(e) {
			e.preventDefault();
			$scope.page++;
			var q = $scope.jobInput === '' ? 'all' : $scope.jobInput;
			retrieveJobs(q);
		};		

	});

}());

