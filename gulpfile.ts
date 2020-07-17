import * as gulp from 'gulp';

const moveOn = (cb: () => void) => {
  gulp.src(['manifest.json']).pipe(gulp.dest('./dist'));
  gulp.src(['credentials.json']).pipe(gulp.dest('./dist'));
  cb();
};

export default gulp.series(moveOn);
