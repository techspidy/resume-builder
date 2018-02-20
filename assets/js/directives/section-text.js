(function () {

   'use strict';
	angular.module('apollo').directive('sectionText', function() {
		return {
			templateUrl: 'views/directives/section-text.html',
			restrict: 'E',
			scope: {
				section: '='
			},
			link: function(scope, element, attrs) {
				if (_.isNil(scope.section.about)) {
					scope.section.about = '';
				}
			}
		};

	});	

}());

