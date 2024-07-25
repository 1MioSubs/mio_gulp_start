const { src, dest } = require("gulp");
const clean = require("gulp-clean");
const svgSprite = require("gulp-svg-sprite");
const browserSync = require("browser-sync");
const fs = require("fs");

function cleanSprite(done) {
  if (fs.existsSync("app/images/sprite.svg")) {
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

module.exports = {
  clean: cleanSprite,
  svg: spriteSvg,
};
