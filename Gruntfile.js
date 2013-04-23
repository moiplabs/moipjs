module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      options: {
        separator: ','
      },
      dist: {
        src: ['src/creditCard.js', 'src/calculator.js'],
        dest: 'build/moip.js'
      }
    },
    pkg: grunt.file.readJSON('package.json'),
    banner: "Moip.js",
    uglify: {
      options: {
        banner: '/*! <%= banner %> - build date: <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/moip.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    qunit: {
      all: ['test/**/*.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['qunit','uglify']);

  grunt.registerTask('travis', ['qunit']);
};