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
	app.factory('ApolloIntercept',function(StorageService, $q) {  
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
	});

	app.config(function (localStorageServiceProvider, $routeProvider, $locationProvider, $httpProvider, $provide, toastrConfig, pickADateProvider) {

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

	});

	app.run(function($rootScope, $route) {
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
	});
	
}());