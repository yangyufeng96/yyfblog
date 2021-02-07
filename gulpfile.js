const gulp = require('gulp');
const minifycss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const htmlclean = require('gulp-htmlclean');
const options = {
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  minifyJS: true,
  minifyCSS: true
};
// 压缩css文件
gulp.task('minify-css', function () {
  return gulp.src('./blog/**/*.css')
    .pipe(minifycss())
    .pipe(gulp.dest('./blog'));
});

// 压缩js文件
gulp.task('minify-js', function () {
  return gulp.src(['./blog/**/.js', '!./blog/js/**/*min.js'])
    .pipe(uglify())
    .pipe(gulp.dest('./blog'));
});

// 压缩html文件
gulp.task('minify-html', function () {
  return gulp.src('./blog/**/*.html')
    .pipe(htmlclean())
    .pipe(htmlmin(options))
    .pipe(gulp.dest('./blog'))
});

//build the website
gulp.task('default', gulp.parallel('minify-css', 'minify-js', 'minify-html'));