const { src, dest } = require("gulp");
const include = require("gulp-include");

function pages() {
  return src([
    "app/src/html/pages/**/*.html",
    "!app/src/html/pages/template/**/*.html",
  ])
    .pipe(
      include({
        includePaths: "app/src/html/components",
      })
    )
    .pipe(dest("app"));
}

module.exports = pages;
