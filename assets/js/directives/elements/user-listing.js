(function () {

	angular.module('apollo').directive('userListing', function(ModalService, UserListService) {
		return {
			templateUrl: 'views/directives/elements/user-listing.html',
			restrict: 'E',
			scope: {
				user: '='
			},
			link: function(scope, element, attrs) {

				scope.itemIsClose = true;
				scope.resumes = null;

				scope.openClose = function(e) {
					e.preventDefault();
					if (scope.itemIsClose) {
						scope.itemIsClose = false;
						if (_.isNil(scope.resumes)) {
							scope.resumes = [];
							UserListService.getResumesForUser(scope.user._id)
							.then(function(result) {
								if (_.isArray(result.data)) {
									scope.resumes = result.data;
								}
							})
							.catch(function(err) {
								console.log('Error ', err);
							});							
						}
					} else {
						scope.itemIsClose = true;
					}
				};
			}
		};
	});	

}());