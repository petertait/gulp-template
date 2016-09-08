"use strict";

var gulp = require('gulp'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    connectLivereload = require('connect-livereload'),
    gulpLivereload = require('gulp-livereload'),
    postcss = require('gulp-postcss'),
    reporter = require('postcss-reporter'),
    stylelint = require('stylelint'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint');

var path = {
       src: 'src/',
      html: 'src/**/*.html',
        js: 'src/js/*.js',
   postcss: 'src/postcss/**/*.css',
       css: 'src/',
}

var localPort = 5000,
       lrPort = 35729;

gulp.task('server', function(){
  var server = connect();

  server.use(connectLivereload({port: lrPort}));
  server.use(serveStatic(path.src));
  server.listen(localPort);

  console.log("\nlocal server running at http://localhost:" + localPort + "/\n");
});

gulp.task('styles', function(){
  gulp.src('src/postcss/styles.css')
    .pipe(postcss([
      require('precss'),
      require('autoprefixer'),
      require('postcss-reporter')
    ]))
    .pipe(cssnano())
    .pipe(gulp.dest(path.css))
    .pipe(gulpLivereload());
});

gulp.task('stylelint', function() {
  return gulp.src('src/**/*.scss')
    .pipe(postcss([
      stylelint({ /* options */ }),
      reporter({ clearMessages: true })
    ]));
});

gulp.task('jshint', function(){
  gulp.src(path.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulpLivereload());
});

gulp.task('html', function(){
  gulp.src(path.html)
    .pipe(gulpLivereload());
});

gulp.task('watch', function(){
  gulp.watch(path.postcss, ['styles']);
  gulp.watch(path.postcss, ['stylelint']);
  gulp.watch(path.js, ['jshint']);
  gulp.watch(path.html, ['html']);

  gulpLivereload.listen();
});

gulp.task('default', ['server', 'watch']);
