const { series, watch, src, dest, parallel } = require('gulp');
const pump = require('pump');
const beeper = require('beeper');
const browserSync = require('browser-sync').create();
const zip = require('gulp-zip');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const cssnano = require('cssnano');

const postcss = require('gulp-postcss');
const postcssPresetEnv = require('postcss-preset-env');
const postcssNested = require('postcss-nested');
const postcssCustomMedia = require('postcss-custom-media');
const postcssImport = require('postcss-import');
const postcssential = require('postcss-cssential');
const postcssMixins = require('postcss-mixins');
const postcssCustomProperties = require('postcss-custom-properties');
const postcssColor = require('postcss-color-function');

// Define base folders
const asset_src = 'assets/';
const asset_dist = 'assets/dist/';
const npm_src   = 'node_modules/';

// Browsersync init
const serve = done => {
  browserSync.init({
    port: 3368,
    proxy: 'http://localhost:2368/'
  });
  done();
};

// Handle reload
const reload = done => {
  browserSync.reload();
  done();
};

// Handle errors
const handleError = done => (
  (err) => {
    if (err) {
      beeper();
    }
    return done(err);
  }
);

// Handle icons
const icons = done => {
  pump (
    [
      src(`${npm_src}feather-icons/dist/feather-sprite.svg`),
      dest(`${asset_src}icons`)
    ],
    handleError(done)
  )
};

// Handle CSS
const css = done => {
  const processors = [
    postcssImport(),
    postcssMixins(),
    postcssCustomMedia(),
    postcssNested(),
    postcssCustomProperties({preserveCustomProps: false}),
    postcssColor({preserveCustomProps: false}),
    postcssential({
			output: 'default.hbs',
			cssComment: '!cssential',
			htmlComment: 'cssential',
			removeOriginal: true
		}),
    postcssPresetEnv({
      browsers: '> .5% or last 2 versions',
      stage: 2,
      features: {
        'nesting-rules': false
      }
    }),
    cssnano({preset: 'advanced'})
  ];

  pump(
    [
      src('assets/css/app.css', {sourcemaps: true}),
      postcss(processors),
      rename({suffix: '.min'}),
      dest(asset_dist, {sourcemaps: '.'})
    ],
    handleError(done)
  );
};

// Handle Js
const js = done => {
  pump(
    [
      src([
        `${npm_src}@tryghost/content-api/umd/content-api.min.js`,
        `${npm_src}ghost-search/dist/ghost-search.min.js`,
        `${npm_src}vanilla-lazyload/dist/lazyload.min.js`,
        `${npm_src}fitvids/dist/fitvids.min.js`,
        `${npm_src}prismjs/prism.js`,
        `${npm_src}fslightbox/index.js`,
        `${npm_src}tocbot/dist/tocbot.min.js`,
        `${asset_src}js/script.js`
      ], { sourcemaps: true }),
      babel({
        'presets': [
          [
            '@babel/preset-env', {
              'modules': false
            }
          ]
        ]
      }),
      concat('app.js'),
      rename({suffix: '.min'}),
      uglify(),
      dest(asset_dist, { sourcemaps: '.' })
    ],
    handleError(done)
  );
};

// Handle Zipping
const zipper = done => {
  const targetDir = 'dist/';
  const themeName = require('./package.json').name;
  const filename = `${themeName}.zip`;
  
  pump(
    [
      src([ 
        '**',
        '!node_modules', 
        '!node_modules/**', 
        '!dist', 
        '!dist/**',
        '!package-lock.json',
        '!.github',
        '!TODO.md',
        '!ROADMAP.md',
        '!home2.hbs',
        '!home3.hbs'
      ]),
      zip(filename),
      dest(targetDir)
    ],
    handleError(done)
  );
};

// Handle tasks
const cssWatch = () => watch('assets/css/**', series(css, reload));
const jsWatch = () => watch('assets/js/**', series(js, reload));
const hbsWatch = () => watch([
  '*.hbs', 
  'partials/**/*.hbs', 
  'members/**/*.hbs',
  '!node_modules/**/*.hbs'], series(reload));
const watcher = parallel(cssWatch, jsWatch, hbsWatch);
const build = series(icons, css, js);
const dev = series(build, serve, watcher);

exports.icons = icons;
exports.css = css;
exports.js = js;
exports.zip = series(build, zipper);
exports.default = dev;
