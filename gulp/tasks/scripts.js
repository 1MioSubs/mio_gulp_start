const { src, dest } = require("gulp");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const rename = require("gulp-rename");
const browserSync = require("browser-sync");

function allScripts() {
  return src(["app/src/javascript/src/**/*.js"])
    .pipe(rename({ suffix: ".min" }))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

function libs() {
  return src([
    // "node_modules/jquery/dist/jquery.js",
    // "node_modules/aos/dist/aos.js",
    // "node_modules/ion-rangeslider/js/ion.rangeSlider.js",
    // "node_modules/jquery-form-styler/dist/jquery.formstyler.js",
    // "node_modules/slick-carousel/slick/slick.js",
    // "node_modules/rateyo/src/jquery.rateyo.js",
    // "node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js",
    // "node_modules/@fancyapps/ui/dist/fancybox/fancybox.umd.js",
    "app/src/javascript/libs/**/*.js",
  ])
    .pipe(concat("libs.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

module.exports = { all: allScripts, libs: libs };
