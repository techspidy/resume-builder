(function () {

	angular.module('apollo').directive('templatePreview', function(ModalService) {
		return {
			templateUrl: 'views/directives/elements/template-preview.html',
			restrict: 'E',
			link: function(scope, element, attrs) {

				var hoverUI = element.find('.template-preview-hover');		

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