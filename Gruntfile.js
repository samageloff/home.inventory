// Culled by hand
module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

      // Read in the project settings from the package.json file into the pkg property.
      pkg: grunt.file.readJSON('package.json'),

      // Bower is a package manager for the web. It runs over Git.
      bower: {
        install: {
          options: {
            targetDir: 'client/requires',
            layout: 'byComponent'
          }
        }
      },

      // Clean files and folders.
      clean: {
        build: ['build'],
        dev: {
          src: ['build/app.js', 'build/main.css']
        },
        prod: ['dist']
      },

      concat: {
        'client/main.js': [
          // frameworks
          'client/requires/modernizr/js/modernizr.js',
          'client/requires/jquery/js/jquery.js',
          'client/requires/underscore/js/underscore.js',
          'client/requires/backbone/js/backbone.js',
          // plugins
          'client/plugins/jquery.ui.widget.js',
          'client/plugins/jquery.fileupload.js',
          // 'client/plugins/resampler.js',
          // 'client/plugins/filereader.js',
          'client/plugins/jquery.autocomplete.js',
          'client/plugins/backbone.validation.js',
          // application
          'js/cache.js',
          'js/models/*.js',
          'js/collections/*.js',
          'js/views/*.js',
          'js/routes/*.js',
          'js/app.js'
        ]
      },

      sass: {
        dist: {
          options: {
            loadPath: require('node-bourbon').includePaths,
            loadPath: require('node-neat').includePaths,
            style: 'nested'
          },
          files: {
            'client/styles/main.css': 'client/styles/main.scss'
          }
        }
      },

      jshint: {
        all: [
          'js/models/*.js',
          'js/collections/*.js',
          'js/views/*.js',
          'js/routes/*.js'
        ]
      },

      copy: {
        dev: {
          files: [{
            src: 'build/main.js',
            dest: 'public/js/main.js'
          },
          {
            src: 'build/main.css',
            dest: 'public/css/main.css'
          },
          {
            src: 'client/img/*',
            dest: 'public/img/'
          }]
        },
        prod: {
          files: [{
            src: ['client/img/*'],
            dest: 'dist/img/'
          }]
        }
      },

      // CSS minification.
      cssmin: {
          minify: {
              src: ['client/styles/main.css'],
              dest: 'css/main.css'
          }
      },

      // Javascript minification.
      uglify: {
          compile: {
              options: {
                  compress: true,
                  verbose: true
              },
              files: [{
                  src: 'client/main.js',
                  dest: 'build/main.js'
              }]
          }
      },

      // For changes to the front-end code
      watch: {
        all: {
          options: {
            livereload: true
          },
        },
        scripts: {
          files: ['js/**/*.js'],
          tasks: ['concat']
        },
        sass: {
          files: ['client/styles/**/*.scss'],
          tasks: ['sass', 'build:prod']
        }
      },

      shell: {
        mongo: {
          command: 'mongod',
          options: {
            async: true
          }
        }
      },

      nodemon: {
        dev: {
          options: {
            file: 'server.js',
            nodeArgs: ['--debug'],
            watchedFolders: ['controllers', 'app'],
            env: {
              PORT: '3001'
            }
          }
        }
      },

      concurrent: {
        dev: {
          tasks: ['shell:mongo', 'nodemon:dev', 'watch:sass', 'watch:scripts'],
          options: {
            logConcurrentOutput: true
          }
        }
      }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['sass']);
  grunt.registerTask('init:dev', ['clean', 'bower', 'concat']);
  grunt.registerTask('build:dev', ['sass', 'concat']);

  grunt.registerTask('build:prod', [
    'clean:prod',
    'jshint:all',
    'sass',
    'concat',
    'cssmin',
    'uglify',
    'copy:prod',
  ]);

  grunt.registerTask('heroku', [
    'build:dev',
    'concurrent:dev'
  ]);

  grunt.registerTask('server', [
    'build:dev',
    'concurrent:dev',
    'watch:scripts'
  ]);

  grunt.registerTask('test:server', [
    'simplemocha:server'
  ]);

  grunt.registerTask('tdd', [
    'concurrent:test'
  ]);

  grunt.registerTask('test', [
    'test:server',
    'test:client'
  ]);
};