'use strict';

// Include gulp
const async = require('async');
const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const spritesmith = require('gulp.spritesmith');
const consolidate = require('gulp-consolidate');
const sass = require('gulp-sass');
sass.compiler = require('sass');
const Fiber = require('fibers');
const autoPrefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const replace = require('gulp-replace');

// Define base folders
const imagesFolder = 'img';
const stylesFolder = 'scss';
const runTimestamp = Math.round(Date.now()/1000);

// Sprite
// gulp.task('sprite', function () {
//   const spriteData = gulp
//     .src(imagesFolder + '/icons-sprite/*.png')
//     .pipe(spritesmith({
//       retinaSrcFilter: imagesFolder + '/icons-sprite*/*@2x.png',
//       imgName: 'sprite.png',
//       retinaImgName: 'sprite@2x.png',
//       //imgPath: dest + '../images/sprite.png',
//       //retinaImgPath: dest + '../images/sprite@2x.png',
//       cssName: '_icons-sprite.scss',
//       cssTemplate: stylesFolder + '/templates/icons-sprite.handlebars'
//     }));
//   spriteData.css.pipe(gulp.dest(stylesFolder + '/components'));
//   return spriteData.img.pipe(gulp.dest(imagesFolder));
// });

// Icon font
gulp.task('iconfont', function(done){
  const iconStream =
    gulp
      .src(imagesFolder + '/icons-font/*.svg')
      .pipe(iconfont({
        fontName: 'nexudus-icons-font', // required
        fontHeight: 1000,
        normalize: true, // icons to have the same height
        prependUnicode: false, // true recommended option
        formats: ['woff2'], // default, 'woff2' and 'svg' are available
        timestamp: runTimestamp
      }));

  async.parallel([
    function handleGlyphs(cb) {
      iconStream.on('glyphs', function(glyphs, options) {
        gulp
          .src(stylesFolder + '/templates/_icons-font.scss')
          .pipe(consolidate('lodash', {
            glyphs: glyphs,
            fontName: 'nexudus-icons-font',
            fontPath: 'files/',
            className: 'i-nexudus'
          }))
          .pipe(gulp.dest(stylesFolder + '/components'))
          .on('finish', cb);
      });
    },
    function handleFonts(cb) {
      iconStream
        .pipe(gulp.dest('files'))
        .on('finish', cb);
    }
  ], done);
});

// Sass
gulp.task('sass', function () {
  return gulp.src(stylesFolder + '/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ fiber: Fiber, outputStyle: 'expanded'})
    .on('error', sass.logError))
    .pipe(autoPrefixer({ autoprefixer: ['last 2 versions'] }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
});

// Create production CSS file
gulp.task('production-css', function() {
  return gulp.src('styles.css')
    .pipe(rename('css.css'))
    .pipe(replace('#F2534A', '#primarycolor'))
    .pipe(replace('../img/', '/content/themes/public/dos/img/'))
    .pipe(replace('files/', '/content/themes/public/dos/fonts/'))
    .pipe(replace('/*# sourceMappingURL=styles.css.map */', ''))
    .pipe(gulp.dest('./'));
});

// Watch
gulp.task('watch', function() {
  gulp.watch(stylesFolder + '/**/*.scss', gulp.series('sass'));
  // gulp.watch(imagesFolder + '/icons-sprite/*.png', gulp.series('sprite'));
  gulp.watch(imagesFolder + '/icons-font/*.svg', gulp.series('iconfont'));
});

// Build Task
gulp.task('build',gulp.series(
                              // 'sprite',
                              'iconfont',
                              'sass',
                              'production-css'));

// Default Task
gulp.task('default', gulp.series('build'));
