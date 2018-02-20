(function () {

   'use strict';
	angular.module('apollo').directive('sectionInterests', function(UtilsService) {
		return {
			templateUrl: 'views/directives/section-hobby.html',
			restrict: 'E',
			scope: {
				section: '='
			},
			link: function(scope, element, attrs) {

				scope.section.hasShortDescription = true;
				scope.subsections = [];
				scope.hobby = null;

				if (_.isNil(scope.section.subsections)) {
					scope.subsections = [];
				} else {
					scope.subsections = scope.section.subsections;
				}

				scope.newSubsection = function(e) {
					e.preventDefault();
					if (_.isNil(scope.hobby)) {
						return;
					}					
					scope.subsections.push({
						ids: UtilsService.guid(),
						name: scope.hobby,
					});
					scope.hobby = null;
				};

				scope.$watch('subsections', function(newEntrie) {
					scope.section.subsections = scope.subsections;
				}, true);

				scope.removeSubSection = function(e, subsection) {
					e.preventDefault();					
					if (confirm('Are you sure you want to remove this entry?')) {
						scope.subsections.splice(scope.findSubSectionIndex(subsection), 1);
						scope.update();
					}
				};			

				scope.update = function() {
					scope.section.subsections = scope.subsections;
				};

				scope.closeSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = false;
				};

				scope.openSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = true;
				};

				scope.findSubSectionIndex = function(subsection) {
					var out = 0;
					for (var i = 0; i < scope.subsections.length; i++) {
						if (scope.subsections[i].ids === subsection.ids) {
							out = i;
							break;
						}
					}
					return out;
				};

			}
		};

	});

}());


(function () {

	angular.module('apollo').directive('subsectionInterests', function() {
		return {
			templateUrl: 'views/directives/sub/sub-interests.html',
			restrict: 'E'
		};
	});	

}());


