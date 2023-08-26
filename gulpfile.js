const { src, dest, watch, parallel, series} = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const clean = require("gulp-clean");
const avif = require("gulp-avif");
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");
const svgSprite = require("gulp-svg-sprite");
const include = require("gulp-include");

function pages() {
  return src("app/html/pages/*.html")
    .pipe(include({
      includePaths: "app/html/components"
    }))
    .pipe(dest("app"))
    .pipe(browserSync.stream())
}

function fonts() {
  return src("app/src/fonts/**/*.*")
    .pipe(fonter({
      formats: ['woff', 'ttf']
    }))
    .pipe(src("app/fonts/*.ttf"))
    .pipe(ttf2woff2())
    .pipe(dest("app/fonts"))
}

function images() {
  return src(["app/src/images/**/*.*", "!app/src/images/**/*.svg"])
    .pipe(newer("app/images"))
    .pipe(avif({ quality: 50 }))
    .pipe(src("app/src/images/**/*.*"))
    .pipe(newer("app/images"))
    .pipe(webp())
    .pipe(src("app/src/images/**/*.*"))
    .pipe(newer("app/images"))
    .pipe(imagemin())
    .pipe(dest("app/images"));
}

function cleanSprite() {
  return src("app/images/sprite")
    .pipe(clean());
}

function spriteSvg() {
  return src("app/images/**/*.svg")
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
            example: true,
          },
        },
      })
    )
    .pipe(dest("app/images/sprite"));
}

function styles() {
  return src("app/scss/style.scss")
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version']}))
    .pipe(concat("style.min.css"))
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(dest("app/css"))
    .pipe(browserSync.stream())
}

function scripts() {
  return src(["app/js/main.js"])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream())
}

function watching() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
  watch(["app/scss/**/*.scss"], styles);
  watch(["app/src/images"], images);
  watch(["app/js/**/*.js", "!app/js/main.min.js"], scripts);
  watch(["app/html/**/*.html"], pages);
  watch(["app/*.html"]).on("change", browserSync.reload);
}

function cleanDist() {
  return src("dist")
    .pipe(clean())
}

function building() {
  return src(
    [
      "app/css/style.min.css",
      "app/fonts/**/*.*",
      "app/images/**/*.*",
      "app/js/main.min.js",
      "app/**/*.html",
      "!app/images/sprite/stack/sprite.stack.html",
      "!app/html/**/*.html",
    ],
    { base: "app" }
  ).pipe(dest("dist"));
}

exports.pages = pages;
exports.fonts = fonts;
exports.images = images;
exports.cleanSprite = cleanSprite;
exports.spriteSvg = spriteSvg;
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.cleanDist = cleanDist;
exports.building = building;

exports.sprite = series(cleanSprite, spriteSvg);
exports.build = series(cleanDist, cleanSprite, spriteSvg, building);
exports.default = parallel(styles, series(images, spriteSvg), scripts, pages, watching);
