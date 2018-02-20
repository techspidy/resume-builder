/* jshint node: true */
'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: ['./assets/js/app-safe.js', './assets/js/app-safe.annotated.js'],

		// cssUrlEmbed: {
		//   encodeDirectly: {
		//     files: {
		//       'files/icons.css': ['files/font-icons/style.css']
		//     }
		//   }
		// },	

		jshint: {
			backend: ['Gruntfile.js', 'assets/js/**/*.js'],
			options: {
				esversion: 6
			}
		},

		// copy files
		copy: {
		  materialize: {
		    files: [
		      // copy libs
		      { expand: true, cwd: 'assets/materialize/', src: ['**'], dest: 'public/admin/materialize' }
		    ],		  	
		  },		  
		  libs: {
		    files: [
		      // copy libs
		      { expand: true, cwd: 'assets/libs/', src: ['**'], dest: 'public/admin/libs' }
		    ],		  	
		  },
		  views: {
		    files: [
		      // copy libs
		      { expand: true, cwd: 'assets/views/', src: ['**'], dest: 'public/admin/views' }
		    ],		  	
		  },		  
		  img: {
		    files: [
		      // copy imgs
		      { expand: true, cwd: 'assets/img/', src: ['**'], dest: 'public/admin/img' }
		    ],		  	
		  },	
		  templates: {
		    files: [
		      // copy libs
		      { expand: true, cwd: 'assets/templates/', src: ['**'], dest: 'static-files/templates' }
		    ],		  	
		  }
		},

		// concat
		concat: {
		    js: { //target
		        src: ['./assets/js/**/*.js', '!./assets/js/app-safe.js'],
		        dest: './assets/js/app-safe.js'
		        // dest: './public/js/app.js'
		    }
		},

		cssmin: {
		  options: {
		    shorthandCompacting: false,
		    roundingPrecision: -1
		  },
		  target: {
		    files: {
		      './public/admin/css/main.css': ['./assets/css/**/*.css']
		    }
		  }
		},		

		uglify: {
		    js: { //target
		        src: ['./assets/js/app-safe.annotated.js'],
		        dest: './public/admin/js/app.js'
		    }
		},

		ngAnnotate: {
		    dist: {
		        files: [{
		                expand: true,
		                src: ['assets/js/app-safe.js', '!assets/js/app-safe.annotated.js'],
		                ext: '.annotated.js',
		                extDot: 'last'
		            }],
		    }
		},
		
		/*
		bower_concat: {
		  all: {
		    dest: {
		      'js': 'public/js/bower.js',
		      'css': 'public/css/bower.css'
		    },
		    bowerOptions: {
		      relative: false
		    }
		  }
		},*/

		watch: {
		  scripts: {
		    files: ['assets/js/**/*.js', 'assets/css/**/*.css', 'files/**/*.css', 'assets/views/**/*.html', 
		    'assets/templates/**/*.css', 'assets/templates/**/*.js'],
		    tasks: ['clean', 'copy', 'concat', 'cssmin', 'ngAnnotate', 'uglify'],
		    options: {
		      spawn: false,
		    },
		  },
		}

	});


	// load tasks	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-clean');
    //grunt.loadNpmTasks('grunt-bower-concat');

    grunt.registerTask('watchme', ['watch']);

	grunt.registerTask('default', ['clean', 'jshint', 'copy', 'concat', 'cssmin', 'ngAnnotate', 'uglify']);// 'ngAnnotate', 'uglify'
	
};

