(function() {
'use strict';
	
	angular.module('apollo').service('TimeService', function() {

		var TimeService = {
			datepicker: function(delay) {
				if (delay) {
					setTimeout(function() {
						TimeService.initDatepicker();
					}, delay);
				}
			},
			initDatepicker:function() {
				$('.datepicker').pickadate({
					selectMonths: true,
					selectYears: 50,
					max: true
				});
			}
		};
		return TimeService;
	});

}());