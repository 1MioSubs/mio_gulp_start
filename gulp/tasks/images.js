const { src, dest } = require("gulp");
const avif = require("gulp-avif");
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const browserSync = require("browser-sync");

function imagesAvif() {
  return src(["app/src/images/**/*.*", "!app/src/images/**/*.svg"])
    .pipe(newer("app/images/avif"))
    .pipe(avif({ quality: 50 }))
    .pipe(dest("app/images/avif"))
    .pipe(browserSync.stream());
}

function imagesWebp() {
  return src(["app/src/images/**/*.*", "!app/src/images/**/*.svg"])
    .pipe(newer("app/images/webp"))
    .pipe(webp())
    .pipe(dest("app/images/webp"))
    .pipe(browserSync.stream());
}

function imagesAll() {
  return src("app/src/images/**/*.*")
    .pipe(newer("app/images"))
    .pipe(imagemin())
    .pipe(dest("app/images"))
    .pipe(browserSync.stream());
}

module.exports = {
  avif: imagesAvif,
  webp: imagesWebp,
  all: imagesAll,
};
