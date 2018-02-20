(function () {
   'use strict';
	// NewResumeSectionCtrl modal controller
	angular.module('apollo').controller('NewResumeSectionCtrl', function($scope, close) {		
		
		$scope.sections = [
			{
				icon: 'fa-file-text',
				label: 'Text section',
				slug: 'section-text',
				selected: true			
			},
			{
				icon: 'fa-graduation-cap',
				label: 'Education',
				slug: 'section-education'			
			},			
			{
				icon: 'fa-building',
				label: 'Work experience',
				slug: 'section-work'			
			},
			{
				icon: 'fa-comments',
				label: 'Languages',
				slug: 'section-languages'			
			},			
			{
				icon: 'fa-bar-chart',
				label: 'Skillset Bar',
				slug: 'section-skillset'			
			},			
			{
				icon: 'fa-briefcase',
				label: 'Portfolio',
				slug: 'section-portfolio'			
			},
			{
				icon: 'fa-heart',
				label: 'Interests',
				slug: 'section-interests'			
			},
			{
				icon: 'fa-file-image-o',
				label: 'Clients Logos',
				slug: 'section-logos'			
			},
			{
				icon: 'fa fa-user',
				label: 'References',
				slug: 'section-references'	
			},			
			{
				icon: 'fa fa-trophy',
				label: 'Awards',
				slug: 'section-awards'	
			},
			{
				icon: 'fa fa-certificate',
				label: 'Certifications',
				slug: 'section-certifications'	
			},
			{
				icon: 'fa fa-book',
				label: 'Publications',
				slug: 'section-publications'	
			}
		];
		//clients, social,

		// select item
		$scope.selectItem = function(slug) {
			for (var i = 0; i < $scope.sections.length; i++) {
				if (slug == $scope.sections[i].slug) {
					$scope.sections[i].selected = true;
				} else {
					$scope.sections[i].selected = false;
				}
			}
		};

		// get selected
		$scope.getSelected = function() {
			var selected = $scope.sections[0];
			for (var i = 0; i < $scope.sections.length; i++) {
				if ($scope.sections[i].selected === true) {
					selected = $scope.sections[i];
					break;
				}
			}
			return $scope.sections[i];
		};

		$scope.ok = function(e) {
			e.preventDefault();
			close($scope.getSelected());
		};

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();
		};		
	});	

}());

