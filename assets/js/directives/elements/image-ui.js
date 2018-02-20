(function () {

	angular.module('apollo').directive('imageUi', function(ModalService) {
		return {
			templateUrl: 'views/directives/elements/image-ui.html',
			restrict: 'E',
			scope: {
				image: '=',
				select: '&onSelect',
				remove: '&onRemove',
			},
			link: function(scope, element, attrs) {

				var hoverUI = element.find('.image-media-ui-hover-ui');

				element.find('.image-media-ui').animate({
					opacity: 1
				}, 200);				

				element.hover(function(e) {
					hoverUI.animate({
						opacity: 1
					}, 200);
				}, function(e) {
					hoverUI.animate({
						opacity: 0
					}, 200);
				});
			}
		};
	});	

}());