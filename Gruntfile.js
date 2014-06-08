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

      // Recursively bundle up all the required modules
      // browserify: {
      //   vendor: {
      //     src: ['client/requires/**/*.js'],
      //     dest: 'build/vendor.js',
      //     options: {
      //       shim: {
      //         jquery: {
      //           path: 'client/requires/jquery/js/jquery.js',
      //           exports: '$'
      //         },
      //         underscore: {
      //           path: 'client/requires/underscore/js/underscore.js',
      //           exports: '_'
      //         },
      //         backbone: {
      //           path: 'client/requires/backbone/js/backbone.js',
      //           exports: 'Backbone',
      //           depends: {
      //             underscore: 'underscore'
      //           }
      //         },
      //         'backbone.marionette': {
      //           path: 'client/requires/backbone.marionette/js/backbone.marionette.js',
      //           exports: 'Marionette',
      //           depends: {
      //             jquery: '$',
      //             backbone: 'Backbone',
      //             underscore: '_'
      //           }
      //         }
      //       }
      //     }
      //   },
      //   app: {
      //     files: {
      //       'build/app.js': [
      //         'client/src/plugins/jquery.ui.widget.js',
      //         'client/src/plugins/jquery.iframe-transport.js',
      //         'client/src/plugins/jquery.fileupload.js',
      //         'client/src/main.js'
      //       ]
      //     },
      //     options: {
      //       transform: ['hbsfy'],
      //       external: ['jquery', 'underscore', 'backbone', 'backbone.marionette']
      //     }
      //   },
      //   test: {
      //     files: {
      //       'build/tests.js': [
      //         'client/spec/**/*.test.js'
      //       ]
      //     },
      //     options: {
      //       transform: ['hbsfy'],
      //       external: ['jquery', 'underscore', 'backbone', 'backbone.marionette']
      //     }
      //   }
      // },

      // https://github.com/sindresorhus/grunt-sass
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

      // https://github.com/gruntjs/grunt-contrib-concat#getting-started
      // concat: {
      //   'build/main.js': ['build/vendor.js', 'build/app.js']
      // },

      // https://github.com/gruntjs/grunt-contrib-copy#getting-started
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
      // cssmin: {
      //   minify: {
      //     src: ['build/main.css'],
      //     dest: 'dist/css/main.css'
      //   },
      //   options: {
      //     livereload: true,
      //   }
      // },

      // Javascript minification.
      // uglify: {
      //   compile: {
      //     options: {
      //       compress: true,
      //       verbose: true
      //     },
      //     files: [{
      //       src: 'build/main.js',
      //       dest: 'dist/js/main.js'
      //     }]
      //   }
      // },

      // For changes to the front-end code
      watch: {
        all: {
          options: {
            livereload: true
          },
        },
        // scripts: {
        //   files: ['client/templates/*.hbs', 'client/src/**/*.js'],
        //   tasks: ['clean:dev', 'browserify:app', 'concat', 'copy:dev']
        // },
        sass: {
          files: ['client/styles/**/*.scss'],
          tasks: ['sass', 'copy:dev']
        }
        // test: {
        //   files: ['build/app.js', 'client/spec/**/*.test.js'],
        //   tasks: ['browserify:test']
        // },
        // karma: {
        //   files: ['build/tests.js'],
        //   tasks: ['jshint:test', 'karma:watcher:run']
        // }
      },

      // for changes to the node code
      // nodemon: {
      //   dev: {
      //     options: {
      //       file: 'server.js',
      //       nodeArgs: ['--debug'],
      //       watchedFolders: ['controllers', 'app'],
      //       env: {
      //         PORT: '3001'
      //       }
      //     }
      //   }
      // },

      // Server tests
      // simplemocha: {
      //   options: {
      //     globals: ['expect', 'sinon'],
      //     timeout: 3000,
      //     ignoreLeaks: false,
      //     ui: 'bdd',
      //     reporter: 'spec'
      //   },

      //   server: {
      //     src: ['spec/spechelper.js', 'spec/**/*.test.js']
      //   }
      // },

      // Mongod server launcher
      shell: {
        mongo: {
          command: 'mongod',
          options: {
            async: true
          }
        }
      },

      // https://github.com/sindresorhus/grunt-concurrent#grunt-concurrent-
      concurrent: {
        dev: {
          tasks: ['shell:mongo', 'watch:sass'],
          // tasks: ['nodemon:dev', 'shell:mongo', 'watch:scripts', 'watch:sass', 'watch:test'],
          options: {
            logConcurrentOutput: true
          }
        },
        test: {
          tasks: ['watch:karma'],
          options: {
            logConcurrentOutput: true
          }
        }
      },

      // http://karma-runner.github.io/0.10/intro/how-it-works.html
      // karma: {
      //   options: {
      //     configFile: 'karma.conf.js'
      //   },
      //   watcher: {
      //     background: true,
      //     singleRun: false
      //   },
      //   test: {
      //     singleRun: true
      //   }
      // },

      // // Detect JavaScript errors
      // jshint: {
      //   all: ['Gruntfile.js', 'client/src/**/*.js', 'client/spec/**/*.js'],
      //   dev: ['client/src/**/*.js'],
      //   test: ['client/spec/**/*.js']
      // }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.registerTask('default', ['sass']);

  grunt.registerTask('init:dev', [
    'clean',
    'bower',
    'browserify:vendor'
  ]);

  grunt.registerTask('build:dev', [
    // 'clean:dev',
    // 'browserify:app',
    // 'browserify:test',
    // 'jshint:dev',
    'sass'
    // 'concat',
    // 'copy:dev'
  ]);

  grunt.registerTask('build:prod', [
    'clean:prod',
    'browserify:vendor',
    'browserify:app',
    'jshint:all',
    'sass',
    'concat',
    'cssmin',
    'uglify',
    'copy:prod'
  ]);

  grunt.registerTask('heroku', [
    'init:dev',
    'build:dev'
  ]);

  grunt.registerTask('server', [
    'build:dev',
    'concurrent:dev'
  ]);

  grunt.registerTask('test:server', [
    'simplemocha:server'
  ]);

  grunt.registerTask('test:client', [
    'karma:test'
  ]);

  grunt.registerTask('tdd', [
    'karma:watcher:start',
    'concurrent:test'
  ]);

  grunt.registerTask('test', [
    'test:server',
    'test:client'
  ]);
};