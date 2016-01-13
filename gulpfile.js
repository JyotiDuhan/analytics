var gulp = require("gulp"),
	uglify = require("gulp-uglify"),
	minifyCSS = require('gulp-minify-css'),
	concat = require("gulp-concat"),
	declare = require("gulp-declare"),
	define = require("gulp-define-module"),
	clean = require("gulp-cleanhtml"),
	handlebars = require("gulp-handlebars");

var buildJs = 	'public/js/*.js',
	buildCss = 'public/css/*.css';

gulp.task('build', function(){
	return gulp.src(['public/js/index.js'])
	// .pipe(clean())
	.pipe(uglify())
	.pipe(concat('baseJs.js'))
	.pipe(gulp.dest('public/build'));
});

gulp.task('buildCss', function(){
	return gulp.src(['public/css/*.css'])
	.pipe(minifyCSS())
	.pipe(concat('baseCss.css'))
	.pipe(gulp.dest('public/build'));
});

gulp.task('watch', function(){
	gulp.watch(buildJs , ['build']);
	gulp.watch(buildCss , ['buildCss']);
});

// gulp.task('masterWatch', ['watch'], function(){
// 	gulp.run('build');
// })

gulp.task('default' , ['build', 'buildCss', 'watch']);