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
          src: ['build/app.js', 'build/main.css', 'build/<%= pkg.name %>.js']
        },
        prod: ['dist']
      },

      sass: {
        dist: {
          options: {
            loadPath: require('node-bourbon').includePaths,
            loadPath: require('node-neat').includePaths,
            style: 'nested'
          },
          files: {
            'css/main.css': 'client/styles/main.scss'
          }
        }
      },

      concat: {
        'js/vendor.js': [
          'js/lib/modernizr.js',
          'js/lib/jquery.min.js',
          'js/lib/jquery.ui.widget.js',
          'js/lib/jquery.fileupload.js',
          'js/lib/jquery.autocomplete.js',
          'js/lib/underscore.min.js',
          'js/lib/backbone.js',
          'js/lib/backbone.validation.js'
        ],
        'js/main.js': [
          'js/models/*.js',
          'js/collections/*.js',
          'js/views/*.js',
          'js/routes/*.js',
          'js/app.js'
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
          tasks: ['sass', 'copy:dev']
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
  grunt.registerTask('init:dev', ['clean']);
  grunt.registerTask('build:dev', ['sass', 'concat']);
  grunt.registerTask('build:prod', [
    'clean:prod',
    'jshint:all',
    'sass',
    'concat',
    'cssmin',
    'copy:prod'
  ]);

  grunt.registerTask('heroku', [
    'init:dev',
    'build:dev'
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