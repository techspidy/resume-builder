(function() {
'use strict';
	
	angular.module('apollo').service('AuthService', function(StorageService) {		
		return {
			logIn: function(token) {
				StorageService.setToken(token);
				window.location.href = '/admin';
			},
			logOut: function() {
				StorageService.removeToken();
				window.location.href = '/signin';
			}
		};
	});

}());