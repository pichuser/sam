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
var compassImagehelper = require('gulp-compass-imagehelper');
var svg2png = require('gulp-svg2png');

gulp.task('svg2png', function () {
    gulp.src('src/img/**/*.svg')
        .pipe(svg2png())
        .pipe(gulp.dest('src/img/'));
});

function requireUncached( $module ) {
    delete require.cache[require.resolve( $module )];
    return require( $module );
}

gulp.task('webserver', function() {
    browserSync.init({
        server: {
            baseDir: "dist"
        },
        files: ["dist/index.html", "dist/**/*.css"],
        port: 8000,
        host: "0.0.0.0"
    });
});

function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),
        error.message,
        "----------ERROR MESSAGE END----------",
        ''
    ].join('\n'));
    this.end();
}

gulp.task('sass',['compass-imagehelper'], function () {
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
        }).on('error', log))
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

gulp.task('copyimages', ['svg2png'], function(){
    return  gulp.src('src/img/**/*')
        .pipe(gulp.dest('dist/img'));
});
gulp.task('copyfonts', function(){
    return  gulp.src('src/font/**/*')
        .pipe(gulp.dest('dist/font'));
});


gulp.task('compass-imagehelper', function (cb) {
    return gulp.src('src/img/toBase64/**/*')
        .pipe(compassImagehelper({
            // targetFile: '_generated-imagehelper.scss', // default target filename is '_compass-imagehelper.scss'
            // template: 'your-compass-imagehelper.mustache',
            images_path: 'src/img/toBase64',
            css_path: 'scss/',
            prefix: 'icon--'
        }))
        .pipe(gulp.dest('src/scss'));
});



gulp.task('default', ['watch']);