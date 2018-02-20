(function () {
   'use strict';
	angular.module('apollo').controller('ResumesCtrl', function($scope, $location, ModalService, ResumesService) {
		
		$scope.resumes = [];

		// get all
		$scope.getAll = function() {
			ResumesService.getAll()
			.then(function(result) {
				$scope.resumes = result.data;
			})
			.catch(function(err) {
				window.location.href = '/signin';
				console.log(err);
			});			
		};
		$scope.getAll();

		// create new
		$scope.createNew = function(e) {
			e.preventDefault();
		    ModalService.showModal({
		      templateUrl: "views/modal/new-cv.html",
		      controller: "NewResumeCtrl"
		    }).then(function(modal) {
				modal.close.then(function(name) {
					if (name !== undefined) {
						ResumesService.createResume(name)
						.then(function(result) {
							$scope.getAll();
						})
						.catch(function(err) {
							if (err && err.data) {
								$scope.showErrorAlert(err.data.title || 'An error has occurred');
							}
							console.log(err);
						});
					}
				});
		    });
		};

		// remove CV
		$scope.removeCV = function(id) {
		    ModalService.showModal({
		      	templateUrl: "views/modal/alert.html",
		      	controller: "RemoveResumeCtrl",
				inputs: {
				    id: id
				}		      
		    }).then(function(modal) {
				modal.close.then(function(id) {
					if (id !== undefined) {
						ResumesService.removeResume(id)
						.then(function(result) {
							$scope.getAll();
						})
						.catch(function(err) {
							if (err && err.data) {
								$scope.showErrorAlert(err.data.title || 'An error has occurred');
							}							
							console.log(err);
						});
					}
				});
		    });			
		};

		// clone CV
		$scope.cloneCV = function(id, name) {
		    ModalService.showModal({
		      	templateUrl: "views/modal/clone-cv.html",
		      	controller: "CloneResumeCtrl",
				inputs: {
				    name: name,
				    id: id
				}		      
		    }).then(function(modal) {
				modal.close.then(function(resume) {					
					if (resume !== undefined && resume.name !== undefined && resume.id !== undefined) {
						ResumesService.cloneResume(resume.id, resume.name)
						.then(function(result) {
							$scope.getAll();
						})
						.catch(function(err) {
							if (err && err.data) {
								$scope.showErrorAlert(err.data.title || 'An error has occurred');
							}							
							console.log(err);
						});
					}
				});
		    });
		};

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
	});

	// new resume controller
	angular.module('apollo').controller('NewResumeCtrl', function($scope, close) {
		$scope.cvName = '';
		$scope.error = null;

		$scope.createNew = function(e) {
			e.preventDefault();
			if ($scope.cvName === '') {
				$scope.error = 'Please add a name!';
				return;
			}
			close($scope.cvName);
		};

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();			
		};
	});

	// remove resume controller
	angular.module('apollo').controller('RemoveResumeCtrl', function($scope, close, id) {
		$scope.alertTitle = 'Remove resume';
		$scope.alertMessage = 'Are you sure you want to remove this resume?';
		$scope.error = null;
		$scope.isConfirm = true;

		$scope.cancel = function(e) {
			e.preventDefault();
			close();
		};

		$scope.ok = function(e) {
			e.preventDefault();
			close(id);
		};

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();			
		};
	});	

	angular.module('apollo').controller('AlertResumeCtrl', function($scope, close, errContent) {
		$scope.alertTitle = 'Alert';
		$scope.alertMessage = errContent;
		$scope.error = null;
		$scope.isConfirm = false;

		$scope.ok = function(e) {
			e.preventDefault();
			close();
		};

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();			
		};	
	});	

	// clone controller
	angular.module('apollo').controller('CloneResumeCtrl', function($scope, close, name, id) {
		$scope.cvName = name + ' - clone';
		$scope.error = null;

		$scope.clone = function(e) {
			e.preventDefault();
			if ($scope.cvName === '') {
				$scope.error = 'Please add a name!';
				return;
			}
			close({
				name: $scope.cvName,
				id: id
			});
		};

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();			
		};
	});	

}());

