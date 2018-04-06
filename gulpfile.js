//based on http://egorsmirnov.me/2015/05/22/react-and-es6-part1.html

var gulp =        require('gulp');
var serve =       require('gulp-serve');
var browserify =  require('browserify');
var babelify =    require('babelify');
var source =      require('vinyl-source-stream');
var browserSync = require('browser-sync').create();
var sass =        require('gulp-sass');
var template =    require('gulp-template');

gulp.task('build-jsx', function () {
  return browserify({entries: 'app/scripts/app.jsx', extensions: ['.jsx'], debug: true})
    .transform('babelify', {presets: ['env', 'react']})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-html', function () {
  return gulp.src('app/views/*.html')
    .pipe(template({timestamp: new Date().getTime()}))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-sass', function() {
  return gulp.src('app/styles/*.sass')
    .pipe(sass())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('watch-jsx', ['build-jsx'], function(done) {
  browserSync.reload();
  done();
});

gulp.task('build-static', function(){
  gulp.src('app/static/*')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('build', ['build-html', 'build-sass', 'build-jsx', 'build-static']);

gulp.task('serve', ['build'], serve({
  root: 'dist',
  port: process.env.PORT || 8849
}));

gulp.task('watch', ['build'], function () {
  browserSync.init({
    server: "./dist",
    port: process.env.PORT || 8849,
    ghostMode: false
  });
  gulp.watch('app/scripts/*.jsx', ['watch-jsx']);
  gulp.watch('app/views/*.html', ['build-html']).on('change', function(){setTimeout(browserSync.reload,500);});
  gulp.watch('app/styles/*.sass', ['build-sass']);
  gulp.watch('app/static/*', ['build-static']);
});

gulp.task('default', ['watch']);
