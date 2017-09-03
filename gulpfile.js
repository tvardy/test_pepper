const gulp = require('gulp')

const autoPrefixer = require('gulp-autoprefixer')
const cssNano = require('gulp-cssnano')
const inline = require('gulp-css-inline-assets')
const plumber = require('gulp-plumber')
const sass = require('gulp-sass')
const sourceMaps = require('gulp-sourcemaps')
const rename = require('gulp-rename')
const replace = require('gulp-replace')

gulp.task('sass:dev', function sassDev () {
  return gulp
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
    .pipe(gulp.dest('app/css'))
})

gulp.task('sass:prod', ['sass:dev'], function sassProd () {
  gulp
    .src('app/css/style.css')
    .pipe(inline())
    .pipe(cssNano({
      autoprefixer: false,
      discardUnused: false,
      svgo: false
    }))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('dest/css'))
})

gulp.task('watch', ['watch:styles'])

gulp.task('watch:styles', ['sass:dev'], function watchStyles () {
  return gulp.watch('app/scss/**/*.scss', ['sass:dev'])
})

gulp.task('build', ['sass:prod'], function build () {
  gulp
    .src('app/*.html')
    .pipe(replace(/("\/css\/.+)(\.css")/, '$1.min$2'))
    .pipe(replace(/(<!-- build:js -->)(\s+.+)+\s+(<!-- endbuild -->)/m, '<script src="/js/build.min.js"></script>'))
    .pipe(gulp.dest('dest'))

  gulp
    .src('app/tabs/**/*')
    .pipe(gulp.dest('dest/tabs'))
})
