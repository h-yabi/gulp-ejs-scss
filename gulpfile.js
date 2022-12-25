// gulpプラグインを読み込みます
const { src, dest, watch, series, parallel } = require("gulp");
const browserSync = require('browser-sync');
const ejs  = require('gulp-ejs');
const sass = require("gulp-sass")(require("sass"));
const webp = require('gulp-webp');
const rename = require('gulp-rename');
const uglify = require("gulp-uglify");


/**
 * serverを立ち上げるタスクです
 */
const browserSyncFunc = () => {
  browserSync.init({
    //デフォルトの connected のメッセージ非表示
    notify: false,
    server: {
      baseDir: 'dist',
    },
    startPath: './index.html',
    reloadOnRestart: true,
  });
};

// ブラウザ自動リロード
const browserReloadFunc = (done) => {
  browserSync.reload();
  done();
};


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
const watchEjsFiles = () => watch("src/ejs/**/*.ejs", series(compileEjs, browserReloadFunc));


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
const watchSassFiles = () => watch("src/scss/style.scss", series(compileSass, browserReloadFunc));


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
const watchImagesFiles = () => watch("src/images/**/*.{jpg,png}", series(convertWebp, browserReloadFunc));


/**
 * jsをコンパイルするタスクです
 */
const compileJs = () =>
  // jsフォルダー以下の拡張子がjsのファイルを取得
  src("src/js/**/*.js")
    // jsをコンパイル
    .pipe(uglify())
    // .pipe(rename({
    //   extname: '.min.js'
    // }))
    // jsフォルダー以下に保存
    .pipe(dest("dist/js"));

/**
 * jsファイルを監視し、変更があったらSassを変換します
 */
const watchJsFiles = () => watch("src/js/**/*.js", series(compileJs, browserReloadFunc));



// npx gulpコマンド実行時
exports.default = series(
  compileEjs,
  compileSass,
  compileJs,
  convertWebp,
  parallel(watchEjsFiles, watchSassFiles, watchJsFiles, watchImagesFiles, browserSyncFunc));
