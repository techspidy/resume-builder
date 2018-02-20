(function () {
   'use strict';
	angular.module('apollo').controller('SignInCtrl', function($scope, ModalService) {

		$scope.showModal = function() {
		    ModalService.showModal({
		      templateUrl: "admin/views/modal/signin.html",
		      controller: "SignInModalCtrl"
		    }).then(function(modal) {
		    });
		};
		$scope.showModal();
	});
}());

(function () {
   'use strict';
	angular.module('apollo').controller('SignInModalCtrl', function($scope, close, SignInService, AuthService) {
	   	
	   	$scope.error = false;
	   	$scope.isLoading = false;
	   	$scope.googleFirstLoad = Date.now();

	   	// google signin
		window.onGoogleSuccess = function(googleUser) {
			var seconds =  (Date.now() - $scope.googleFirstLoad)/1000;
			if (seconds < 2) {
				try {
					var auth2 = gapi.auth2.getAuthInstance();
						auth2.signOut().then(function () {
					});
				} catch (e) {}
				return;
			}
			var profile = googleUser.getBasicProfile();
			var id_token = googleUser.getAuthResponse().id_token;
			$scope.isLoading = true;
			SignInService.signIn('google', {
				oauth_token: id_token || '',
				userID: profile.getId(),
				userEmail: profile.getEmail()	   				
   			})
	   		.then(function(result) {
	   			$scope.isLoading = false;
	   			AuthService.logIn(result.data.data.token);	   			
	   		})
	   		.catch(function(error) {
	   			console.log(error);
	   			$scope.error = 'Error! - ' + error.statusText || 'An error has occurred.';
	   		});
		};

	   	// linkedin login
	   	$scope.getLinkedinUserProfileData = function() {
	   		$scope.isLoading = true;
	   		SignInService.getLinkedinProfile()
	   		.then(function(user) {
	   			return SignInService.signIn('linkedin', {
					oauth_token: IN.ENV.auth.oauth_token || '',
					userID: user.id,
					userEmail: user.emailAddress	   				
	   			});
	   		})
	   		.then(function(result) {
	   			$scope.isLoading = false;
	   			AuthService.logIn(result.data.data.token);	   			
	   		})
	   		.catch(function(error) {
	   			console.log(error);
	   			$scope.error = 'Error! - ' + error.statusText || 'An error has occurred.';
	   		});
	   	};

        window.linkedinOnUserAuthReceived = function() {
            $scope.getLinkedinUserProfileData();
        };

	    $scope.signInLinkedIn = function(e) {

	    	e.preventDefault();
			if (!window.linkedinJS_SDKLoaded) {
				alert('Linkedin library failed to load');
				return;
			}

			if (IN.ENV.auth.oauth_token !== '') {
			  $scope.getLinkedinUserProfileData();
			  return;
			}
			IN.User.authorize(linkedinOnUserAuthReceived);    
		};
		// end linkedin login

		// facebook signin
		$scope.signInFacebook = function(e) {
			e.preventDefault();
			FB.logout();
			 FB.login(function(r){
				SignInService.signIn('facebook', {
					oauth_token: r.authResponse.accessToken || '',
					userID: r.authResponse.userID	   				
				})
		   		.then(function(result) {
		   			$scope.isLoading = false;
		   			AuthService.logIn(result.data.data.token);	   			
		   		})
		   		.catch(function(error) {
		   			console.log(error);
		   			$scope.error = 'Error! - ' + error.statusText || 'An error has occurred.';
		   		});
			 }, {scope: 'public_profile, email'});
			 return;		
		};
		
	});
}());