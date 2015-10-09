/**
 * Created by � on 04.10.2015.
 */
'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var data = require('gulp-data');
var jsoncombine = require("gulp-jsoncombine");

function requireUncached( $module ) {
    delete require.cache[require.resolve( $module )];
    return require( $module );
}

gulp.task('webserver', function() {
    browserSync.init({
        server: {
            baseDir: "dist"
        },
        files: ["dist/index.html", "dist/**/*.css"]
    });
});

gulp.task('sass', function () {
    return gulp.src(['src/scss/**/*.scss', '!src/scss/**/_*.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('jade', ['jsoncombine'], function() {
    //var YOUR_LOCALS = {};

    return gulp.src(['src/jade/**/*.jade',"!src/jade/**/_*.jade"])
        .pipe(data( function(file) {
            return requireUncached('./dist/result.json');
        } ))
        .pipe(jade({
            //locals: YOUR_LOCALS
        }).on('error', function(er) {console.log(er);}))
        .pipe(gulp.dest('dist/'));
});
gulp.task('jsoncombine', function(){
    return gulp.src("src/jade/**/*.json")
        .pipe(jsoncombine("result.json",function(data){
            var res = {};
            for(var i in data){
                var keyName = Object.keys(data[i])[0];
                res[keyName] = data[i][keyName];
            }
            return new Buffer(JSON.stringify(res));
        }))
        .pipe(gulp.dest("dist/"));
});

gulp.task('watch', ['jade','sass', 'copyimages', 'copyfonts'], function(){
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch(['src/jade/**/*.jade', 'src/jade/**/*.json'], ['jade']);
    gulp.run('webserver');
});

gulp.task('copyimages', function(){
    return  gulp.src('src/img/**/*')
        .pipe(gulp.dest('dist/img'));
});
gulp.task('copyfonts', function(){
    return  gulp.src('src/font/**/*')
        .pipe(gulp.dest('dist/font'));
});

gulp.task('default', ['watch']);