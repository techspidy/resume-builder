(function () {
   'use strict';
	angular.module('apollo').controller('ChooseTemplateCtrl', function($scope, close, TemplatesService) {		
		
		$scope.templates = [];
		function getAll() {
			TemplatesService.getAll()
			.then(function(result) {
				console.log('templates result', result);
				$scope.templates = result.data;
			})
			.catch(function(err) {
				console.log('Error');
			});
		}
		getAll();

		$scope.useTemplate = function(template) {
			close(template);
		};

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();
		};		
	});	

}());

