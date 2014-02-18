module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: 'Moip.js',
        concat: {
            options: {
                stripBanners: true,
                stripFooters: true,
            },
            dist: {
                src: ['src/creditCard.js', 'src/calculator.js'],
                dest: 'build/moip.js'
            }
        },
        jshint : {
            all: ['src/**/*.js']
        },
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
            options: {
                '--web-security': 'no',
                coverage: {
                    src: ['src/**/*.js'],
                    instrumentedFiles: 'test/instrumented',
                    htmlReport: 'test/report/coverage',
                    coberturaReport: 'test/report',
                    linesThressholdPct: 75
                }
            },
            all: ['test/*.html']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-qunit-istanbul');

    grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

    grunt.registerTask('travis', ['qunit']);
};
