var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var htmlclean = require('gulp-htmlclean');
// 压缩css文件
gulp.task('minify-css', function () {
  return gulp.src('./public/**/*.css')
    .pipe(minifycss())
    .pipe(gulp.dest('./public'));
});
// 压缩html文件
gulp.task('minify-html', function () {
  return gulp.src('./public/**/*.html')
    .pipe(htmlclean())
    .pipe(htmlmin({
      removeComments: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    }))
    .pipe(gulp.dest('./public'))
});
// 压缩js文件
gulp.task('minify-js', function () {
  return gulp.src(['./public/**/.js', '!./public/js/**/*min.js'])
    .pipe(uglify())
    .pipe(gulp.dest('./public'));
});
// 默认任务 gulp 4.0 适用的方式
//build the website
gulp.task('default', gulp.parallel('minify-html', 'minify-css', 'minify-js'));