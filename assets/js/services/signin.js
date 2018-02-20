(function() {
'use strict';
	
	angular.module('apollo').service('SignInService', function($q, $http) {

		return {
			getLinkedinProfile: function() {
				return $q(function(resolve, reject) {
					IN.API.Raw("/people/~:(id,firstName,lastName,emailAddress,picture-url)?format=json")
					.result(resolve)
					.error(reject);
				});
			},
			signIn: function(strategy, data) {
				data.strategy = strategy;
				return $http.put('/api/Users', data);
			}
		};
	});

}());