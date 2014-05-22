// Culled by hand
module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Bower is a package manager for the web. It runs over Git.
    bower: {
      install: {
        options: {
          targetDir: 'js/vendor',
          layout: 'byComponent'
        }
      }
    },

    // https://github.com/sindresorhus/grunt-sass
    sass: {
      dist: {
        options: {
          loadPath: require('node-bourbon').includePaths,
          loadPath: require('node-neat').includePaths,
          style: 'nested'
        },
        files: {
          'css/main.css': 'css/main.scss'
        }
      }
    },

    // https://github.com/gruntjs/grunt-contrib-concat#getting-started
    concat: {
      js: {
        src: [
          'js/vendor/jquery/js/*.js',
          'js/vendor/underscore/js/*.js',
          'js/vendor/backbone/js/*.js',
          'js/models/*',
          'js/collections/*',
          'js/views/*',
          'js/app.js'
        ],
        dest: 'js/main.js'
      }
    },

    // CSS minification.
    cssmin: {
      minify: {
        src: ['css/main.css'],
        dest: 'css/main-min.css'
      },
      options: {
        livereload: true,
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
          src: 'js/main.js',
          dest: 'js/main-min.js'
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
        files: ['templates/*.hbs', 'js/**/*.js'],
        tasks: ['concat']
      },
      sass: {
        files: ['css/**/*.scss'],
        tasks: ['sass']
      }
    },

    // Fire up a server
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
        tasks: ['nodemon:dev', 'shell:mongo', 'watch:scripts', 'watch:sass'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    // Detect JavaScript errors
    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.registerTask('default', ['sass']);

  grunt.registerTask('init:dev', [
    'bower'
  ]);

  grunt.registerTask('build:dev', [
    // 'jshint:all',
    'sass',
    'concat'
  ]);

  grunt.registerTask('build:prod', [
    'jshint:all',
    'sass',
    'concat',
    'cssmin',
    'uglify'
  ]);

  grunt.registerTask('heroku', [
    'init:dev',
    'build:dev'
  ]);

  grunt.registerTask('server', [
    'build:dev',
    'concurrent:dev'
  ]);

};
