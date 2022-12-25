// gulpプラグインを読み込みます
const { src, dest, watch, series, parallel } = require("gulp");
// Sassをコンパイルするプラグインを読み込みます
const ejs  = require('gulp-ejs');
const sass = require("gulp-sass")(require("sass"));
const webp = require('gulp-webp');
const rename = require('gulp-rename');


/**
 * ejsをコンパイルするタスクです
 */
const compileEjs = () =>
  // ejsフォルダー以下の拡張子がejsのファイルを取得
  src(["src/ejs/**/*.ejs", '!' + "src/ejs/**/_*.ejs"])
    // ejsをコンパイル
    .pipe(ejs({}, { ext: '.html'}))
    // .pipe(ejs({
    //   // オプションを追加
    //   msg: 'Hello Gulp!'
    // }))
    .pipe(rename({
      extname: '.html'
    }))
    // htmlフォルダー以下に保存
    .pipe(dest("dist"));

/**
 * ejsファイルを監視し、変更があったら変換します
 */
const watchEjsFiles = () => watch("src/ejs/**/*.ejs", compileEjs);


/**
 * Sassをコンパイルするタスクです
 */
const compileSass = () =>
  // style.scssファイルを取得
  src("src/scss/style.scss")
    // Sassのコンパイルを実行
    .pipe(
      // コンパイル後のCSSを展開
      sass({
        outputStyle: "expanded"
      })
    )
    // cssフォルダー以下に保存
    .pipe(dest("dist/css"));

/**
 * Sassファイルを監視し、変更があったらSassを変換します
 */
const watchSassFiles = () => watch("src/scss/style.scss", compileSass);

/**
 * imagesをwebpに変換するタスクです
 */
const convertWebp = () =>
  // imagesフォルダー以下の拡張子がjpgかpngのファイルを取得
  src("src/images/**/*.{jpg,png}")
    .pipe(rename(function(path) {
      path.basename += path.extname;
    }))
    // webpに変換
    .pipe(webp())
    // .pipe(webp({
    //   // オプションを追加
    //   quality: 70,
    //   method: 6,
    // }))
    // imagesフォルダー以下に保存
    .pipe(dest("dist/images"));

/**
 * imagesファイルを監視し、変更があったらwebpに変換します
 */
const watchImagesFiles = () => watch("src/images/**/*.{jpg,png}", convertWebp);


// npx gulpコマンド実行時
exports.default = series(
  compileEjs,
  compileSass,
  convertWebp,
  parallel(watchEjsFiles, watchSassFiles, watchImagesFiles));
