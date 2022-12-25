// gulpプラグインを読み込みます
const { src, dest, watch } = require("gulp");
// Sassをコンパイルするプラグインを読み込みます
const sass = require("gulp-sass")(require("sass"));
const webp = require('gulp-webp');
const rename = require('gulp-rename');


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


// npx gulpというコマンドを実行した時、watchSassFilesが実行されるようにします
exports.default = watchSassFiles;
exports.default = watchImagesFiles;