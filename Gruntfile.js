'use strict';

module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON( 'package.json' ),
		title: '<%= pkg.title || pkg.name %> - v<%= pkg.version %>',
		buildNumber: process.env.TRAVIS_BUILD_ID || grunt.template.today( 'isoUtcDateTime' ),
		banner: '/*! <%= title %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

		browsers: [
			{ browserName: 'Internet Explorer', version: '11' },
			{ browserName: 'Chrome' },
			{ browserName: 'iPhone' },
			{ browserName: 'android' },
			{ browserName: 'Firefox', platform: 'Linux' },
			// old IE
			{ browserName: 'Internet Explorer', version:  '9' },
			{ browserName: 'Internet Explorer', version:  '8' },
			{ browserName: 'Internet Explorer', version:  '6' }
		],

		// Task configuration.
		clean: {
			files: [ 'dist' ]
		},
		connect: {
			server: {
				options: {
					port: 8000,
					base: '.'
				}
			}
		},
		// production pipeline tasks
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			dist: {
				src: [ 'src/<%= pkg.name %>.js' ],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': [ 'dist/<%= pkg.name %>.js' ]
				}
			},
		},
		// code quality tasks
		qunit: {
			unit: [ 'test/**/*.html' ],
			// test other jquery versions
			jquery: {
				options: {
					urls: [
						'http://127.0.0.1:8000/test/events.html?jquery=1.4.4',
						'http://127.0.0.1:8000/test/instructions.html?jquery=1.4.4',
						'http://127.0.0.1:8000/test/plugin.html?jquery=1.4.4',
						'http://127.0.0.1:8000/test/relevantWhen.html?jquery=1.4.4',
						'http://127.0.0.1:8000/test/ui.html?jquery=1.4.4',
						// 1.7.2
						'http://127.0.0.1:8000/test/events.html?jquery=1.7.2',
						'http://127.0.0.1:8000/test/instructions.html?jquery=1.7.2',
						'http://127.0.0.1:8000/test/plugin.html?jquery=1.7.2',
						'http://127.0.0.1:8000/test/relevantWhen.html?jquery=1.7.2',
						'http://127.0.0.1:8000/test/ui.html?jquery=1.7.2',
						// 2.1.0
						'http://127.0.0.1:8000/test/events.html?jquery=2.1.0',
						'http://127.0.0.1:8000/test/instructions.html?jquery=2.1.0',
						'http://127.0.0.1:8000/test/plugin.html?jquery=2.1.0',
						'http://127.0.0.1:8000/test/relevantWhen.html?jquery=2.1.0',
						'http://127.0.0.1:8000/test/ui.html?jquery=2.1.0',
						// 3.0.0
						'http://127.0.0.1:8000/test/events.html?jquery=3.0.0',
						'http://127.0.0.1:8000/test/instructions.html?jquery=3.0.0',
						'http://127.0.0.1:8000/test/plugin.html?jquery=3.0.0',
						'http://127.0.0.1:8000/test/relevantWhen.html?jquery=3.0.0',
						'http://127.0.0.1:8000/test/ui.html?jquery=3.0.0',
					]
				}
			}
		},
		'saucelabs-qunit': {
			events: {
				options: {
					testname: 'events - <%= title %>',
					build: '<%= buildNumber %>',
					urls: [ 'http://127.0.0.1:8000/test/events.html?jquery=1.7.2' ],
					browsers: '<%= browsers %>'
				}
			},
			instructions: {
				options: {
					testname: 'instructions - <%= title %>',
					build: '<%= buildNumber %>',
					urls: [ 'http://127.0.0.1:8000/test/instructions.html?jquery=1.7.2' ],
					browsers: '<%= browsers %>'
				}
			},
			plugin: {
				options: {
					testname: 'plugin - <%= title %>',
					build: '<%= buildNumber %>',
					urls: [ 'http://127.0.0.1:8000/test/plugin.html?jquery=1.7.2' ],
					browsers: '<%= browsers %>'
				}
			},
			relevantWhen: {
				options: {
					testname: 'relevantWhen - <%= title %>',
					build: '<%= buildNumber %>',
					urls: [ 'http://127.0.0.1:8000/test/relevantWhen.html?jquery=1.7.2' ],
					browsers: '<%= browsers %>'
				}
			},
			ui: {
				options: {
					testname: 'ui - <%= title %>',
					build: '<%= buildNumber %>',
					urls: [ 'http://127.0.0.1:8000/test/ui.html?jquery=1.7.2' ],
					browsers: '<%= browsers %>'
				}
			},
		},
		jshint: {
			gruntfile: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: 'Gruntfile.js'
			},
			src: {
				options: {
					jshintrc: 'src/.jshintrc'
				},
				src: [ 'src/**/*.js' ]
			},
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: [ 'test/*.js' ]
			},
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: [ 'jshint:gruntfile' ]
			},
			src: {
				files: '<%= jshint.src.src %>',
				tasks: [ 'jshint:src', 'qunit:unit' ]
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: [ 'jshint:test', 'qunit:unit' ]
			},
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-saucelabs' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );

	// Default task.
	grunt.registerTask( 'test', [ 'jshint', 'connect', 'qunit' ]);
	grunt.registerTask( 'test-remote', [ 'jshint', 'qunit:unit', 'connect', 'clean', 'saucelabs-qunit' ]);
	grunt.registerTask( 'produce', [ 'clean', 'concat', 'uglify' ]);
	grunt.registerTask( 'default', [ 'test', 'produce' ]);

};
