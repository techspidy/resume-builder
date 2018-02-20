(function () {
   'use strict';
	// MediaGalleryCtrl modal controller
	angular.module('apollo').controller('MediaGalleryCtrl', function($scope, close, ModalService, FilesService) {

		$scope.images = [];
		$scope.showLoading = false;

		$scope.getAllImages = function() {
			$scope.showLoading = true;
			FilesService.getAll()
			.then(function(result) {
				$scope.images = result.data;
				$scope.showLoading = false;
			})
			.catch(function(err) {
				$scope.showLoading = false;
				$scope.showErrorAlert(err.data.title || 'An error has occurred');
			});
		};
		$scope.getAllImages();

		$scope.onUploadSuccess = function(response) {
			$scope.images.unshift(response.data);
			$scope.showLoading = false;
			// console.log($scope.images);
		};

		$scope.onError = function(err) {
			$scope.showLoading = false;
			if (err && err.data) {
				$scope.showErrorAlert(err.data.title || 'An error has occurred');
			}
		};
		$scope.onUploadStart = function() {
			$scope.showLoading = true;
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

		$scope.selectImage = function(_id) {
			close($scope.images[findImageIndex(_id)]);			
		};

		$scope.removeImage = function(_id) {
			if (confirm('Are you sure you want to permanently delete this file?')) {
				$scope.removeFile(_id);
			}
		};	

		$scope.removeFile = function(_id) {
			if ($scope.isDeleteInProgress) {
				return;
			}
			$scope.isDeleteInProgress = true;
			var imageIndex = findImageIndex(_id);
			var image = $scope.images[imageIndex];
			FilesService.remove(_id)
			.then(function(result) {
				$scope.isDeleteInProgress = false;
				try {
					$scope.images.splice(imageIndex, 1);
				} catch(err) {
					console.log(err);
					$scope.showErrorAlert('An error has occurred 01');
				}	
			})
			.catch(function(err) {
				$scope.isDeleteInProgress = false;
				$scope.showErrorAlert(err.data.title || 'An error has occurred');
			});			
		};

		var findImageIndex = function(_id) {
			var out = 0;
			for (var i = 0; i < $scope.images.length; i++) {
				if ($scope.images[i]._id === _id) {
					out = i;
					break;
				}
			}
			return out;
		};

		$scope.ok = function(e) {
			e.preventDefault();
			close({

			});
		};		

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();
		};		
	});	

}());

