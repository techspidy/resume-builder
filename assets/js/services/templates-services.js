(function() {
'use strict';
	
	angular.module('apollo').service('TemplatesService', function($q, $http) {

		return {
			getAll: function() {
				return $http.get('/api/Templates');
			}
		};
	});

}());