// Requires
const { src, dest, series, parallel, watch, task } = require("gulp"),
  browserSync = require("browser-sync").create(),
  makeDir = require("make-dir"),
  clean = require("gulp-clean"),
  plumber = require("gulp-plumber"),
  notify = require("gulp-notify"),
  rename = require("gulp-rename"),
  newer = require("gulp-newer"),
  replace = require("gulp-replace"),
  include = require("gulp-file-include"),
  verCssJs = require("gulp-version-number"),
  minHtml = require("gulp-htmlmin"),
  groupSass = require("gulp-sass")(require("sass")),
  autoPrefix = require("gulp-autoprefixer"),
  groupCssMedia = require("gulp-group-css-media-queries"),
  minCss = require("gulp-clean-css"),
  webpackStream= require("webpack-stream"),
  terserPlugin= require("terser-webpack-plugin"),
  ttfToWoff2 = require("gulp-ttf2woff2"),
  minImage = require("gulp-imagemin"),
  toWebp = require("gulp-webp"),
  toSvgSprite = require("gulp-svg-sprite"),
  toZip = require("gulp-zip");

// Folders
const srcFolder = "./src";
const buildFolder = "./build";
const nodeModules = "./node_modules";
const path = {
  makeTemp: `${buildFolder}/temp`,
  deleteTemp: `${buildFolder}/temp/`,
  cleanZip: `${buildFolder}/*.zip`,
  srcHtml: `${srcFolder}/html/*.html`,
  buildHtml: `${buildFolder}/temp/`,
  srcScss: `${srcFolder}/scss/config.scss`,
  buildCss: `${buildFolder}/temp/css/`,
  srcJS: `${srcFolder}/js/config.js`,
  buildJS: `${buildFolder}/temp/js/`,
  srcFonts: `${srcFolder}/fonts/*.ttf`,
  buildFonts: `${buildFolder}/temp/fonts/`,
  srcImagesCopy: `${srcFolder}/images/*.*`,
  buildImages: `${buildFolder}/temp/images/`,
  srcImagesMinWebp: `${srcFolder}/images/img-webp/*.{png,jpeg,jpg}`,
  srcImagesSvgSprite: `${srcFolder}/images/svg-sprite/*.svg`,
  fulesToZip: `${buildFolder}/temp/**/*.*`,
  buildZip: `${buildFolder}/`
};

// Make temp
function funMakeTemp(done) {
  makeDir(path.makeTemp);
  done();
};
// Delete temp
function funDeleteTemp() {
  return src(path.deleteTemp, {read: false})
    .pipe(clean());
};
// Clean zip
function funCleanZip() {
  return src(path.cleanZip, {read: false})
    .pipe(clean());
};

// Html Dev
function funHtmlDev() {
  return src(path.srcHtml)
    .pipe(plumber(
      notify.onError({
        title: "funHtmlDev",
        message: "Error: <%= error.message %>"
    })))
    .pipe(include({
      prefix: "@"
    }))
    .pipe(verCssJs({
      "value": "%DT%",
      "cover" : 1,
      "append": {
        "key": "v",
        "to": ["css", "js"],
      },
    }))
    .pipe(dest(path.buildHtml));
};
// Html Build
function funHtmlBuild() {
  return src(path.srcHtml)
    .pipe(plumber(
      notify.onError({
        title: "funHtmlBuild",
        message: "Error: <%= error.message %>"
    })))
    .pipe(include({
      prefix: "@"
    }))
    .pipe(replace("style.css", "style.min.css"))
    .pipe(replace("script.js", "script.min.js"))
    .pipe(verCssJs({
      "value": "%DT%",
      "cover" : 1,
      "append": {
        "key": "v",
        "to": ["css", "js"],
      },
    }))
    .pipe(minHtml({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(dest(path.buildHtml));
};

// Libs
function funLibs(done) {
  // Scss-libs
  src(`${nodeModules}/destyle.css/destyle.css`)
    .pipe(newer(`${srcFolder}/scss/libs/destyle.css`))
    .pipe(dest(`${srcFolder}/scss/libs`));
  src(`${nodeModules}/swiper/swiper-bundle.css`)
    .pipe(newer(`${srcFolder}/scss/libs/swiper-bundle.css`))
    .pipe(dest(`${srcFolder}/scss/libs`));
  done();
};

// Scss Dev
function funScssDev() {
  return src(path.srcScss, { sourcemaps: true })
    .pipe(plumber(
      notify.onError({
        title: "funScssDev",
        message: "Error: <%= error.message %>"
    })))
    .pipe(groupSass())
    .pipe(autoPrefix({
      cascade: false,
      overrideBrowserslist: [
        "last 5 chrome version",
        "last 5 firefox version",
        "last 5 safari version"
    ]}))
    .pipe(groupCssMedia())
    .pipe(rename("style.css"))
    .pipe(dest(path.buildCss), { sourcemaps: "."})
};
// Scss Build
function funScssBuild() {
  return src(path.srcScss, { sourcemaps: false })
    .pipe(plumber(
      notify.onError({
        title: "funScssDev",
        message: "Error: <%= error.message %>"
    })))
    .pipe(groupSass())
    .pipe(autoPrefix({
      cascade: false,
      overrideBrowserslist: [
        "last 5 chrome version",
        "last 5 firefox version",
        "last 5 safari version"
    ]}))
    .pipe(groupCssMedia())
    .pipe(minCss({ level: 1 }))
    .pipe(rename("style.min.css"))
    .pipe(dest(path.buildCss), { sourcemaps: "."})
};

// JS Dev
function funJSDev() {
  return src(path.srcJS)
    .pipe(plumber(
      notify.onError({
        title: "funJSDev",
        message: "Error: <%= error.message %>"
    })))
    .pipe(webpackStream({
      mode: "development",
      devtool: 'inline-source-map',
      optimization: {
        minimize: false,
        minimizer: [new terserPlugin({
          extractComments: false,
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              defaults: false,
              unused: true
            },
            mangle: false,
            module: false,
            toplevel: false,
            keep_classnames: true,
            keep_fnames: true,
            format: {
              beautify: true
            }
          }
        })],
      }
    }))
    .pipe(rename("script.js"))
    .pipe(dest(path.buildJS));
};
// JS Build
function funJSBuild() {
  return src(path.srcJS)
    .pipe(plumber(
      notify.onError({
        title: "funJSBuild",
        message: "Error: <%= error.message %>"
    })))
    .pipe(webpackStream({
      mode: "production",
      cache: {
        type: 'filesystem'
      },
      optimization: {
        minimizer: [new terserPlugin({
          extractComments: false
        })],
      },
    }))
    .pipe(rename("script.min.js"))
    .pipe(dest(path.buildJS));
};

// Fonts
function funFonts() {
  return src(path.srcFonts)
    .pipe(plumber(
      notify.onError({
        title: "funFonts",
        message: "Error: <%= error.message %>"
    })))
    .pipe(newer(path.buildFonts))
    .pipe(ttfToWoff2())
    .pipe(dest(path.buildFonts))
};

// Images copy
function funImagesCopy() {
  return src(path.srcImagesCopy)
    .pipe(plumber(
      notify.onError({
        title: "funImagesCopy",
        message: "Error: <%= error.message %>"
    })))
    .pipe(newer(path.buildImages))
    .pipe(dest(path.buildImages));
};
// Images min
function funImagesMin() {
  return src(path.srcImagesMinWebp)
    .pipe(plumber(
      notify.onError({
        title: "funImagesMin",
        message: "Error: <%= error.message %>"
    })))
    .pipe(newer(path.buildImages))
    .pipe(minImage({
      progressive: true,
      interlaced: true,
      optimizationLevel: 3
    }))
    .pipe(dest(path.buildImages));
};
// Images webp
function funImagesWebp() {
  return src(path.srcImagesMinWebp)
    .pipe(plumber(
      notify.onError({
        title: "funImagesMin",
        message: "Error: <%= error.message %>"
    })))
    .pipe(newer(path.buildImages))
    .pipe(minImage({
      progressive: true,
      interlaced: true,
      optimizationLevel: 3
    }))
    .pipe(toWebp())
    .pipe(dest(path.buildImages));
};
// Images svg-sprite
function funSvgSprite() {
  return src(path.srcImagesSvgSprite)
    .pipe(plumber(
      notify.onError({
        title: "funSvgSprite",
        message: "Error: <%= error.message %>"
    })))
    .pipe(toSvgSprite({
      shape: {
        dest: "./",
      },
      svg: {
        xmlDeclaration: false
      }
    }))
    .pipe(dest(path.buildImages));
};

// Browser sync
function funBrowserSync(done) {
  browserSync.init({
      server: {
        baseDir: "./build/temp"
      },
      watch: false,
      notify: false,
      port: 3000
  });
  done();
};
// Browser reload
function funBrowserReload(done) {
  browserSync.reload();
  done();
};

// Wath files
function funWatchFiles() {
  watch([`${srcFolder}/html/*.html`, `${srcFolder}/html/include/*.htm`], series(funHtmlDev, funBrowserReload));
  watch([`${srcFolder}/scss/config.scss`, `${srcFolder}/scss/include/*.scss`, `${srcFolder}/scss/libs/*.*`], series(funScssDev, funBrowserReload));
  watch([`${srcFolder}/js/config.js`, `${srcFolder}/js/include/*.js`], series(funJSDev, funBrowserReload));
  watch(`${srcFolder}/images/*.*`, series(funImagesCopy, funBrowserReload));
  watch(`${srcFolder}/images/img-webp/*.{png,jpeg,jpg}`, series(parallel(funImagesMin, funImagesWebp), funBrowserReload));
  watch(`${srcFolder}/images/svg-sprite/*.svg`, series(funSvgSprite, funBrowserReload));
};

// Build.zip
function funBuildZip() {
  return src(path.fulesToZip)
    .pipe(plumber(
      notify.onError({
        title: "funBuildZip",
        message: "Error: <%= error.message %>"
    })))
    .pipe(toZip("build.zip"))
    .pipe(dest(path.buildZip));
};
// Build.min.zip
function funBuildMinZip() {
  return src(path.fulesToZip)
    .pipe(plumber(
      notify.onError({
        title: "funBuildMinZip",
        message: "Error: <%= error.message %>"
    })))
    .pipe(toZip("build.min.zip"))
    .pipe(dest(path.buildZip));
};

// Script dev
const taskDev = series(
  funMakeTemp,
  parallel(funDeleteTemp, funCleanZip, funLibs),
  parallel(funHtmlDev, funScssDev, funJSDev, funFonts, funImagesCopy, funImagesMin, funImagesWebp, funSvgSprite),
  parallel(funBrowserSync, funWatchFiles)
);

// Script build
const taskBuild = series(
  series(
    funMakeTemp,
    parallel(funDeleteTemp, funCleanZip),
    parallel(funHtmlDev, funScssDev, funJSDev, funFonts, funImagesCopy, funImagesMin, funImagesWebp, funSvgSprite),
    funBuildZip
  ),
  series(
    funMakeTemp,
    funDeleteTemp,
    parallel(funHtmlBuild, funScssBuild, funJSBuild, funFonts, funImagesCopy, funImagesMin, funImagesWebp, funSvgSprite),
    funBuildMinZip
  ),
  funDeleteTemp
);

// Tasks
task("default", taskDev);
task("build", taskBuild);