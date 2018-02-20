(function () {

	angular.module('apollo').directive('jobListing', function(ModalService) {
		return {
			templateUrl: 'views/directives/elements/job-listing.html',
			restrict: 'E',
			scope: {
				job: '='
				// select: '&onSelect',
				// remove: '&onRemove',
			},
			link: function(scope, element, attrs) {

				var hoverUI = element.find('.job-listing-inner-background');
				var hoverUIMarker = element.find('.job-listing-marker');				

				// element.find('.image-media-ui').animate({
				// 	opacity: 1
				// }, 200);				

				element.hover(function(e) {
					hoverUI.animate({
						opacity: 1
					}, 200);
					hoverUIMarker.animate({
						opacity: 1
					}, 200);					
				}, function(e) {
					hoverUI.animate({
						opacity: 0
					}, 200);
					hoverUIMarker.animate({
						opacity: 0
					}, 200);					
				});

				element.click(function(e) {
					e.preventDefault();
  					var win = window.open(scope.job.url, '_blank');
  					win.focus();
				});
			}
		};
	});	

}());