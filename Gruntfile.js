module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    preprocess: {
      options: {
        context: {
          NODE_ENV: 'DEV'
        };
      },
      html: {
        src: 'views/index.html',
        dest: 'index.html'
      },
      js: {
        src: 'js/services/services.js',
        dest: 'services.js'
      }
    },
    removelogging: {
      dist: {
        src: "dist/app.js",
      }
    },
    concat: {
      dist: {
        options: {
          separator: ';'
        },
        files: {
          'dist/app.js': ['js/*.js', 'js/*/*.js', 'tmp/*.js', 'libs/*.js']
        }
      }
    },
    uglify: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */',
      },
      dist: {
        files: {
          'dist/app.js': ['dist/app.js'],
        },
        options: {
          mangle: false
        }
      }
    },
    html2js: {
      dist: {
        src: ['views/*/*.html'],
        dest: 'tmp/templates.js'
      }
    },
    clean: {
      temp: {
        src: ['tmp']
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks("grunt-remove-logging");
  grunt.loadNpmTasks('grunt-preprocess');
  //register grunt default task
  grunt.registerTask('default', ['preprocess:dev']);
  grunt.registerTask('dev', ['preprocess:dev']);
  grunt.registerTask('prod', ['html2js:dist', 'concat:dist', 'removelogging', 'uglify:dist', 'clean:temp', 'preprocess']);
};
