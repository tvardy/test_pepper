const gulp = require('gulp');

const autoPrefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const cssNano = require('gulp-cssnano');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sourceMaps = require('gulp-sourcemaps');

gulp.task('sass:dev', function sass_dev() {
  return gulp
    .src('app/scss/style.scss')
    .pipe(sourceMaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoPrefixer({
      browsers: ['last 4 versions', 'ie >= 9'],
      cascade: false
    }))
    .pipe(sourceMaps.write('./'))
    .pipe(browserSync.stream())
    .pipe(gulp.dest('app/css'))
});

gulp.task('sass:prod', ['sass:dev'], function sass_prod() {
  return gulp
    .src('app/css/style.css')
    .pipe(cssNano())
    .pipe(gulp.dest('app/css'));
});

gulp.task('sync', function sync() {
  browserSync.init({
    open: false,
    server: {
      baseDir: 'app'
    }
  });
});

gulp.task('watch', ['sync', 'watch:styles']);

gulp.task('watch:styles', ['sass:dev'], function watch_styles() {
  return gulp.watch('app/scss/**/*.scss', ['sass:dev']);
});

gulp.task('watch:html', function watch_html() {
  return gulp.watch('app/**/*.html', browserSync.reload);
});

// TODO: use gulp-useref and `dest/` folder
gulp.task('build', ['sass:prod']);
