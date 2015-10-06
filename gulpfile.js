/**
 * Created by � on 04.10.2015.
 */
'use strict';
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var data = require('gulp-data');

gulp.task('webserver', function() {
    return gulp.src('app/debug')
        .pipe(webserver({
            livereload: true,
            //directoryListing: true,
            open: true,
            fallback: 'index.html',
            port: 8001,
            host: '192.168.3.120'
        }));
});

gulp.task('sass', function () {
    return gulp.src('app/src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/debug/styles'));
});

gulp.task('jade', function() {
    //var YOUR_LOCALS = {};

    return gulp.src('app/src/jade/**/*.jade')
        .pipe(data( function(file) {
            return require('./app/src/jade/index.jade.json');
        } ))
        .pipe(jade({
            //locals: YOUR_LOCALS
        }))
        .pipe(gulp.dest('app/debug/'))
});

gulp.task('watch', ['jade','sass'], function(){
    gulp.watch('app/src/scss/**/*.scss', ['sass']);
    gulp.watch('app/src/jade/**/*.jade', ['jade']);
    gulp.run('webserver');
});

gulp.task('copyimage', function(){
      return  gulp.src('app/src/img/**/*')
            .pipe(gulp.dest('app/debug/img'));
});

gulp.task('default', ['watch']);