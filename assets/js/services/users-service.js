(function() {
'use strict';
	
	angular.module('apollo').service('UsersService', function($q, $http, StorageService) {

		return {
			getContextUser: function(userId) {
				return $q(function(resolve, reject) {
					$http.get('/api/Users/1')
					.then(function(user) {
						StorageService.setUser(user.data.data.attributes);
						resolve(user.data.data.attributes);
					})
					.catch(reject);
				});
			},

			// update user options
			updateOptions: function(options, userID) {
				return $q(function(resolve, reject) {
					$http.put('/api/Users/' + userID + '/options', {
						options: options
					})
					.then(function(result) {
						resolve(result);
					})
					.catch(reject);
				});
			},

			// update user permalink
			updatePermalink: function(permalink, userID) {
				return $q(function(resolve, reject) {
					$http.put('/api/Users/' + userID + '/permalink', {
						permalink: permalink
					})
					.then(function(result) {
						resolve(result);
					})
					.catch(reject);
				});
			},

			// remove user account
			removeAccount: function(userID) {
				return $q(function(resolve, reject) {
					$http.delete('/api/Users/' + userID)
					.then(function(result) {
						resolve(result);
					})
					.catch(reject);
				});
			}

		};
	});

}());