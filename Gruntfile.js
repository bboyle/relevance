'use strict';

module.exports = function( grunt ) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg: grunt.file.readJSON( 'package.json' ),
		banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
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
				src: [ 'src/jquery.<%= pkg.name %>.js' ],
				dest: 'dist/jquery.<%= pkg.name %>.js'
			},
			legacy: {
				src: [
					'src/jquery.<%= pkg.name %>.js',
					'src/jquery.<%= pkg.name %>.legacy-API.js',
				],
				dest: 'dist/jquery.forces.<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				files: {
					'dist/jquery.<%= pkg.name %>.min.js': [ 'dist/jquery.<%= pkg.name %>.js' ],
					'dist/jquery.forces.<%= pkg.name %>.min.js': [ 'dist/jquery.forces.<%= pkg.name %>.js' ]
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
						'http://localhost:8000/test/events.html?jquery=1.4.4',
						'http://localhost:8000/test/instructions.html?jquery=1.4.4',
						'http://localhost:8000/test/legacy-API.html?jquery=1.4.4',
						'http://localhost:8000/test/plugin.html?jquery=1.4.4',
						'http://localhost:8000/test/relevantWhen.html?jquery=1.4.4',
						'http://localhost:8000/test/ui.html?jquery=1.4.4',
						// 2.1.0
						'http://localhost:8000/test/events.html?jquery=2.1.0',
						'http://localhost:8000/test/instructions.html?jquery=2.1.0',
						'http://localhost:8000/test/legacy-API.html?jquery=2.1.0',
						'http://localhost:8000/test/plugin.html?jquery=2.1.0',
						'http://localhost:8000/test/relevantWhen.html?jquery=2.1.0',
						'http://localhost:8000/test/ui.html?jquery=2.1.0',
					]
				}
			}
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
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );

	// Default task.
	grunt.registerTask( 'test', [ 'jshint', 'connect', 'qunit' ]);
	grunt.registerTask( 'produce', [ 'clean', 'concat', 'uglify' ]);
	grunt.registerTask( 'default', [ 'test', 'produce' ]);

};
