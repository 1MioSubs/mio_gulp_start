const { src, dest, watch, parallel, series } = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const clean = require("gulp-clean");
const avif = require("gulp-avif");
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin");
const rename = require("gulp-rename");
const newer = require("gulp-newer");
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");
const svgSprite = require("gulp-svg-sprite");
const include = require("gulp-include");
const fsdir = require("fs");

function pages() {
  return src(["app/src/html/pages/**/*.html", "!app/src/html/pages/template/**/*.html"])
    .pipe(
      include({
        includePaths: "app/src/html/components",
      })
    )
    .pipe(dest("app"));
}

function fonts() {
  return src("app/src/fonts")
    .pipe(
      fonter({
        formats: ["woff", "ttf"],
      })
    )
    .pipe(src("app/fonts/*.ttf"))
    .pipe(ttf2woff2())
    .pipe(dest("app/fonts"));
}

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

function cleanSprite(done) {
  if (fsdir.existsSync("app/images/sprite.svg")) {
    return src([
      "app/images/sprite.svg",
      "app/images/stack/sprite.stack.html",
    ]).pipe(clean());
  }
  done();
}

function spriteSvg() {
  return src([
    "app/images/**/*.svg",
    "!app/images/sprite.svg",
    "!app/images/stack",
    "!app/images/stack/sprite.stack.html",
  ])
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
    .pipe(dest("app/images/"))
    .pipe(browserSync.stream());
}

function styles() {
  return (
    src("app/src/scss/*.scss")
      .pipe(scss({ outputStyle: "expanded" })) //compressed -  expanded
      // .pipe(concat("style.min.css"))
      .pipe(rename({ suffix: ".min" }))
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 10 versions"],
          add: true,
          grid: false,
        })
      )
      .pipe(dest("app/css"))
      .pipe(browserSync.stream())
  );
}

function scripts() {
  return (
    src(["app/src/javascript/src/**/*.js"])
      // .pipe(concat("main.min.js"))
      .pipe(rename({ suffix: ".min" }))
      .pipe(uglify())
      .pipe(dest("app/js"))
      .pipe(browserSync.stream())
  );
}

function scriptsLibs() {
  return (
    src([
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
      // .pipe(rename({ suffix: ".min" }))
      .pipe(uglify())
      .pipe(dest("app/js"))
      .pipe(browserSync.stream())
  );
}

function watching() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
    notify: false,
  });
  watch(["app/src/scss/**/*.scss"], styles);
  watch(["app/js/src/**/*.js"], scripts);
  watch(["app/js/libs/**/*.js"], scriptsLibs);
  watch(["app/src/html/**/*.html"], pages);
  watch(["app/src/fonts/**/*.*"], fonts);
  watch(["app/src/images"], series(imagesAll, imagesAvif, imagesWebp));
  watch(
    [
      "app/images/**/*.svg",
      "!app/images/sprite.svg",
      "!app/images/stack",
      "!app/images/stack/sprite.stack.html",
    ],
    spriteSvg
  );
  watch(["app/*.html"]).on("change", browserSync.reload);
}

function cleanDist(done) {
  if (fsdir.existsSync("dist")) {
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
exports.imagesAll = imagesAll;
exports.imagesAvif = imagesAvif;
exports.imagesWebp = imagesWebp;
exports.cleanSprite = cleanSprite;
exports.spriteSvg = spriteSvg;
exports.styles = styles; 
exports.scripts = scripts;
exports.watching = watching;
exports.cleanDist = cleanDist;
exports.building = building;

exports.resprite = series(cleanSprite, spriteSvg);
exports.build = series(cleanDist, building);
exports.default = parallel(
  styles,
  scripts,
  fonts,
  scriptsLibs,
  series(imagesAll, spriteSvg),
  imagesAvif,
  imagesWebp,
  pages,
  watching
);
