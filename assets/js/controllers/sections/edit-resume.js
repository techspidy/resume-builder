(function () {
   'use strict';
	angular.module('apollo').controller('EditResumesCtrl', function($scope, $routeParams, $rootScope, ResumesService, ModalService, UtilsService, toastr, StorageService) {
		// console.log($routeParams.id);
		$rootScope.curentEditedResumeName = 'test';

		$scope.resumeData = null;
		$scope.sections = null;
		$scope.resumeMeta = null;

		$scope.isUpdating = false;
		$scope.templateData = null;

		// setInterval(function() {
		// 	console.log($scope.sections);			
		// }, 6000);	

		// retrieve resume
		$scope.retriveResume = function() {
			ResumesService.getResume($routeParams.id)
			.then(function(response) {
				$scope.resumeData = response.data.data.attributes;
				$rootScope.curentEditedResumeName = ' / ' + $scope.resumeData.meta.name;
				$scope.sections = $scope.resumeData.sections || [];
				$scope.resumeMeta = $scope.resumeData.meta || {};
				$scope.templateData = $scope.resumeMeta.defaultTemplate;
				// console.log($scope.resumeMeta);			
			})
			.catch(function(err) {
				if (err && err.data) {
					$scope.showErrorAlert(err.data.title || 'An error has occurred');
				}
			});			
		};

		$scope.retriveResume();

		// show error alert
		$scope.showErrorAlert = function(errContent) {
		    ModalService.showModal({
		      	templateUrl: "views/modal/alert.html",
		      	controller: "AlertResumeCtrl",
		      	inputs: {
		      		errContent: errContent
		      	}	      
		    });
		};

		// launch new section modal
		$scope.newSection = function(e) {
			e.preventDefault();
		    ModalService.showModal({
		      	templateUrl: "views/modal/new-section.html",
		      	controller: "NewResumeSectionCtrl"
		    }).then(function(modal) {
				modal.close.then(function(newSection) {				
					if (newSection !== undefined || newSection !== null) {
						$scope.addNewSection(newSection);
						console.log('Add section: ', newSection);
					}
				});
		    });		
		};

		// choose template
		$scope.chooseTemplate = function(e) {
			e.preventDefault();
		    ModalService.showModal({
		      	templateUrl: "views/modal/choose-template.html",
		      	controller: "ChooseTemplateCtrl"
		    }).then(function(modal) {
				modal.close.then(function(template) {									
					if (!_.isNil(template)) {				
						if ($scope.templateData.slug !== template.slug) {
							$scope.templateData = template;
							$scope.saveSectionBroker(true);
						}
					}
				});
		    });				
		};

		// create new section
		$scope.addNewSection = function(newSectionData) {
			for (var i = 0; i < $scope.sections.length; i++) {
				$scope.sections[i].opened = false;
			}
			$scope.sections.push({
				ids: UtilsService.guid(),
				name: newSectionData.label,
				type: newSectionData.slug,
				icon: newSectionData.icon,
				opened: true
			});
			$scope.resumeData.meta.aboutSection.opened = false;
		};

		// remove section
		$scope.removeSectionData = function(ids) {
			for (var i = 0; i < $scope.sections.length; i++) {
				if ($scope.sections[i].ids === ids) {
					$scope.sections.splice(i, 1); 
					break;
				}
			}
		};

		// save section
		$scope.saveSection = function(e) {
			e.preventDefault();
			$scope.saveSectionBroker();
		};

		$scope.saveSectionBroker = function(isSiltent) {
			if ($scope.isUpdating) {
				return;
			}
			$scope.isUpdating = true;
			
			$scope.resumeMeta.defaultTemplate = $scope.templateData;

			ResumesService.updateResume($scope.resumeData._id, {
				sections: $scope.sections,
				meta: $scope.resumeMeta
			}).then(function(result) {
				$scope.isUpdating = false;
				if (!isSiltent) {
					toastr.success('Saved!');
				}				
			})
			.catch(function(err) {
				$scope.isUpdating = false;
				if (err && err.data) {
					$scope.showErrorAlert(err.data.title || 'An error has occurred');
				}
			});
		};

		$scope.exportDocument = function(e) {
			e.preventDefault();
		    ModalService.showModal({
		      	templateUrl: "views/modal/export-cv.html",
		      	controller: "ExportResumeCtrl",
				inputs: {
					userPermalinkSlug: $scope.$parent.user.permalinkSlug,
					resumePermalinkSlug: $scope.resumeData.permalinkSlug,
					token: StorageService.getToken()
				}		      
		    }).then(function(modal) {
				modal.close.then(function(formatModel) {
					if (!_.isNil(formatModel)) {
						// var win = window.open('/api/Exports/' + $scope.$parent.user.permalinkSlug + '/' + $scope.resumeData.permalinkSlug + '/' + formatModel + '/pdf?token=' + StorageService.getToken(), '_blank');
			  	// 		win.focus();
					}
				});
		    });
		};

		$scope.sortableOptions = {
			handle: '> div > .base-sortable-header',
			//update: function(e, ui) { ... },
			axis: 'y'
		};
		//'refresh'
	});

	// export resume controller
	angular.module('apollo').controller('ExportResumeCtrl', function($scope, close, userPermalinkSlug, resumePermalinkSlug, token) {

		setTimeout(function() {
			$('select').material_select();
		}, 500);

		$scope.formatModel = 'no-format';
		$scope.printable = false;

		$scope.$watch('formatModel', function(newVal) {
			if (newVal === 'no-format') {
				$scope.printable = false;				
			} else {
				$scope.printable = true;
			}
		});
		
		$scope.export = function(e) {
			e.preventDefault();
			var win = window.open('/api/Exports/' + userPermalinkSlug + '/' + resumePermalinkSlug + '/' + $scope.formatModel + '/pdf?token=' + token, '_blank');
  			win.focus();
			close($scope.formatModel);
		};

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();			
		};
	});

}());

