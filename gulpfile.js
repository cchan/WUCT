//based on http://egorsmirnov.me/2015/05/22/react-and-es6-part1.html

const gulp =        require('gulp');
const browserSync = require('browser-sync').create();
const sourcemaps =  require('gulp-sourcemaps');
const rename =      require('gulp-rename');

gulp.task('build-jsx', function () {
  const rollup =   require('gulp-better-rollup');
  const babel =    require('rollup-plugin-babel');
  const resolve =  require('rollup-plugin-node-resolve');
  const commonjs = require('rollup-plugin-commonjs');
  const replace =  require('rollup-plugin-replace');
  const terser =   require('gulp-terser');
  const alias = aliases => ({
    resolveId(importee) {
      const alias = aliases[importee];
      return alias ? this.resolveId(alias) : null;
    }
  });

  return gulp.src('app/scripts/app.jsx')
    .pipe(sourcemaps.init())
    .pipe(rollup({
      plugins: [
        alias({ 'react': 'inferno-compat', 'react-dom': 'inferno-compat' }),
        babel({
          presets: ["@babel/preset-env", "@babel/preset-react"],
          exclude: 'node_modules/**'
        }),
        resolve({
          browser: true,
        }),
        commonjs({
          include: 'node_modules/**',
        }),
        replace({
          'process.env.NODE_ENV': JSON.stringify('production')
        })
      ]
    }, {
      format: 'iife'
    }))
    .pipe(terser())
    .pipe(rename('bundle.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('build-js', function () {
  const terser = require('gulp-terser');
  return gulp.src('app/scripts/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(rename('common.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('build-html', function () {
  const template = require('gulp-template');
  return gulp.src('app/views/*.html')
    .pipe(template({timestamp: new Date().getTime()}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('build-sass', function() {
  const sass =         require('gulp-sass');
  const autoprefixer = require('gulp-autoprefixer');
  const purify =       require('gulp-purifycss');
  const uglify =       require('gulp-uglifycss');
  return gulp.src('app/styles/*.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle:'compressed'}))
    .pipe(autoprefixer())
    .pipe(purify(['./build/**.html', './dist/**.js']))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
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

gulp.task('build', gulp.series(
  gulp.parallel('build-html', 'build-jsx', 'build-js', 'build-static'),
  'build-sass'
));

const serve = require('gulp-serve');
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
