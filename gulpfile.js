const gulp = require('gulp');

const autoPrefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const cssNano = require('gulp-cssnano');
const inline = require('gulp-css-inline-assets');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const replace = require('gulp-replace');

gulp.task('sass:dev', function sass_dev(done) {
  const stream = gulp
    .src('app/scss/style.scss')
    .pipe(sourceMaps.init())
    .pipe(plumber())
    .pipe(sass({
      precision: 2
    }))
    .pipe(autoPrefixer({
      browsers: ['last 4 versions', 'ie >= 9'],
      cascade: false
    }))
    .pipe(sourceMaps.write('./'))
    .pipe(browserSync.stream())
    .pipe(gulp.dest('app/css'));

  stream.on('end', done);
  stream.on('error', (err) => { done(err); });
});

gulp.task('sass:prod', ['sass:dev'], function sass_prod() {
   gulp
    .src('app/css/style.css')
    .pipe(inline())
    .pipe(cssNano({
      autoprefixer: false,
      discardUnused: false,
      svgo: false
    }))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('dest/css'));
});

gulp.task('sync', function sync() {
  browserSync.init({
    open: false,
    serveStatic: [
      {
        route: '/jspm_packages',
        dir: 'jspm_packages'
      }
    ],
    server: {
      baseDir: 'app'
    }
  });
});

gulp.task('watch', ['sync', 'watch:html', 'watch:scripts', 'watch:styles']);

gulp.task('watch:html', function watch_html() {
  return gulp.watch('app/**/*.html', browserSync.reload);
});

gulp.task('watch:scripts', function watch_html() {
  return gulp.watch('app/**/*.js', browserSync.reload);
});

gulp.task('watch:styles', ['sass:dev'], function watch_styles() {
  return gulp.watch('app/scss/**/*.scss', ['sass:dev']);
});

gulp.task('build', ['sass:prod'], function build () {
  gulp
    .src('app/**/*.html')
    .pipe(replace(/("\/css\/style)(\.css")/, '$1.min$2'))
    .pipe(replace(/(<!-- build:js -->)(\s+.+)+\s+(<!-- endbuild -->)/m, '<script src="/js/build.min.js"></script>'))
    .pipe(gulp.dest('dest'));
});
