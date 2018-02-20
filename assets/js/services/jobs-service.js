(function() {
'use strict';
	
	angular.module('apollo').service('JobsService', function($http) {		
		return {
			getJobs: function(query, country, page) {
				//provider/:country/:page/:limit/:query
				var limit = 10;
				// var page = 0;
				return $http.get('/api/Jobs/ind/' + country + '/' + page + '/' + limit + '/' + encodeURIComponent(query));
			}
		};
	});

}());