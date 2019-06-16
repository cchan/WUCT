//based on http://egorsmirnov.me/2015/05/22/react-and-es6-part1.html

var gulp =        require('gulp');
var serve =       require('gulp-serve');
var browserify =  require('browserify');
var babelify =    require('babelify');
var source =      require('vinyl-source-stream');
var buffer =      require('vinyl-buffer');
var browserSync = require('browser-sync').create();
var sass =        require('gulp-sass');
var template =    require('gulp-template');
var sourcemaps =  require('gulp-sourcemaps');
var aliasify =    require('aliasify');

gulp.task('build-jsx', function () {
  var tinyify = require('tinyify');
  return browserify({entries: 'app/scripts/app.jsx', extensions: ['.jsx'], debug: true})
    .transform(aliasify, {global: true, aliases: {"react": "preact-compat", "react-dom": "preact-compat" } })
    .transform(babelify, {presets: ["@babel/preset-env", "@babel/preset-react"]})
    .plugin(tinyify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write("./"))
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

gulp.task('watch-jsx', gulp.series('build-jsx', function(done) {
  browserSync.reload();
  done();
}));

gulp.task('build-static', function(){
  return gulp.src('app/static/*')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('build', gulp.parallel('build-html', 'build-sass', 'build-jsx', 'build-static'));

gulp.task('serve', gulp.series('build', serve({
  root: 'dist',
  port: process.env.PORT || 8849
})));

gulp.task('watch', gulp.series('build', function (done) {
  browserSync.init({
    server: "./dist",
    port: process.env.PORT || 8849,
    ghostMode: false
  });
  gulp.watch('app/scripts/*.jsx', gulp.series('watch-jsx'));
  gulp.watch('app/views/*.html', gulp.series('build-html')).on('change', function(){setTimeout(browserSync.reload,500);});
  gulp.watch('app/styles/*.sass', gulp.series('build-sass'));
  gulp.watch('app/static/*', gulp.series('build-static'));
  done();
}));

gulp.task('default', gulp.series('watch'));
