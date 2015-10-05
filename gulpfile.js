/**
 * Created by � on 04.10.2015.
 */
'use strict';
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var jade = require('gulp-jade');
var sass = require('gulp-sass');

gulp.task('webserver', function() {
    return gulp.src('app/debug')
        .pipe(webserver({
            livereload: true,
            //directoryListing: true,
            open: true,
            fallback: 'index.html',
            port: 8001
        }));
});

gulp.task('sass', function () {
    return gulp.src('app/src/sass/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/debug'));
});

gulp.task('jade', function() {
    var YOUR_LOCALS = {};

    return gulp.src('app/src/jade/**/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS
        }))
        .pipe(gulp.dest('app/debug/'))
});

gulp.task('watch', ['jade','sass'], function(){
    gulp.watch('app/src/sass/**/*.sass', ['sass']);
    gulp.watch('app/src/jade/**/*.jade', ['jade']);
    gulp.run('webserver');
});

gulp.task('copyimage', function(){
      return  gulp.src('app/src/img/**/*')
            .pipe(gulp.dest('app/debug/img'));
});

gulp.task('default', ['watch']);