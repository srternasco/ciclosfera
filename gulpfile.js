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
const pug = require('gulp-pug');
const livereload = require('gulp-livereload');
const log = require('fancy-log');

// Define base folders
const devFolder = './dev';
const buildFolder = './build';
const imagesFolder = 'img';
const stylesFolder = buildFolder + 'scss';
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
// gulp.task('iconfont', function(done){
//   const iconStream =
//     gulp
//       .src(imagesFolder + '/icons-font/*.svg')
//       .pipe(iconfont({
//         fontName: 'nexudus-icons-font', // required
//         fontHeight: 1000,
//         normalize: true, // icons to have the same height
//         prependUnicode: false, // true recommended option
//         formats: ['woff2'], // default, 'woff2' and 'svg' are available
//         timestamp: runTimestamp
//       }));

//   async.parallel([
//     function handleGlyphs(cb) {
//       iconStream.on('glyphs', function(glyphs, options) {
//         gulp
//           .src(stylesFolder + '/templates/_icons-font.scss')
//           .pipe(consolidate('lodash', {
//             glyphs: glyphs,
//             fontName: 'nexudus-icons-font',
//             fontPath: 'files/',
//             className: 'i-nexudus'
//           }))
//           .pipe(gulp.dest(stylesFolder + '/components'))
//           .on('finish', cb);
//       });
//     },
//     function handleFonts(cb) {
//       iconStream
//         .pipe(gulp.dest('files'))
//         .on('finish', cb);
//     }
//   ], done);
// });

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

// Create Views
gulp.task('views', function buildHTML() {
  return gulp.src(devFolder + '/**/*.pug')
  .pipe(pug())
  .pipe(gulp.dest(buildFolder))
  .pipe(livereload())
  .on('error', error => log(error))
  .on('end', () => log('Great pug!'))
});

// Watch
gulp.task('watch', function() {
  gulp.watch(devFolder + '/**/*.pug', gulp.series('views'));
  // gulp.watch(stylesFolder + '/**/*.scss', gulp.series('sass'));
  // gulp.watch(imagesFolder + '/icons-sprite/*.png', gulp.series('sprite'));
  // gulp.watch(imagesFolder + '/icons-font/*.svg', gulp.series('iconfont'));
});

// Build Task
gulp.task('build',gulp.series(
                              // 'sprite',
                              // 'iconfont',
                              'sass',
                              'views'));

// Default Task
gulp.task('default', gulp.series('build'));
