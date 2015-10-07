/**
 * Created by � on 04.10.2015.
 */
'use strict';
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var data = require('gulp-data');
var jsoncombine = require("gulp-jsoncombine");

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
    return gulp.src(['app/src/scss/**/*.scss', '!app/src/scss/**/_*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app/debug/styles'));
});

gulp.task('jade', ['jsoncombine'], function() {
    //var YOUR_LOCALS = {};

    return gulp.src(['app/src/jade/**/*.jade',"!app/src/jade/**/_*.jade"])
        .pipe(data( function(file) {
            return require('./app/debug/result.json');
        } ))
        .pipe(jade({
            //locals: YOUR_LOCALS
        }).on('error', function(er) {console.log(er);}))
        .pipe(gulp.dest('app/debug/'));
});
gulp.task('jsoncombine', function(){
    return gulp.src("app/src/jade/**/*.json")
        .pipe(jsoncombine("result.json",function(data){
            var res = {};
            for(var i in data){
                var keyName = Object.keys(data[i])[0];
                res[keyName] = data[i][keyName];
            }
            return new Buffer(JSON.stringify(res));
        }))
        .pipe(gulp.dest("app/debug"));
});

gulp.task('watch', ['jade','sass', 'copyimages', 'copyfonts'], function(){
    gulp.watch('app/src/scss/**/*.scss', ['sass']);
    gulp.watch('app/src/jade/**/*.jade', ['jade']);
    gulp.run('webserver');
});

gulp.task('copyimages', function(){
    return  gulp.src('app/src/img/**/*')
        .pipe(gulp.dest('app/debug/img'));
});
gulp.task('copyfonts', function(){
    return  gulp.src('app/src/font/**/*')
        .pipe(gulp.dest('app/debug/font'));
});

gulp.task('default', ['watch']);