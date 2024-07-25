const { src, dest } = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync");

function styles() {
  return src("app/src/scss/*.scss")
    .pipe(scss({ outputStyle: "expanded" })) //compressed - expanded
    .pipe(rename({ suffix: ".min" }))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 versions"],
        add: true,
        grid: false,
      })
    )
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

module.exports = styles;
