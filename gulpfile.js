var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    // concat = require('gulp-concat'),
    // uglify = require('gulp-uglifyjs'),
    // cssnano = require('gulp-cssnano'),
    // rename = require('gulp-rename'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps');



gulp.task('sass', function(){
  return gulp.src('src/scss/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(sass({outputStyle: 'expanded'}))
  .pipe(autoprefixer(['last 2 versions', '> 1%'], { cascade: true}))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.reload({stream: true}))
  .pipe(notify({ message: "SCSS completed", onLast: true}));
});

// Css for production
gulp.task('css', function(){
  return gulp.src('src/scss/**/*.scss')
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(plumber())
    .pipe(autoprefixer(['last 2 versions', '> 1%'], { cascade: true }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(notify({ message: "SCSS completed", onLast: true }));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'src'
    },
    notify: false
  });
});

gulp.task('img', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(gulp.dest('app/images'));
});

gulp.task('watch', ['browser-sync', 'sass'], function() {
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/scss/**/*.scss', ['sass']);
});

gulp.task('clean', function() {
  return del.sync('app');
});

gulp.task('build', ['clean', 'img', 'css'], function() {

  var buildCss = gulp.src(['src/css/**/*.css', '!src/css/styles.css'])
  .pipe(gulp.dest('app/css'))

  var buildFonts = gulp.src('src/font/**/*')
  .pipe(gulp.dest('app/font'))

  var buildJS = gulp.src('src/js/**/*.js')
  .pipe(gulp.dest('app/js'))

  var buildHtml = gulp.src('src/*.html')
  .pipe(gulp.dest('app'))
});

gulp.task('default', ['watch']);