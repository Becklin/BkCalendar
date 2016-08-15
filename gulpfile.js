var gulp = require('gulp');
var concat = require('gulp-concat');
// var sass = require('gulp-sass'); //需要先載入gulp-concat
var compass = require('gulp-compass');
var source = require('vinyl-source-stream');
var watch = require('gulp-watch');
/*
Browserify lets you require('modules') in the browser by bundling up all of your dependencies.
*/
var browserify = require('browserify');
/*
持续监视文件的改动，并且 只重新打包必要的文件 的 browserify 打包工具。用这种方法，
第一次打包的时候可能会还是会花 30 秒，但是后续的编译打包工作将一直保持在 100 毫秒以下 
—— 这是一个极大的提升。
*/
var watchify = require('watchify');
/*
Browserify transform for JSX (superset of JavaScript used in React library):
*/
var reactify = require('reactify');
/*
A Node.js module for sending cross platform system notification.
Using Notification Center for Mac, notify-osd for Linux, Toasters for Windows 8/10, or lovely taskbar Balloons for earlier Windows versions.
 If none of these requirements are met, be it older version of Windows or OS X, Growl is used.
*/
var notifier = require('node-notifier');
/*
Serve a folder over HTTP and watch it for changes, telling the browser to reload itself when a change happens.
要注意
*/
var server = require('gulp-server-livereload');

var notify = function(error) {
  var message = '在: ';
  var title = '錯了: ';

  if(error.description) {
    title += error.description + "damn";
  } else if (error.message) {
    title += error.message + "damn";
  }


//ss
  if(error.filename) {
    var file = error.filename.split('/');
    message += file[file.length-1];
  }

  if(error.lineNumber) {
    message += '\nOn 行數: ' + error.lineNumber + "damn2";
  }

  notifier.notify({title: title, message: message, wait: true});
};


var bundler = watchify(browserify({
  entries: ['./app.jsx'],
  transform: [reactify],
  extensions: ['.jsx'],
  debug: true,
  cache: {},
  packageCache: {},
  fullPaths: true
}));

function bundle() {
  return bundler
    .bundle()
    .on('error', notify)
    .pipe(source('mainJS.js'))
    .pipe(gulp.dest('./'))
}
bundler.on('update', bundle)

gulp.task('build', function() {
  bundle()
});

gulp.task('serve', function(done) {
    gulp.src('')
        .pipe(server({
            livereload: {
                enable: true,
                filter: function(filePath, cb) { //function to filter out files to watch (default filters out node_modules).
                    cb(/mainJS.js/.test(filePath));
                }
            },
            open: false //open the localhost server in the browser
        }));
});


gulp.task('compass', function() {
  gulp.src('sass/**/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: 'stylesheets',
      sass: 'sass'
    }))
    .pipe(concat('gstyle.css'))
    .pipe(gulp.dest('./css/'));
});
gulp.task('default', ['build', 'serve', 'compass', 'watch']);


//Watch task
gulp.task('watch',function() {
    gulp.watch('sass/**/*.scss',['compass']);
});