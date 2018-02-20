(function () {

	angular.module('apollo').directive('uploadUi', function(ModalService) {
		return {
			templateUrl: 'views/directives/elements/upload-ui.html',
			restrict: 'E',
			scope: {
				image: '='
			},
			link: function(scope, element, attrs) {

				scope.uploadImage = function(e) {
					e.preventDefault();
					scope.openMediaGallery();
				};

				scope.openMediaGallery = function() {
				    ModalService.showModal({
				      	templateUrl: "views/modal/media-gallery.html",
				      	controller: "MediaGalleryCtrl"
				    }).then(function(modal) {
						modal.close.then(function(imageData) {
							if (!_.isNil(imageData)) {
								scope.image = imageData;
							}
						});
				    });					
				};

				scope.removeImage = function() {
					if (confirm('Are you sure you want to remove this image?')) {
						scope.image = {};
					}
				};			
			}			
		};
	});	

}());