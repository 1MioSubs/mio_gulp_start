const { src, dest, watch, parallel, series } = require("gulp");
const browserSync = require("browser-sync").create();
const clean = require("gulp-clean");
const fs = require("fs");

const styles = require("./gulp/tasks/styles");
const scripts = require("./gulp/tasks/scripts");
const fonts = require("./gulp/tasks/fonts");
const images = require("./gulp/tasks/images");
const sprite = require("./gulp/tasks/sprite");
const pages = require("./gulp/tasks/pages");

function watching() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
    notify: false,
  });
  watch(["app/src/scss/**/*.scss"], styles);
  watch(["app/src/javascript/src/**/*.js"], scripts.all);
  watch(["app/src/javascript/libs/**/*.js"], scripts.libs);
  watch(["app/src/html/**/*.html"], pages);
  watch(["app/src/fonts/**/*.*"], fonts);
  watch(["app/src/images"], series(images.all, images.avif, images.webp));
  watch(
    [
      "app/images/**/*.svg",
      "!app/images/sprite.svg",
      "!app/images/stack",
      "!app/images/stack/sprite.stack.html",
    ],
    sprite.svg
  );
  watch(["app/*.html"]).on("change", browserSync.reload);
}

function cleanDist(done) {
  if (fs.existsSync("dist")) {
    return src("dist", { read: false }).pipe(clean({ force: true }));
  }
  done();
}

function building() {
  return src(
    [
      "app/css/*.css",
      "app/fonts/**/*.*",
      "app/images/**/*.*",
      "app/js/*.js",
      "app/**/*.html",
      // "!app/images/**/*.svg",
      // "app/images/sprite.svg",
      "!app/images/stack/sprite.stack.html",
      "!app/src/html/**/*.html",
    ],
    { base: "app" }
  ).pipe(dest("dist"));
}

exports.pages = pages;
exports.fonts = fonts;
exports.images = images;
exports.sprite = sprite;
exports.styles = styles;
exports.scripts = scripts.all;
exports.scriptsLibs = scripts.libs;
exports.watching = watching;
exports.cleanDist = cleanDist;
exports.building = building;

exports.resprite = series(sprite.clean, sprite.svg);
exports.build = series(cleanDist, building);
exports.default = parallel(
  styles,
  scripts.all,
  fonts,
  scripts.libs,
  series(images.all, sprite.svg),
  images.avif,
  images.webp,
  pages,
  watching
);
