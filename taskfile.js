const del = require('del');
const browserSync = require('browser-sync');

const sources = 'src/';
const dist = 'build';
const scss = `${sources}scss/**/styles.scss`;
const js = `${sources}js/**/*.js`;


module.exports = {
  *serve(task) {
    browserSync({
      port: 3000,
      server: `${dist}`
    });
    yield Promise.resolve(task.$.log('> Listening on localhost:3000'));
  },

  *clean(task) {
    del([`${dist}`]);
    yield Promise.resolve(task.$.log(`/${dist} cleaned up!`));
  },

  *styles(task) {
    yield task
      .source(scss)
      .sass({outputStyle:'expanded'})
      .autoprefixer()
      .target(`${dist}/css`);
  },

  *babel(task) {
    yield task
      .source(js)
      .babel({
        presets: ['es2015'],
        sourceMaps: true //=> external; also 'inline' or 'both'
      })
      .target(`${dist}/js`);
  },

  *build(task) {
    yield task
      .parallel(['clean','styles', 'babel']);
  }
};
