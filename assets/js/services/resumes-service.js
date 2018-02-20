(function() {
'use strict';
	
	angular.module('apollo').service('ResumesService', function($q, $http) {

		return {
			createResume: function(resumeName) {
				return $http.post('/api/Resumes', {
					resumeName: resumeName
				});
			},
			cloneResume: function(id, newName) {
				return $http.post('/api/Resumes/clone', {
					id: id,
					newName: newName
				});
			},
			removeResume: function(id) {
				return $http.delete('/api/Resumes/' + id);
			},
			getAll: function() {
				return $http.get('/api/Resumes');
			},
			getResume: function(id) {
				return $http.get('/api/Resumes/' + id);
			},
			updateResume: function(id, resume) {
				return $http.put('/api/Resumes/' + id, {
					resume: resume
				});
			}
		};
	});

}());