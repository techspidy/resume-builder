(function () {
   'use strict';
	angular.module('apollo').controller('MainCtrl', function($scope, UsersService, AuthService, $location, toastr) {
		
		$('#user_btn').click(function(e) {
			e.preventDefault();
			console.log('click');
			$('#dropdown_personal_acc').css('display', 'block');
			$('#dropdown_personal_acc').animate({
				opacity: 1
			}, 200);
		});

		$('#dropdown_personal_acc').hover(function(e) {

		}, function(e) {
			$('#dropdown_personal_acc').animate({
				opacity: 0
			}, 300, function() {
				$('#dropdown_personal_acc').css('display', 'none');
			});
		});		

		$scope.user = null;

		// retrieve user
		$scope.retrieveUser = function() {
			return UsersService.getContextUser()
			.then(function(user) {
				$scope.user = user;
			})
			.catch(function(err) {
				console.log(err);
			});
		};
		$scope.retrieveUser();

		// log out
		$scope.logout = function(e) {
			e.preventDefault();
			AuthService.logOut();
		};

		// handle active sections
		$scope.activeSection = '';
		$scope.getActiveSection = function(viewLocation, alternateLocation) {
			return viewLocation === $location.path() || alternateLocation === $location.path();
		};

		$scope.udateUserOptions = function(isSilent) {
			UsersService.updateOptions($scope.user.options, $scope.user._id)
			.then(function(result) {
				if (!isSilent) {
					toastr.success('Settings saved!');
				}				
				$scope.retrieveUser();
			})
			.catch(function(err) {
				if (err && err.data && err.data.title) {
					alert(err.data.title);
				} else {
					alert('Could not update options');
				}
			});
		};

		$scope.saveUserPermalink = function(permalink) {
			return UsersService.updatePermalink(permalink, $scope.user._id)
			.then(function(result) {
				toastr.success('Permalink updated!');				
			})
			.catch(function(err) {
				if (err && err.data && err.data.title) {
					alert(err.data.title);
				} else {
					alert('Could not update permalink, please try another one');
				}
			});
		};

		$scope.removeAccount = function() {
			//removeAccount
			return UsersService.removeAccount($scope.user._id)
			.then(function(result) {
				toastr.success('Account deleted!');	
				setTimeout(function() {
					AuthService.logOut();
				}, 2000);				
			})
			.catch(function(err) {
				alert('Error, a problem has occurred. Please contact the system administrator.');
			});
		};

	});
}());