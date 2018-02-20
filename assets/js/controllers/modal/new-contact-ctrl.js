(function () {
   'use strict';
	angular.module('apollo').controller('NewContactCtrl', function($scope, close) {		
		$scope.contactsLeft = [
			{
				icon: 'fa fa-phone',
				label: '',
				type: 'phone',
				value: '',
				placeholder: 'Phone number'
			},
			{
				icon: 'fa fa-envelope',
				label: '',
				type: 'email',
				value: '',
				placeholder: 'Email'
			},
			{
				icon: 'fa fa-map-marker', // icon: 'fa fa-address-card'
				label: '',
				type: 'address',
				value: '',
				placeholder: 'address'
			},
			{
				icon: 'fa fa-github',
				label: '',
				type: 'github',
				value: '',
				placeholder: 'Github profile url'
			},
			{
				icon: 'fa fa-stack-overflow',
				label: '',
				type: 'stack-overflow',
				value: '',
				placeholder: 'StackOverflow url'
			},
			{
				icon: 'fa fa-behance',
				label: '',
				type: 'behance',
				value: '',
				placeholder: 'Behance url'
			}
		];

		$scope.contactsRight = [
			{
				icon: 'fa fa-facebook-official',
				label: '',
				type: 'facebook',
				value: '',
				placeholder: 'Facebook url'
			},
			{
				icon: 'fa fa-linkedin-square',
				label: '',
				type: 'linkedin',
				value: '',
				placeholder: 'Linkedin url'
			},
			{
				icon: 'fa fa-twitter',
				label: '',
				type: 'twitter',
				value: '',
				placeholder: 'Twitter url'
			},
			{
				icon: 'fa fa-youtube',
				label: '',
				type: 'youtube',
				value: '',
				placeholder: 'Youtube url'
			},
			{
				icon: 'fa fa-dribbble',
				label: '',
				type: 'dribbble',
				value: '',
				placeholder: 'Dribbble url'
			}
		];		
		//clients, social,

		$scope.addItem = function(contact) {
			console.log(contact);
			if (_.isNil(contact.value) || contact.value ==='') {
				alert('Please insert a value!');
				return;
			}
			close({
				icon: contact.icon,
				value: contact.value,
				type: contact.type
			});
		};

		$scope.ok = function(e) {
			e.preventDefault();
			//close($scope.getSelected());
		};

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();
		};		
	});	

}());

(function () {

	angular.module('apollo').directive('subsectionContacts', function() {
		return {
			templateUrl: 'views/directives/sub/sub-contacts.html',
			restrict: 'E'
		};
	});	

}());

