var gulp = require('gulp');
var gutil = require('gulp-util');


/* *************
  CSS
************* */

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var scss = require('postcss-scss');
var autoprefixer = require('autoprefixer');
var postcssProcessors = [
    autoprefixer( { browsers: ['last 2 versions', 'ie > 10'] } )
]

gulp.task('sass', function(callback) {

    var stream = gulp.src('src/sass/inline.scss')
        .pipe(
           postcss(postcssProcessors, {syntax: scss})
        )
        .pipe(
            sass({ outputStyle: 'expanded' })
            .on('error', gutil.log)
        )
        .pipe(gulp.dest('tmp/'));

    gulp.src('src/sass/not-inline.scss')
        .pipe(
           postcss(postcssProcessors, {syntax: scss})
        )
        .pipe(
            sass({ outputStyle: 'compressed' })
            .on('error', gutil.log)
        )
        .pipe(gulp.dest('tmp/')); 


    return stream; 
});



var inlineCss = require('gulp-inline-css');

gulp.task('inlinecss', ['sass'], function() {

    gulp.src('tmp/*.html')
        .pipe(
            inlineCss({
                applyStyleTags: false,
                removeStyleTags: false
            })
            .on('error', gutil.log)
        )
        .pipe(gulp.dest('build/'));

});





/* *************
  File Inclued
************* */

var fileInclude = require('gulp-file-include');

gulp.task('fileinclude', function() {
  gulp.src(['src/emails/*.html'])
    .pipe(
        fileInclude({
          prefix: '@@',
          basepath: 'src/'
        })
        .on('error', gutil.log)
    )
    .pipe(gulp.dest('tmp/'));
    
});



/* *************
	SERVER
************* */

var connect = require('gulp-connect');

gulp.task('connect', function() {
    connect.server({
        port: 8000
    });
});



/* *************
    WATCH
************* */

gulp.task('watch', function() {
    gulp.watch('src/sass/**/*.scss',['sass', 'inlinecss']); 
    gulp.watch('src/**/*.html',['fileinclude']); 
});


/* *************
    DEFAULT
************* */

gulp.task('default', ['connect', 'fileinclude', 'sass', 'inlinecss', 'watch']);





