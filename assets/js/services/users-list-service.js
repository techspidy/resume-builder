(function() {
'use strict';
	
	angular.module('apollo').service('UserListService', function($http) {		
		return {
			getUsers: function(page) {
				var limit = 25;
				return $http.get('/api/Users/?page=' + encodeURIComponent(page) + '&limit=' + limit);
			},

			getResumesForUser: function(userId) {
				return $http.get('/api/Resumes/resumes-for-user/' + userId);	
			}
		};
	});

}());