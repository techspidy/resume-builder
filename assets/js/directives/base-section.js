(function () {
   'use strict';
	angular.module('apollo').directive('baseSection', function($compile) {
		return {
			templateUrl: 'views/directives/base-section.html',
			restrict: 'A',
			scope: {
				section: '='
			},
			link: function(scope, element, attrs) {

				// create extended content
				var ui = element.find('.base-sortable-content-extended');
				ui.append('<' + scope.section.type + ' section="section" class="extended-section-directive"></' + scope.section.type + '');
				$compile(ui.contents())(scope);

				scope.removeSection = function(e) {
					e.preventDefault();					
					if (confirm('Are you sure you want to remove this section?')) {
						scope.$parent.removeSectionData(scope.section.ids);
					}
				};				

				scope.closeSection = function(e) {
					e.preventDefault();
					scope.section.opened = false;
				};

				scope.openSection = function(e) {
					e.preventDefault();
					scope.section.opened = true;
				};				
			}
		};

	});

}());

