(function() {
'use strict';
	
	angular.module('apollo').service('FilesService', function($q, $http) {

		return {
			getAll: function() {
				return $http.get('/api/Files');
			},

			remove: function(_id) {
				return $http.delete('/api/Files/' + _id);
			} 
		};
	});

}());