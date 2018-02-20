(function() {
'use strict';
	
	angular.module('apollo').service('StorageService', function(localStorageService) {

		var ACCESS_TOKEN_KEY = 'accessToken';
		var USER_KEY = 'apollo-user';
		return {
			setToken: function(token) {
				return localStorageService.set(ACCESS_TOKEN_KEY, token);
			},
			getToken: function() {
				return localStorageService.get(ACCESS_TOKEN_KEY);
			},
			removeToken: function() {
				return localStorageService.remove(ACCESS_TOKEN_KEY);
			},
			setUser: function(user) {
				return localStorageService.set(USER_KEY, user);	
			},
			getUser: function(user) {
				return localStorageService.get(USER_KEY);	
			}			
		};
	});

}());