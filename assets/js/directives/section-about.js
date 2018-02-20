(function () {
   'use strict';
	angular.module('apollo').directive('sectionAbout', function($compile, ModalService, UtilsService) {
		return {
			templateUrl: 'views/directives/section-about.html',
			restrict: 'E',
			scope: {
				about: '='
			},
			link: function(scope, element, attrs) {	

				//scope.about.contacts = [1, 2, 3];
				scope.closeSection = function(e) {
					e.preventDefault();
					scope.about.opened = false;
				};

				scope.openSection = function(e) {
					e.preventDefault();
					scope.about.opened = true;
				};				

				scope.addContact = function(e) {
					e.preventDefault();
				    ModalService.showModal({
				      	templateUrl: "views/modal/new-contact.html",
				      	controller: "NewContactCtrl"
				    }).then(function(modal) {
						modal.close.then(function(contact) {
							if (!_.isNil(contact)) {
								if (_.isNil(scope.about.contacts)) {
									scope.about.contacts = [];
								}
								contact.ids = UtilsService.guid();
								scope.about.contacts.push(contact);
							}
						});
				    });						
				};

				scope.removeContact = function(e, contact) {
					e.preventDefault();					
					if (confirm('Are you sure you want to remove this entry?')) {
						if (!_.isNil(scope.about.contacts)) {
							scope.about.contacts.splice(scope.findSubSectionIndex(contact), 1);
						}						
						// scope.update();
					}
				};
				
				scope.findSubSectionIndex = function(contact) {
					var out = 0;
					for (var i = 0; i < scope.about.contacts.length; i++) {
						if (scope.about.contacts[i].ids === contact.ids) {
							out = i;
							break;
						}
					}
					return out;
				};

			}
		};

	});

}());

