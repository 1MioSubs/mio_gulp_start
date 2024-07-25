const { src, dest } = require("gulp");
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");

function fonts() {
  return src("app/src/fonts/*.{ttf,otf}")
    .pipe(fonter({ formats: ["woff", "ttf"] })) // Преобразуем .ttf и .otf в .woff
    .pipe(dest("app/fonts"))
    .pipe(src("app/fonts/*.ttf")) // Берем только .ttf для преобразования в .woff2
    .pipe(ttf2woff2())
    .pipe(dest("app/fonts"));
}

module.exports = fonts;
