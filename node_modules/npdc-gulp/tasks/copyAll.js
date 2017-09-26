var task = function(gulp, config) {
  'use strict';

  gulp.task('copy-all', ['copy-html', 'copy-assets', 'copy-deps-assets', 'copy-shared-assets']);
};

module.exports = task;
