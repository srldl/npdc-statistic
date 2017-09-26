var task = function(gulp, config) {
  'use strict';

  var runSequence = require('run-sequence').use(gulp);

  gulp.task('build', function(cb) {
    global.isProd = false;
    global.buildOnly = true;
    runSequence(['clean', 'info'], 'devCommon', 'lint', 'test', 'sass', 'browserify', 'copy-all', 'manifest', cb);
  });
};

module.exports = task;
