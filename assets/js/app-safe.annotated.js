(function () {
   'use strict';
	var app = angular.module('apollo', [
		'angularModalService', 
		'LocalStorageModule', 
		'ngAnimate',
		'ngSanitize',
		'ngRoute',
		'720kb.tooltips',
		'ui.sortable',
		'textAngular',
		'toastr',
		'pickadate',
		'lr.upload'
		]);

	// interceptor
	app.factory('ApolloIntercept',["StorageService", "$q", function(StorageService, $q) {  
	    var httpInterceptor = {
	        request: function(config) {
	        	var token = StorageService.getToken();
	        	// console.log(token);
	            if (token !== null) {
	                config.headers['x-authorization'] = token;
	            }
	            return config;
	        },
	        responseError: function(response) {
	        	if (response.status == 403) {
	        		window.location.href = '/signin';
	        		return;
	        	}
	        	return $q.reject(response);
	        }        
	    };

	    return httpInterceptor;
	}]);

	app.config(["localStorageServiceProvider", "$routeProvider", "$locationProvider", "$httpProvider", "$provide", "toastrConfig", "pickADateProvider", function (localStorageServiceProvider, $routeProvider, $locationProvider, $httpProvider, $provide, toastrConfig, pickADateProvider) {

		pickADateProvider.setOptions({
			selectMonths: true,
			selectYears: 100,
			//format: 'd mmmm, yyyy',
			max: 50
		});

		localStorageServiceProvider.setPrefix('apollo');
		$httpProvider.interceptors.push('ApolloIntercept');
		
		if (window.location.pathname === '/signin' || window.location.pathname === '/signin/') {
			return;
		}
		$routeProvider
		.when('/', {
			templateUrl: 'views/sections/resumes.html',
			controller: 'ResumesCtrl',
			headerTitleSlug: 'resumes'
			// resolve: {
			// // I will cause a 1 second delay
			// delay: function($q, $timeout) {
			// 	var delay = $q.defer();
			// 	$timeout(delay.resolve, 1000);
			// 		return delay.promise;
			// 	}
			// }
		})
		.when('/resumes', {
			templateUrl: 'views/sections/resumes.html',
			controller: 'ResumesCtrl',
			headerTitleSlug: 'resumes'
		})
		.when('/resumes/:id', {
			templateUrl: 'views/sections/edit-resume.html',
			controller: 'EditResumesCtrl',
			headerTitleSlug: 'edit-resume'
		})
		// .when('/my-media', {
		// 	templateUrl: 'views/sections/my-media.html',
		// 	controller: 'MyMediaCtrl',
		// 	headerTitleSlug: 'my-media'
		// })	
		.when('/job-search', {
			templateUrl: 'views/sections/job-search.html',
			controller: 'JobSearchCtrl',
			headerTitleSlug: 'job-search'
		})		
		.when('/my-account', {
			templateUrl: 'views/sections/my-account.html',
			controller: 'MyAccountCtrl',
			headerTitleSlug: 'my-account'
		})
		.when('/admin-user-list', {
			templateUrl: 'views/sections/admin-user-list.html',
			controller: 'AdminUserListCtrl',
			headerTitleSlug: 'admin-user-list'
		});

		$locationProvider.html5Mode(true);

        $provide.decorator('taOptions', ['$delegate', function(taOptions){
            // $delegate is the taOptions we are decorating
            // here we override the default toolbars and classes specified in taOptions.
            taOptions.forceTextAngularSanitize = true; // set false to allow the textAngular-sanitize provider to be replaced
            taOptions.keyMappings = []; // allow customizable keyMappings for specialized key boards or languages
            taOptions.toolbar = [
                ['p', 'quote'],//pre
                ['bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear'],
                ['justifyLeft','justifyCenter','justifyRight'],
                ['insertImage', 'insertVideo', 'insertLink'] // html
            ];
            taOptions.classes = {
                focussed: 'focussed',
                toolbar: 'btn-toolbar',
                toolbarGroup: 'btn-group',
                toolbarButton: 'btn btn-default',
                toolbarButtonActive: 'active',
                disabled: 'disabled',
                textEditor: 'form-control',
                htmlEditor: 'form-control'
            };
            return taOptions; // whatever you return will be the taOptions
        }]);

		  angular.extend(toastrConfig, {
		    allowHtml: false,
		    closeButton: false,
		    closeHtml: '<button>&times;</button>',
		    extendedTimeOut: 1000,
		    iconClasses: {
		      error: 'toast-error',
		      info: 'toast-info',
		      success: 'toast-success',
		      warning: 'toast-warning'
		    },  
		    messageClass: 'toast-message',
		    onHidden: null,
		    onShown: null,
		    onTap: null,
		    progressBar: false,
		    tapToDismiss: true,
		    templates: {
		      toast: 'directives/toast/toast.html',
		      progressbar: 'directives/progressbar/progressbar.html'
		    },
		    timeOut: 4000,
		    titleClass: 'toast-title',
		    toastClass: 'toast'
		  });        		

	}]);

	app.run(["$rootScope", "$route", function($rootScope, $route) {
		$rootScope.$on("$routeChangeSuccess", function(currentRoute, previousRoute){
		    if (!_.isNil($route.current) && !_.isNil($route.current.headerTitleSlug)) {
		    	$rootScope.curentEditedResumeName = '';
		    	console.log('route change: ', $route.current.headerTitleSlug);
				switch($route.current.headerTitleSlug) {
				    case 'resumes':
				        $rootScope.headerTitle = '<i class="material-icons">edit</i>My resumes';
				        break;
				    case 'edit-resume':
				        $rootScope.headerTitle = '<i class="material-icons">edit</i>Edit resume';
				        break;
				    case 'my-account':
				        $rootScope.headerTitle = '<i class="fa fa-user-circle-o" aria-hidden="true"></i>My account';
				        break;
				    case 'my-media':
				        $rootScope.headerTitle = '<i class="fa fa-picture-o" aria-hidden="true"></i>Media';
				        break;				        
				    case 'job-search':
				        $rootScope.headerTitle = '<i class="material-icons">search</i>Job search';
				        break;
				    case 'admin-user-list':
				        $rootScope.headerTitle = '<i class="material-icons">search</i>Platform users';
				        break;
				}		    	
		    }
		});
	}]);
	
}());
(function () {
   'use strict';
	angular.module('apollo').controller('MainCtrl', ["$scope", "UsersService", "AuthService", "$location", "toastr", function($scope, UsersService, AuthService, $location, toastr) {
		
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

	}]);
}());
(function () {
   'use strict';
	angular.module('apollo').controller('ChooseTemplateCtrl', ["$scope", "close", "TemplatesService", function($scope, close, TemplatesService) {		
		
		$scope.templates = [];
		function getAll() {
			TemplatesService.getAll()
			.then(function(result) {
				console.log('templates result', result);
				$scope.templates = result.data;
			})
			.catch(function(err) {
				console.log('Error');
			});
		}
		getAll();

		$scope.useTemplate = function(template) {
			close(template);
		};

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();
		};		
	}]);	

}());


(function () {
   'use strict';
	// MediaGalleryCtrl modal controller
	angular.module('apollo').controller('MediaGalleryCtrl', ["$scope", "close", "ModalService", "FilesService", function($scope, close, ModalService, FilesService) {

		$scope.images = [];
		$scope.showLoading = false;

		$scope.getAllImages = function() {
			$scope.showLoading = true;
			FilesService.getAll()
			.then(function(result) {
				$scope.images = result.data;
				$scope.showLoading = false;
			})
			.catch(function(err) {
				$scope.showLoading = false;
				$scope.showErrorAlert(err.data.title || 'An error has occurred');
			});
		};
		$scope.getAllImages();

		$scope.onUploadSuccess = function(response) {
			$scope.images.unshift(response.data);
			$scope.showLoading = false;
			// console.log($scope.images);
		};

		$scope.onError = function(err) {
			$scope.showLoading = false;
			if (err && err.data) {
				$scope.showErrorAlert(err.data.title || 'An error has occurred');
			}
		};
		$scope.onUploadStart = function() {
			$scope.showLoading = true;
		};

		// show error alert
		$scope.showErrorAlert = function(errContent) {
		    ModalService.showModal({
		      	templateUrl: "views/modal/alert.html",
		      	controller: "AlertResumeCtrl",
		      	inputs: {
		      		errContent: errContent
		      	}	      
		    });
		};

		$scope.selectImage = function(_id) {
			close($scope.images[findImageIndex(_id)]);			
		};

		$scope.removeImage = function(_id) {
			if (confirm('Are you sure you want to permanently delete this file?')) {
				$scope.removeFile(_id);
			}
		};	

		$scope.removeFile = function(_id) {
			if ($scope.isDeleteInProgress) {
				return;
			}
			$scope.isDeleteInProgress = true;
			var imageIndex = findImageIndex(_id);
			var image = $scope.images[imageIndex];
			FilesService.remove(_id)
			.then(function(result) {
				$scope.isDeleteInProgress = false;
				try {
					$scope.images.splice(imageIndex, 1);
				} catch(err) {
					console.log(err);
					$scope.showErrorAlert('An error has occurred 01');
				}	
			})
			.catch(function(err) {
				$scope.isDeleteInProgress = false;
				$scope.showErrorAlert(err.data.title || 'An error has occurred');
			});			
		};

		var findImageIndex = function(_id) {
			var out = 0;
			for (var i = 0; i < $scope.images.length; i++) {
				if ($scope.images[i]._id === _id) {
					out = i;
					break;
				}
			}
			return out;
		};

		$scope.ok = function(e) {
			e.preventDefault();
			close({

			});
		};		

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();
		};		
	}]);	

}());


(function () {
   'use strict';
	angular.module('apollo').controller('NewContactCtrl', ["$scope", "close", function($scope, close) {		
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
	}]);	

}());

(function () {

	angular.module('apollo').directive('subsectionContacts', function() {
		return {
			templateUrl: 'views/directives/sub/sub-contacts.html',
			restrict: 'E'
		};
	});	

}());


(function () {
   'use strict';
	// NewResumeSectionCtrl modal controller
	angular.module('apollo').controller('NewResumeSectionCtrl', ["$scope", "close", function($scope, close) {		
		
		$scope.sections = [
			{
				icon: 'fa-file-text',
				label: 'Text section',
				slug: 'section-text',
				selected: true			
			},
			{
				icon: 'fa-graduation-cap',
				label: 'Education',
				slug: 'section-education'			
			},			
			{
				icon: 'fa-building',
				label: 'Work experience',
				slug: 'section-work'			
			},
			{
				icon: 'fa-comments',
				label: 'Languages',
				slug: 'section-languages'			
			},			
			{
				icon: 'fa-bar-chart',
				label: 'Skillset Bar',
				slug: 'section-skillset'			
			},			
			{
				icon: 'fa-briefcase',
				label: 'Portfolio',
				slug: 'section-portfolio'			
			},
			{
				icon: 'fa-heart',
				label: 'Interests',
				slug: 'section-interests'			
			},
			{
				icon: 'fa-file-image-o',
				label: 'Clients Logos',
				slug: 'section-logos'			
			},
			{
				icon: 'fa fa-user',
				label: 'References',
				slug: 'section-references'	
			},			
			{
				icon: 'fa fa-trophy',
				label: 'Awards',
				slug: 'section-awards'	
			},
			{
				icon: 'fa fa-certificate',
				label: 'Certifications',
				slug: 'section-certifications'	
			},
			{
				icon: 'fa fa-book',
				label: 'Publications',
				slug: 'section-publications'	
			}
		];
		//clients, social,

		// select item
		$scope.selectItem = function(slug) {
			for (var i = 0; i < $scope.sections.length; i++) {
				if (slug == $scope.sections[i].slug) {
					$scope.sections[i].selected = true;
				} else {
					$scope.sections[i].selected = false;
				}
			}
		};

		// get selected
		$scope.getSelected = function() {
			var selected = $scope.sections[0];
			for (var i = 0; i < $scope.sections.length; i++) {
				if ($scope.sections[i].selected === true) {
					selected = $scope.sections[i];
					break;
				}
			}
			return $scope.sections[i];
		};

		$scope.ok = function(e) {
			e.preventDefault();
			close($scope.getSelected());
		};

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();
		};		
	}]);	

}());


(function () {
   'use strict';
	angular.module('apollo').controller('MyAccountCtrl', ["$scope", "$routeParams", "$rootScope", "ModalService", "UtilsService", "toastr", function($scope, $routeParams, $rootScope, ModalService, UtilsService, toastr) {

		$scope.appHost = ApolloConf.host;
		//$scope.permalink = $scope.$parent.user.permalinkSlug;
		
		$scope.$parent.retrieveUser()
		.then(function() {
			$scope.permalink = $scope.$parent.user.permalinkSlug;
		});

		$scope.saveOptions = function(e) {
			e.preventDefault();
			$scope.$parent.udateUserOptions();
		};

		$scope.savePermalink = function(e) {
			e.preventDefault();
			if ($scope.permalink === '') {
				alert('Permalink can not be empty');
				return;
			}
			$scope.$parent.saveUserPermalink($scope.permalink)
			.then(function(result) {
				return $scope.$parent.retrieveUser();
			})
			.then(function() {
				$scope.permalink = $scope.$parent.user.permalinkSlug;
			});
		};

		$scope.removeAccount = function(e) {
			e.preventDefault();
			if (confirm('Are you sure you want to delete your account and all the data?')) {
				$scope.$parent.removeAccount();
			}
		};
		
	}]);

}());


(function () {
   'use strict';
	angular.module('apollo').controller('AdminUserListCtrl', ["$scope", "$routeParams", "$rootScope", "UserListService", function($scope, $routeParams, $rootScope, UserListService) {
			console.log('USERS controller ');

			$scope.page = 0;
			$scope.isSearching = false;
			$scope.users = [];
			$scope.totalUsers = 0;

			var getUsers = function() {
				UserListService.getUsers($scope.page)
				.then(function(result) {
					$scope.isSearching = false;
					$scope.totalUsers = result.data.no;
					if (result.data.data.length === 0) {
						$scope.allLoaded = true;
					}
					for (var i = 0; i < result.data.data.length; i++) {
						$scope.users.push(result.data.data[i]);
					}
				})
				.catch(function(err) {
					$scope.isSearching = false;
					console.log('Error, users list ', err);
				});
			};

			getUsers();

			$scope.loadMore = function(e) {
				e.preventDefault();
				$scope.page++;
				$scope.isSearching = true;
				getUsers();
			};	

	}]);

}());


(function () {
   'use strict';
	angular.module('apollo').controller('EditResumesCtrl', ["$scope", "$routeParams", "$rootScope", "ResumesService", "ModalService", "UtilsService", "toastr", "StorageService", function($scope, $routeParams, $rootScope, ResumesService, ModalService, UtilsService, toastr, StorageService) {
		// console.log($routeParams.id);
		$rootScope.curentEditedResumeName = 'test';

		$scope.resumeData = null;
		$scope.sections = null;
		$scope.resumeMeta = null;

		$scope.isUpdating = false;
		$scope.templateData = null;

		// setInterval(function() {
		// 	console.log($scope.sections);			
		// }, 6000);	

		// retrieve resume
		$scope.retriveResume = function() {
			ResumesService.getResume($routeParams.id)
			.then(function(response) {
				$scope.resumeData = response.data.data.attributes;
				$rootScope.curentEditedResumeName = ' / ' + $scope.resumeData.meta.name;
				$scope.sections = $scope.resumeData.sections || [];
				$scope.resumeMeta = $scope.resumeData.meta || {};
				$scope.templateData = $scope.resumeMeta.defaultTemplate;
				// console.log($scope.resumeMeta);			
			})
			.catch(function(err) {
				if (err && err.data) {
					$scope.showErrorAlert(err.data.title || 'An error has occurred');
				}
			});			
		};

		$scope.retriveResume();

		// show error alert
		$scope.showErrorAlert = function(errContent) {
		    ModalService.showModal({
		      	templateUrl: "views/modal/alert.html",
		      	controller: "AlertResumeCtrl",
		      	inputs: {
		      		errContent: errContent
		      	}	      
		    });
		};

		// launch new section modal
		$scope.newSection = function(e) {
			e.preventDefault();
		    ModalService.showModal({
		      	templateUrl: "views/modal/new-section.html",
		      	controller: "NewResumeSectionCtrl"
		    }).then(function(modal) {
				modal.close.then(function(newSection) {				
					if (newSection !== undefined || newSection !== null) {
						$scope.addNewSection(newSection);
						console.log('Add section: ', newSection);
					}
				});
		    });		
		};

		// choose template
		$scope.chooseTemplate = function(e) {
			e.preventDefault();
		    ModalService.showModal({
		      	templateUrl: "views/modal/choose-template.html",
		      	controller: "ChooseTemplateCtrl"
		    }).then(function(modal) {
				modal.close.then(function(template) {									
					if (!_.isNil(template)) {				
						if ($scope.templateData.slug !== template.slug) {
							$scope.templateData = template;
							$scope.saveSectionBroker(true);
						}
					}
				});
		    });				
		};

		// create new section
		$scope.addNewSection = function(newSectionData) {
			for (var i = 0; i < $scope.sections.length; i++) {
				$scope.sections[i].opened = false;
			}
			$scope.sections.push({
				ids: UtilsService.guid(),
				name: newSectionData.label,
				type: newSectionData.slug,
				icon: newSectionData.icon,
				opened: true
			});
			$scope.resumeData.meta.aboutSection.opened = false;
		};

		// remove section
		$scope.removeSectionData = function(ids) {
			for (var i = 0; i < $scope.sections.length; i++) {
				if ($scope.sections[i].ids === ids) {
					$scope.sections.splice(i, 1); 
					break;
				}
			}
		};

		// save section
		$scope.saveSection = function(e) {
			e.preventDefault();
			$scope.saveSectionBroker();
		};

		$scope.saveSectionBroker = function(isSiltent) {
			if ($scope.isUpdating) {
				return;
			}
			$scope.isUpdating = true;
			
			$scope.resumeMeta.defaultTemplate = $scope.templateData;

			ResumesService.updateResume($scope.resumeData._id, {
				sections: $scope.sections,
				meta: $scope.resumeMeta
			}).then(function(result) {
				$scope.isUpdating = false;
				if (!isSiltent) {
					toastr.success('Saved!');
				}				
			})
			.catch(function(err) {
				$scope.isUpdating = false;
				if (err && err.data) {
					$scope.showErrorAlert(err.data.title || 'An error has occurred');
				}
			});
		};

		$scope.exportDocument = function(e) {
			e.preventDefault();
		    ModalService.showModal({
		      	templateUrl: "views/modal/export-cv.html",
		      	controller: "ExportResumeCtrl",
				inputs: {
					userPermalinkSlug: $scope.$parent.user.permalinkSlug,
					resumePermalinkSlug: $scope.resumeData.permalinkSlug,
					token: StorageService.getToken()
				}		      
		    }).then(function(modal) {
				modal.close.then(function(formatModel) {
					if (!_.isNil(formatModel)) {
						// var win = window.open('/api/Exports/' + $scope.$parent.user.permalinkSlug + '/' + $scope.resumeData.permalinkSlug + '/' + formatModel + '/pdf?token=' + StorageService.getToken(), '_blank');
			  	// 		win.focus();
					}
				});
		    });
		};

		$scope.sortableOptions = {
			handle: '> div > .base-sortable-header',
			//update: function(e, ui) { ... },
			axis: 'y'
		};
		//'refresh'
	}]);

	// export resume controller
	angular.module('apollo').controller('ExportResumeCtrl', ["$scope", "close", "userPermalinkSlug", "resumePermalinkSlug", "token", function($scope, close, userPermalinkSlug, resumePermalinkSlug, token) {

		setTimeout(function() {
			$('select').material_select();
		}, 500);

		$scope.formatModel = 'no-format';
		$scope.printable = false;

		$scope.$watch('formatModel', function(newVal) {
			if (newVal === 'no-format') {
				$scope.printable = false;				
			} else {
				$scope.printable = true;
			}
		});
		
		$scope.export = function(e) {
			e.preventDefault();
			var win = window.open('/api/Exports/' + userPermalinkSlug + '/' + resumePermalinkSlug + '/' + $scope.formatModel + '/pdf?token=' + token, '_blank');
  			win.focus();
			close($scope.formatModel);
		};

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();			
		};
	}]);

}());


(function () {
   'use strict';
	angular.module('apollo').controller('JobSearchCtrl', ["$scope", "$routeParams", "$rootScope", "JobsCountriesService", "JobsService", function($scope, $routeParams, $rootScope, JobsCountriesService, JobsService) {
		
		var firstLoad = true;
		$scope.jobInput = '';
		$scope.page = 0;
		
		$scope.$parent.retrieveUser()
		.then(function() {
			$scope.indeedSelectedCountry = $scope.$parent.user.options.indeedSelectedCountry;
			$scope.countries = {
				model: $scope.indeedSelectedCountry,
				availableCountries: JobsCountriesService.getAll()
			};
			setTimeout(function() {
				$('select').material_select();
				retrieveJobs('all');
			}, 1000);			
		});		

		// country model change
		$scope.$watch('countries.model', function(newVal) {
			if (firstLoad === true) {
				firstLoad = false;
				return;
			}
			$scope.$parent.user.options.indeedSelectedCountry = newVal;
			$scope.$parent.udateUserOptions(true);
			if (isValidSearchInput()) {
				$scope.page = 0;
				$scope.isSearching = true;
				runQuery();
			} else {
				retrieveJobs('all');
			}
		});

		$scope.isSearching = false;
		var retrieveJobs = function(q) {	
			$scope.isSearching = true;
			var query = !_.isNil(q) ? q	: $scope.jobInput;	
			JobsService.getJobs(query, $scope.$parent.user.options.indeedSelectedCountry, $scope.page)
			.then(function(result) {
				$scope.isSearching = false;
				if ($scope.page === 0) {
					$scope.jobResults = result.data.results;
				} else {
					for (var i = 0; i < result.data.results.length; i++) {						
						$scope.jobResults.push(result.data.results[i]);
					}
				}
			})
			.catch(function(err) {
				$scope.isSearching = false;
				console.log(err);
			});
		};
 
		var runQuery = _.debounce(retrieveJobs, 1500);		

		// job input change
		$scope.$watch('jobInput', function(newVal) {
			if (!isValidSearchInput()) {
				return;
			}
			$scope.page = 0;
			$scope.isSearching = true;
			runQuery();
		});

		var isValidSearchInput = function() {
			if ($scope.jobInput.length < 3) {
				$scope.jobResults = [];
			}
			return $scope.jobInput.length > 2;
		};

		$scope.loadMore = function(e) {
			e.preventDefault();
			$scope.page++;
			var q = $scope.jobInput === '' ? 'all' : $scope.jobInput;
			retrieveJobs(q);
		};		

	}]);

}());


(function () {
   'use strict';
	angular.module('apollo').controller('MyMediaCtrl', ["$scope", "$routeParams", "$rootScope", function($scope, $routeParams, $rootScope) {
		console.log('media controller');		
	}]);

}());


(function () {
   'use strict';
	angular.module('apollo').controller('ResumesCtrl', ["$scope", "$location", "ModalService", "ResumesService", function($scope, $location, ModalService, ResumesService) {
		
		$scope.resumes = [];

		// get all
		$scope.getAll = function() {
			ResumesService.getAll()
			.then(function(result) {
				$scope.resumes = result.data;
			})
			.catch(function(err) {
				window.location.href = '/signin';
				console.log(err);
			});			
		};
		$scope.getAll();

		// create new
		$scope.createNew = function(e) {
			e.preventDefault();
		    ModalService.showModal({
		      templateUrl: "views/modal/new-cv.html",
		      controller: "NewResumeCtrl"
		    }).then(function(modal) {
				modal.close.then(function(name) {
					if (name !== undefined) {
						ResumesService.createResume(name)
						.then(function(result) {
							$scope.getAll();
						})
						.catch(function(err) {
							if (err && err.data) {
								$scope.showErrorAlert(err.data.title || 'An error has occurred');
							}
							console.log(err);
						});
					}
				});
		    });
		};

		// remove CV
		$scope.removeCV = function(id) {
		    ModalService.showModal({
		      	templateUrl: "views/modal/alert.html",
		      	controller: "RemoveResumeCtrl",
				inputs: {
				    id: id
				}		      
		    }).then(function(modal) {
				modal.close.then(function(id) {
					if (id !== undefined) {
						ResumesService.removeResume(id)
						.then(function(result) {
							$scope.getAll();
						})
						.catch(function(err) {
							if (err && err.data) {
								$scope.showErrorAlert(err.data.title || 'An error has occurred');
							}							
							console.log(err);
						});
					}
				});
		    });			
		};

		// clone CV
		$scope.cloneCV = function(id, name) {
		    ModalService.showModal({
		      	templateUrl: "views/modal/clone-cv.html",
		      	controller: "CloneResumeCtrl",
				inputs: {
				    name: name,
				    id: id
				}		      
		    }).then(function(modal) {
				modal.close.then(function(resume) {					
					if (resume !== undefined && resume.name !== undefined && resume.id !== undefined) {
						ResumesService.cloneResume(resume.id, resume.name)
						.then(function(result) {
							$scope.getAll();
						})
						.catch(function(err) {
							if (err && err.data) {
								$scope.showErrorAlert(err.data.title || 'An error has occurred');
							}							
							console.log(err);
						});
					}
				});
		    });
		};

		// show error alert
		$scope.showErrorAlert = function(errContent) {
		    ModalService.showModal({
		      	templateUrl: "views/modal/alert.html",
		      	controller: "AlertResumeCtrl",
		      	inputs: {
		      		errContent: errContent
		      	}	      
		    });
		};
	}]);

	// new resume controller
	angular.module('apollo').controller('NewResumeCtrl', ["$scope", "close", function($scope, close) {
		$scope.cvName = '';
		$scope.error = null;

		$scope.createNew = function(e) {
			e.preventDefault();
			if ($scope.cvName === '') {
				$scope.error = 'Please add a name!';
				return;
			}
			close($scope.cvName);
		};

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();			
		};
	}]);

	// remove resume controller
	angular.module('apollo').controller('RemoveResumeCtrl', ["$scope", "close", "id", function($scope, close, id) {
		$scope.alertTitle = 'Remove resume';
		$scope.alertMessage = 'Are you sure you want to remove this resume?';
		$scope.error = null;
		$scope.isConfirm = true;

		$scope.cancel = function(e) {
			e.preventDefault();
			close();
		};

		$scope.ok = function(e) {
			e.preventDefault();
			close(id);
		};

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();			
		};
	}]);	

	angular.module('apollo').controller('AlertResumeCtrl', ["$scope", "close", "errContent", function($scope, close, errContent) {
		$scope.alertTitle = 'Alert';
		$scope.alertMessage = errContent;
		$scope.error = null;
		$scope.isConfirm = false;

		$scope.ok = function(e) {
			e.preventDefault();
			close();
		};

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();			
		};	
	}]);	

	// clone controller
	angular.module('apollo').controller('CloneResumeCtrl', ["$scope", "close", "name", "id", function($scope, close, name, id) {
		$scope.cvName = name + ' - clone';
		$scope.error = null;

		$scope.clone = function(e) {
			e.preventDefault();
			if ($scope.cvName === '') {
				$scope.error = 'Please add a name!';
				return;
			}
			close({
				name: $scope.cvName,
				id: id
			});
		};

		$scope.closeModal = function(e) {
			e.preventDefault();
			close();			
		};
	}]);	

}());


(function () {
   'use strict';
	angular.module('apollo').controller('SignInCtrl', ["$scope", "ModalService", function($scope, ModalService) {

		$scope.showModal = function() {
		    ModalService.showModal({
		      templateUrl: "admin/views/modal/signin.html",
		      controller: "SignInModalCtrl"
		    }).then(function(modal) {
		    });
		};
		$scope.showModal();
	}]);
}());

(function () {
   'use strict';
	angular.module('apollo').controller('SignInModalCtrl', ["$scope", "close", "SignInService", "AuthService", function($scope, close, SignInService, AuthService) {
	   	
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
		
	}]);
}());
(function () {
   'use strict';
	angular.module('apollo').directive('baseSection', ["$compile", function($compile) {
		return {
			templateUrl: 'views/directives/base-section.html',
			restrict: 'A',
			scope: {
				section: '='
			},
			link: function(scope, element, attrs) {

				// create extended content
				var ui = element.find('.base-sortable-content-extended');
				ui.append('<' + scope.section.type + ' section="section" class="extended-section-directive"></' + scope.section.type + '');
				$compile(ui.contents())(scope);

				scope.removeSection = function(e) {
					e.preventDefault();					
					if (confirm('Are you sure you want to remove this section?')) {
						scope.$parent.removeSectionData(scope.section.ids);
					}
				};				

				scope.closeSection = function(e) {
					e.preventDefault();
					scope.section.opened = false;
				};

				scope.openSection = function(e) {
					e.preventDefault();
					scope.section.opened = true;
				};				
			}
		};

	}]);

}());


(function () {

	angular.module('apollo').directive('imageUi', ["ModalService", function(ModalService) {
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
	}]);	

}());
(function () {

	angular.module('apollo').directive('jobListing', ["ModalService", function(ModalService) {
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
	}]);	

}());
(function () {

	angular.module('apollo').directive('templatePreview', ["ModalService", function(ModalService) {
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
	}]);	

}());
(function () {

	angular.module('apollo').directive('uploadUi', ["ModalService", function(ModalService) {
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
	}]);	

}());
(function () {

	angular.module('apollo').directive('userListing', ["ModalService", "UserListService", function(ModalService, UserListService) {
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
	}]);	

}());
(function () {
   'use strict';
	angular.module('apollo').directive('sectionAbout', ["$compile", "ModalService", "UtilsService", function($compile, ModalService, UtilsService) {
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

	}]);

}());


(function () {

   'use strict';
	angular.module('apollo').directive('sectionAwards', ["UtilsService", function(UtilsService) {
		return {
			templateUrl: 'views/directives/section-awards.html',
			restrict: 'E',
			scope: {
				section: '='
			},
			link: function(scope, element, attrs) {

				scope.subsections = [];

				if (_.isNil(scope.section.subsections)) {
					scope.subsections = [];
				} else {
					scope.subsections = scope.section.subsections;
				}

				scope.newSubsection = function(e) {
					e.preventDefault();
					scope.subsections.unshift({
						ids: UtilsService.guid(),
						name: '',
						issuer: '',
						award_date: new Date(),
						award_url: '',
						about: '',				
						opened: true
					});
				};

				scope.$watch('subsections', function(newEntrie) {
					scope.section.subsections = scope.subsections;
				}, true);

				scope.removeSubSection = function(e, subsection) {
					e.preventDefault();					
					if (confirm('Are you sure you want to remove this entry?')) {
						scope.subsections.splice(scope.findSubSectionIndex(subsection), 1);
						scope.update();
					}
				};	

				scope.update = function() {
					scope.section.subsections = scope.subsections;
				};

				scope.closeSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = false;
				};

				scope.openSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = true;
				};

				scope.findSubSectionIndex = function(subsection) {
					var out = 0;
					for (var i = 0; i < scope.subsections.length; i++) {
						if (scope.subsections[i].ids === subsection.ids) {
							out = i;
							break;
						}
					}
					return out;
				};

			}
		};

	}]);

}());


(function () {

	angular.module('apollo').directive('subsectionAwards', function() {
		return {
			templateUrl: 'views/directives/sub/sub-awards.html',
			restrict: 'E'
		};
	});	

}());



(function () {

   'use strict';
	angular.module('apollo').directive('sectionCertifications', ["UtilsService", function(UtilsService) {
		return {
			templateUrl: 'views/directives/section-certifications.html',
			restrict: 'E',
			scope: {
				section: '='
			},
			link: function(scope, element, attrs) {

				scope.subsections = [];

				if (_.isNil(scope.section.subsections)) {
					scope.subsections = [];
				} else {
					scope.subsections = scope.section.subsections;
				}

				scope.newSubsection = function(e) {
					e.preventDefault();
					scope.subsections.unshift({
						ids: UtilsService.guid(),
						name: '',
						authority: '',
						certification_date: new Date(),
						certification_url: '',
						about: '',				
						opened: true
					});
				};

				scope.$watch('subsections', function(newEntrie) {
					scope.section.subsections = scope.subsections;
				}, true);

				scope.removeSubSection = function(e, subsection) {
					e.preventDefault();					
					if (confirm('Are you sure you want to remove this entry?')) {
						scope.subsections.splice(scope.findSubSectionIndex(subsection), 1);
						scope.update();
					}
				};	

				scope.update = function() {
					scope.section.subsections = scope.subsections;
				};

				scope.closeSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = false;
				};

				scope.openSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = true;
				};

				scope.findSubSectionIndex = function(subsection) {
					var out = 0;
					for (var i = 0; i < scope.subsections.length; i++) {
						if (scope.subsections[i].ids === subsection.ids) {
							out = i;
							break;
						}
					}
					return out;
				};

			}
		};

	}]);

}());


(function () {

	angular.module('apollo').directive('subsectionCertifications', function() {
		return {
			templateUrl: 'views/directives/sub/sub-certifications.html',
			restrict: 'E'
		};
	});	

}());



(function () {

   'use strict';
	angular.module('apollo').directive('sectionEducation', ["UtilsService", function(UtilsService) {
		return {
			templateUrl: 'views/directives/section-education.html',
			restrict: 'E',
			scope: {
				section: '='
			},
			link: function(scope, element, attrs) {

				scope.subsections = [];

				if (_.isNil(scope.section.subsections)) {
					scope.subsections = [];
				} else {
					scope.subsections = scope.section.subsections;
				}

				scope.newSubsection = function(e) {
					e.preventDefault();
					scope.subsections.unshift({
						ids: UtilsService.guid(),
						name: 'School name',
						speciality: '',
						start_time: new Date(),
						end_time: new Date(),
						end_time_present: false,
						opened: true
					});
				};

				scope.$watch('subsections', function(newEntrie) {
					scope.section.subsections = scope.subsections;
				}, true);

				scope.removeSubSection = function(e, subsection) {
					e.preventDefault();					
					if (confirm('Are you sure you want to remove this entry?')) {
						scope.subsections.splice(scope.findSubSectionIndex(subsection), 1);
						scope.update();
					}
				};	

				scope.update = function() {
					scope.section.subsections = scope.subsections;
				};

				scope.closeSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = false;
				};

				scope.openSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = true;
				};

				scope.findSubSectionIndex = function(subsection) {
					var out = 0;
					for (var i = 0; i < scope.subsections.length; i++) {
						if (scope.subsections[i].ids === subsection.ids) {
							out = i;
							break;
						}
					}
					return out;
				};

			}
		};

	}]);

}());


(function () {

	angular.module('apollo').directive('subsectionEducation', function() {
		return {
			templateUrl: 'views/directives/sub/sub-education.html',
			restrict: 'E'
		};
	});	

}());



(function () {

   'use strict';
	angular.module('apollo').directive('sectionInterests', ["UtilsService", function(UtilsService) {
		return {
			templateUrl: 'views/directives/section-hobby.html',
			restrict: 'E',
			scope: {
				section: '='
			},
			link: function(scope, element, attrs) {

				scope.section.hasShortDescription = true;
				scope.subsections = [];
				scope.hobby = null;

				if (_.isNil(scope.section.subsections)) {
					scope.subsections = [];
				} else {
					scope.subsections = scope.section.subsections;
				}

				scope.newSubsection = function(e) {
					e.preventDefault();
					if (_.isNil(scope.hobby)) {
						return;
					}					
					scope.subsections.push({
						ids: UtilsService.guid(),
						name: scope.hobby,
					});
					scope.hobby = null;
				};

				scope.$watch('subsections', function(newEntrie) {
					scope.section.subsections = scope.subsections;
				}, true);

				scope.removeSubSection = function(e, subsection) {
					e.preventDefault();					
					if (confirm('Are you sure you want to remove this entry?')) {
						scope.subsections.splice(scope.findSubSectionIndex(subsection), 1);
						scope.update();
					}
				};			

				scope.update = function() {
					scope.section.subsections = scope.subsections;
				};

				scope.closeSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = false;
				};

				scope.openSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = true;
				};

				scope.findSubSectionIndex = function(subsection) {
					var out = 0;
					for (var i = 0; i < scope.subsections.length; i++) {
						if (scope.subsections[i].ids === subsection.ids) {
							out = i;
							break;
						}
					}
					return out;
				};

			}
		};

	}]);

}());


(function () {

	angular.module('apollo').directive('subsectionInterests', function() {
		return {
			templateUrl: 'views/directives/sub/sub-interests.html',
			restrict: 'E'
		};
	});	

}());



(function () {

   'use strict';
	angular.module('apollo').directive('sectionLanguages', ["UtilsService", function(UtilsService) {
		return {
			templateUrl: 'views/directives/section-languages.html',
			restrict: 'E',
			scope: {
				section: '='
			},
			link: function(scope, element, attrs) {
				
				scope.section.hasShortDescription = true;
				scope.subsections = [];

				if (_.isNil(scope.section.subsections)) {
					scope.subsections = [];
				} else {
					scope.subsections = scope.section.subsections;
				}

				scope.newSubsection = function(e) {
					e.preventDefault();
					scope.subsections.unshift({
						ids: UtilsService.guid(),
						name: '',
						proficiency: 50,
						opened: true
					});
				};

				scope.$watch('subsections', function(newEntrie) {
					scope.section.subsections = scope.subsections;
				}, true);

				scope.removeSubSection = function(e, subsection) {
					e.preventDefault();					
					if (confirm('Are you sure you want to remove this entry?')) {
						scope.subsections.splice(scope.findSubSectionIndex(subsection), 1);
						scope.update();
					}
				};				

				scope.closeSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = false;
				};

				scope.openSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = true;
				};

				scope.findSubSectionIndex = function(subsection) {
					var out = 0;
					for (var i = 0; i < scope.subsections.length; i++) {
						if (scope.subsections[i].ids === subsection.ids) {
							out = i;
							break;
						}
					}
					return out;
				};

			}
		};

	}]);

}());


(function () {

	angular.module('apollo').directive('subsectionLanguages', function() {
		return {
			templateUrl: 'views/directives/sub/sub-languages.html',
			restrict: 'E'
		};
	});	

}());



(function () {

   'use strict';
	angular.module('apollo').directive('sectionLogos', ["UtilsService", function(UtilsService) {
		return {
			templateUrl: 'views/directives/section-logos.html',
			restrict: 'E',
			scope: {
				section: '='
			},
			link: function(scope, element, attrs) {

				scope.section.hasShortDescription = true;
				scope.subsections = [];

				if (_.isNil(scope.section.subsections)) {
					scope.subsections = [];
				} else {
					scope.subsections = scope.section.subsections;
				}

				scope.newSubsection = function(e) {
					e.preventDefault();
					scope.subsections.unshift({
						ids: UtilsService.guid(),
						name: '',
						image: {},						
						url: '',
						opened: true
					});
				};

				scope.$watch('subsections', function(newEntrie) {
					scope.section.subsections = scope.subsections;
				}, true);

				scope.removeSubSection = function(e, subsection) {
					e.preventDefault();					
					if (confirm('Are you sure you want to remove this entry?')) {
						scope.subsections.splice(scope.findSubSectionIndex(subsection), 1);
						scope.update();
					}
				};

				scope.update = function() {
					scope.section.subsections = scope.subsections;
				};				

				scope.closeSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = false;
				};

				scope.openSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = true;
				};

				scope.findSubSectionIndex = function(subsection) {
					var out = 0;
					for (var i = 0; i < scope.subsections.length; i++) {
						if (scope.subsections[i].ids === subsection.ids) {
							out = i;
							break;
						}
					}
					return out;
				};

			}
		};

	}]);

}());


(function () {

	angular.module('apollo').directive('subsectionLogos', function() {
		return {
			templateUrl: 'views/directives/sub/sub-logos.html',
			restrict: 'E'
		};
	});	

}());



(function () {

   'use strict';
	angular.module('apollo').directive('sectionPortfolio', ["UtilsService", function(UtilsService) {
		return {
			templateUrl: 'views/directives/section-portfolio.html',
			restrict: 'E',
			scope: {
				section: '='
			},
			link: function(scope, element, attrs) {

				scope.subsections = [];

				if (_.isNil(scope.section.subsections)) {
					scope.subsections = [];
				} else {
					scope.subsections = scope.section.subsections;
				}

				scope.newSubsection = function(e) {
					e.preventDefault();
					scope.subsections.unshift({
						ids: UtilsService.guid(),
						name: '',
						url: '',
						image: {},
						about: '',
						opened: true
					});
				};

				scope.$watch('subsections', function(newEntrie) {
					scope.section.subsections = scope.subsections;
				}, true);

				scope.removeSubSection = function(e, subsection) {
					e.preventDefault();					
					if (confirm('Are you sure you want to remove this entry?')) {
						scope.subsections.splice(scope.findSubSectionIndex(subsection), 1);
						scope.update();
					}
				};

				scope.update = function() {
					scope.section.subsections = scope.subsections;
				};				

				scope.closeSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = false;
				};

				scope.openSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = true;
				};

				scope.findSubSectionIndex = function(subsection) {
					var out = 0;
					for (var i = 0; i < scope.subsections.length; i++) {
						if (scope.subsections[i].ids === subsection.ids) {
							out = i;
							break;
						}
					}
					return out;
				};

			}
		};

	}]);

}());


(function () {

	angular.module('apollo').directive('subsectionPortfolio', function() {
		return {
			templateUrl: 'views/directives/sub/sub-portfolio.html',
			restrict: 'E'
		};
	});	

}());



(function () {

   'use strict';
	angular.module('apollo').directive('sectionPublications', ["UtilsService", function(UtilsService) {
		return {
			templateUrl: 'views/directives/section-publication.html',
			restrict: 'E',
			scope: {
				section: '='
			},
			link: function(scope, element, attrs) {

				scope.subsections = [];

				if (_.isNil(scope.section.subsections)) {
					scope.subsections = [];
				} else {
					scope.subsections = scope.section.subsections;
				}

				scope.newSubsection = function(e) {
					e.preventDefault();
					scope.subsections.unshift({
						ids: UtilsService.guid(),
						name: 'Title',
						publisher: '',
						publication_date: new Date(),
						publication_url: '',
						about: '',				
						opened: true
					});
				};

				scope.$watch('subsections', function(newEntrie) {
					scope.section.subsections = scope.subsections;
				}, true);

				scope.removeSubSection = function(e, subsection) {
					e.preventDefault();					
					if (confirm('Are you sure you want to remove this entry?')) {
						scope.subsections.splice(scope.findSubSectionIndex(subsection), 1);
						scope.update();
					}
				};	

				scope.update = function() {
					scope.section.subsections = scope.subsections;
				};

				scope.closeSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = false;
				};

				scope.openSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = true;
				};

				scope.findSubSectionIndex = function(subsection) {
					var out = 0;
					for (var i = 0; i < scope.subsections.length; i++) {
						if (scope.subsections[i].ids === subsection.ids) {
							out = i;
							break;
						}
					}
					return out;
				};

			}
		};

	}]);

}());


(function () {

	angular.module('apollo').directive('subsectionPublication', function() {
		return {
			templateUrl: 'views/directives/sub/sub-publication.html',
			restrict: 'E'
		};
	});	

}());



(function () {

   'use strict';
	angular.module('apollo').directive('sectionReferences', ["UtilsService", function(UtilsService) {
		return {
			templateUrl: 'views/directives/section-references.html',
			restrict: 'E',
			scope: {
				section: '='
			},
			link: function(scope, element, attrs) {

				scope.subsections = [];

				if (_.isNil(scope.section.subsections)) {
					scope.subsections = [];
				} else {
					scope.subsections = scope.section.subsections;
				}

				scope.newSubsection = function(e) {
					e.preventDefault();
					scope.subsections.unshift({
						ids: UtilsService.guid(),
						company: '',
						person_name: '',
						contact: '',
						about: '',			
						opened: true
					});
				};

				scope.$watch('subsections', function(newEntrie) {
					scope.section.subsections = scope.subsections;
				}, true);

				scope.removeSubSection = function(e, subsection) {
					e.preventDefault();					
					if (confirm('Are you sure you want to remove this entry?')) {
						scope.subsections.splice(scope.findSubSectionIndex(subsection), 1);
						scope.update();
					}
				};

				scope.update = function() {
					scope.section.subsections = scope.subsections;
				};

				scope.closeSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = false;
				};

				scope.openSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = true;
				};

				scope.findSubSectionIndex = function(subsection) {
					var out = 0;
					for (var i = 0; i < scope.subsections.length; i++) {
						if (scope.subsections[i].ids === subsection.ids) {
							out = i;
							break;
						}
					}
					return out;
				};

			}
		};

	}]);

}());


(function () {

	angular.module('apollo').directive('subsectionReferences', function() {
		return {
			templateUrl: 'views/directives/sub/sub-references.html',
			restrict: 'E'
		};
	});	

}());



(function () {

   'use strict';
	angular.module('apollo').directive('sectionSkillset', ["UtilsService", function(UtilsService) {
		return {
			templateUrl: 'views/directives/section-skillset.html',
			restrict: 'E',
			scope: {
				section: '='
			},
			link: function(scope, element, attrs) {

				scope.section.hasShortDescription = true;
				scope.subsections = [];

				if (_.isNil(scope.section.subsections)) {
					scope.subsections = [];
				} else {
					scope.subsections = scope.section.subsections;
				}

				scope.newSubsection = function(e) {
					e.preventDefault();
					scope.subsections.unshift({
						ids: UtilsService.guid(),
						name: '',
						proficiency: 50,
						opened: true
					});
				};

				scope.$watch('subsections', function(newEntrie) {
					scope.section.subsections = scope.subsections;
				}, true);

				scope.removeSubSection = function(e, subsection) {
					e.preventDefault();					
					if (confirm('Are you sure you want to remove this entry?')) {
						scope.subsections.splice(scope.findSubSectionIndex(subsection), 1);
						scope.update();
					}
				};

				scope.update = function() {
					scope.section.subsections = scope.subsections;
				};

				scope.closeSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = false;
				};

				scope.openSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = true;
				};

				scope.findSubSectionIndex = function(subsection) {
					var out = 0;
					for (var i = 0; i < scope.subsections.length; i++) {
						if (scope.subsections[i].ids === subsection.ids) {
							out = i;
							break;
						}
					}
					return out;
				};

			}
		};

	}]);

}());


(function () {

	angular.module('apollo').directive('subsectionSkillset', function() {
		return {
			templateUrl: 'views/directives/sub/sub-skillset.html',
			restrict: 'E'
		};
	});	

}());



(function () {

   'use strict';
	angular.module('apollo').directive('sectionText', function() {
		return {
			templateUrl: 'views/directives/section-text.html',
			restrict: 'E',
			scope: {
				section: '='
			},
			link: function(scope, element, attrs) {
				if (_.isNil(scope.section.about)) {
					scope.section.about = '';
				}
			}
		};

	});	

}());


(function () {

   'use strict';
	angular.module('apollo').directive('sectionWork', ["UtilsService", function(UtilsService) {
		return {
			templateUrl: 'views/directives/section-work.html',
			restrict: 'E',
			scope: {
				section: '='
			},
			link: function(scope, element, attrs) {

				scope.subsections = [];

				if (_.isNil(scope.section.subsections)) {
					scope.subsections = [];
				} else {
					scope.subsections = scope.section.subsections;
				}

				scope.newSubsection = function(e) {
					e.preventDefault();
					scope.subsections.unshift({
						ids: UtilsService.guid(),
						name: 'Company name',
						position: '',
						start_time: new Date(),
						end_time: new Date(),
						end_time_present: false,
						about: '',
						company_url: '',
						opened: true
					});
				};

				scope.$watch('subsections', function(newEntrie) {
					scope.section.subsections = scope.subsections;
				}, true);

				scope.removeSubSection = function(e, subsection) {
					e.preventDefault();					
					if (confirm('Are you sure you want to remove this entry?')) {
						scope.subsections.splice(scope.findSubSectionIndex(subsection), 1);
						scope.update();
					}
				};

				scope.update = function() {
					scope.section.subsections = scope.subsections;
				};				

				scope.closeSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = false;
				};

				scope.openSubSection = function(e, subsection) {
					e.preventDefault();
					scope.subsections[scope.findSubSectionIndex(subsection)].opened = true;
				};

				scope.findSubSectionIndex = function(subsection) {
					var out = 0;
					for (var i = 0; i < scope.subsections.length; i++) {
						if (scope.subsections[i].ids === subsection.ids) {
							out = i;
							break;
						}
					}
					return out;
				};

			}
		};

	}]);

}());


(function () {

	angular.module('apollo').directive('subsectionWork', function() {
		return {
			templateUrl: 'views/directives/sub/sub-work.html',
			restrict: 'E'
		};
	});	

}());



(function() {
'use strict';
	
	angular.module('apollo').service('AuthService', ["StorageService", function(StorageService) {		
		return {
			logIn: function(token) {
				StorageService.setToken(token);
				window.location.href = '/admin';
			},
			logOut: function() {
				StorageService.removeToken();
				window.location.href = '/signin';
			}
		};
	}]);

}());
(function() {
'use strict';
	
	angular.module('apollo').service('FilesService', ["$q", "$http", function($q, $http) {

		return {
			getAll: function() {
				return $http.get('/api/Files');
			},

			remove: function(_id) {
				return $http.delete('/api/Files/' + _id);
			} 
		};
	}]);

}());
(function() {
'use strict';
	
	angular.module('apollo').service('JobsCountriesService', ["$q", "$http", function($q, $http) {

		return {
			getAll: function() {
				return [
					{ countryCode: 'aq', countryLabel: 'Antarctica' },
					{ countryCode: 'ar', countryLabel: 'Argentina' },
					{ countryCode: 'au', countryLabel: 'Australia' },
					{ countryCode: 'at', countryLabel: 'Austria' },
					{ countryCode: 'bh', countryLabel: 'Bahrain' },
					{ countryCode: 'be', countryLabel: 'Belgium' },
					{ countryCode: 'br', countryLabel: 'Brazil' },
					{ countryCode: 'ca', countryLabel: 'Canada' },
					{ countryCode: 'cl', countryLabel: 'Chile' },
					{ countryCode: 'cn', countryLabel: 'China' },
					{ countryCode: 'co', countryLabel: 'Colombia' },
					{ countryCode: 'cr', countryLabel: 'Costa Rica' },
					{ countryCode: 'cz', countryLabel: 'Czech Republic' },
					{ countryCode: 'dk', countryLabel: 'Denmark' },
					{ countryCode: 'ec', countryLabel: 'Ecuador' },
					{ countryCode: 'eg', countryLabel: 'Egypt' },
					{ countryCode: 'fi', countryLabel: 'Finland' },
					{ countryCode: 'fr', countryLabel: 'France' },
					{ countryCode: 'de', countryLabel: 'Germany' },
					{ countryCode: 'gr', countryLabel: 'Greece' },
					{ countryCode: 'hk', countryLabel: 'Hong Kong' },
					{ countryCode: 'hu', countryLabel: 'Hungary' },
					{ countryCode: 'in', countryLabel: 'India' },
					{ countryCode: 'id', countryLabel: 'Indonesia' },
					{ countryCode: 'ie', countryLabel: 'Ireland' },
					{ countryCode: 'il', countryLabel: 'Israel' },
					{ countryCode: 'it', countryLabel: 'Italy' },
					{ countryCode: 'jp', countryLabel: 'Japan' },
					{ countryCode: 'kw', countryLabel: 'Kuwait' },
					{ countryCode: 'lu', countryLabel: 'Luxembourg' },
					{ countryCode: 'my', countryLabel: 'Malaysia' },
					{ countryCode: 'mx', countryLabel: 'Mexico' },
					{ countryCode: 'ma', countryLabel: 'Morocco' },
					{ countryCode: 'nl', countryLabel: 'Netherlands' },
					{ countryCode: 'nz', countryLabel: 'New Zealand' },
					{ countryCode: 'ng', countryLabel: 'Nigeria' },
					{ countryCode: 'no', countryLabel: 'Norway' },
					{ countryCode: 'om', countryLabel: 'Oman' },
					{ countryCode: 'pk', countryLabel: 'Pakistan' },
					{ countryCode: 'pa', countryLabel: 'Panama' },
					{ countryCode: 'pe', countryLabel: 'Peru' },
					{ countryCode: 'ph', countryLabel: 'Philippines' },
					{ countryCode: 'pl', countryLabel: 'Poland' },
					{ countryCode: 'pt', countryLabel: 'Portugal' },
					{ countryCode: 'qa', countryLabel: 'Qatar' },
					{ countryCode: 'ro', countryLabel: 'Romania' },
					{ countryCode: 'ru', countryLabel: 'Russia' },
					{ countryCode: 'sa', countryLabel: 'Saudi Arabia' },
					{ countryCode: 'sg', countryLabel: 'Singapore' },
					{ countryCode: 'za', countryLabel: 'South Africa' },
					{ countryCode: 'kr', countryLabel: 'South Korea' },
					{ countryCode: 'es', countryLabel: 'Spain' },
					{ countryCode: 'se', countryLabel: 'Sweden' },
					{ countryCode: 'ch', countryLabel: 'Switzerland' },
					{ countryCode: 'tw', countryLabel: 'Taiwan' },
					{ countryCode: 'th', countryLabel: 'Thailand' },
					{ countryCode: 'tr', countryLabel: 'Turkey' },
					{ countryCode: 'ua', countryLabel: 'Ukraine' },
					{ countryCode: 'ae', countryLabel: 'United Arab Emirates' },
					{ countryCode: 'gb', countryLabel: 'United Kingdom' },
					{ countryCode: 'us', countryLabel: 'United States' },
					{ countryCode: 'uy', countryLabel: 'Uruguay' },
					{ countryCode: 've', countryLabel: 'Venezuela' },
					{ countryCode: 'vn', countryLabel: 'Vietnam' } 
				];
				
			},
		};
	}]);

}());
(function() {
'use strict';
	
	angular.module('apollo').service('JobsService', ["$http", function($http) {		
		return {
			getJobs: function(query, country, page) {
				//provider/:country/:page/:limit/:query
				var limit = 10;
				// var page = 0;
				return $http.get('/api/Jobs/ind/' + country + '/' + page + '/' + limit + '/' + encodeURIComponent(query));
			}
		};
	}]);

}());
(function() {
'use strict';
	
	angular.module('apollo').service('ResumesService', ["$q", "$http", function($q, $http) {

		return {
			createResume: function(resumeName) {
				return $http.post('/api/Resumes', {
					resumeName: resumeName
				});
			},
			cloneResume: function(id, newName) {
				return $http.post('/api/Resumes/clone', {
					id: id,
					newName: newName
				});
			},
			removeResume: function(id) {
				return $http.delete('/api/Resumes/' + id);
			},
			getAll: function() {
				return $http.get('/api/Resumes');
			},
			getResume: function(id) {
				return $http.get('/api/Resumes/' + id);
			},
			updateResume: function(id, resume) {
				return $http.put('/api/Resumes/' + id, {
					resume: resume
				});
			}
		};
	}]);

}());
(function() {
'use strict';
	
	angular.module('apollo').service('SignInService', ["$q", "$http", function($q, $http) {

		return {
			getLinkedinProfile: function() {
				return $q(function(resolve, reject) {
					IN.API.Raw("/people/~:(id,firstName,lastName,emailAddress,picture-url)?format=json")
					.result(resolve)
					.error(reject);
				});
			},
			signIn: function(strategy, data) {
				data.strategy = strategy;
				return $http.put('/api/Users', data);
			}
		};
	}]);

}());
(function() {
'use strict';
	
	angular.module('apollo').service('StorageService', ["localStorageService", function(localStorageService) {

		var ACCESS_TOKEN_KEY = 'accessToken';
		var USER_KEY = 'apollo-user';
		return {
			setToken: function(token) {
				return localStorageService.set(ACCESS_TOKEN_KEY, token);
			},
			getToken: function() {
				return localStorageService.get(ACCESS_TOKEN_KEY);
			},
			removeToken: function() {
				return localStorageService.remove(ACCESS_TOKEN_KEY);
			},
			setUser: function(user) {
				return localStorageService.set(USER_KEY, user);	
			},
			getUser: function(user) {
				return localStorageService.get(USER_KEY);	
			}			
		};
	}]);

}());
(function() {
'use strict';
	
	angular.module('apollo').service('TemplatesService', ["$q", "$http", function($q, $http) {

		return {
			getAll: function() {
				return $http.get('/api/Templates');
			}
		};
	}]);

}());
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
(function() {
'use strict';
	
	angular.module('apollo').service('UserListService', ["$http", function($http) {		
		return {
			getUsers: function(page) {
				var limit = 25;
				return $http.get('/api/Users/?page=' + encodeURIComponent(page) + '&limit=' + limit);
			},

			getResumesForUser: function(userId) {
				return $http.get('/api/Resumes/resumes-for-user/' + userId);	
			}
		};
	}]);

}());
(function() {
'use strict';
	
	angular.module('apollo').service('UsersService', ["$q", "$http", "StorageService", function($q, $http, StorageService) {

		return {
			getContextUser: function(userId) {
				return $q(function(resolve, reject) {
					$http.get('/api/Users/1')
					.then(function(user) {
						StorageService.setUser(user.data.data.attributes);
						resolve(user.data.data.attributes);
					})
					.catch(reject);
				});
			},

			// update user options
			updateOptions: function(options, userID) {
				return $q(function(resolve, reject) {
					$http.put('/api/Users/' + userID + '/options', {
						options: options
					})
					.then(function(result) {
						resolve(result);
					})
					.catch(reject);
				});
			},

			// update user permalink
			updatePermalink: function(permalink, userID) {
				return $q(function(resolve, reject) {
					$http.put('/api/Users/' + userID + '/permalink', {
						permalink: permalink
					})
					.then(function(result) {
						resolve(result);
					})
					.catch(reject);
				});
			},

			// remove user account
			removeAccount: function(userID) {
				return $q(function(resolve, reject) {
					$http.delete('/api/Users/' + userID)
					.then(function(result) {
						resolve(result);
					})
					.catch(reject);
				});
			}

		};
	}]);

}());
(function() {
'use strict';
	
	angular.module('apollo').service('UtilsService', function() {

		return {
			guid: function() {
			    var d = new Date().getTime();
			    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
			        d += performance.now(); //use high-precision timer if available
			    }
			    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			        var r = (d + Math.random() * 16) % 16 | 0;
			        d = Math.floor(d / 16);
			        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
			    });
			}
		};
	});

}());