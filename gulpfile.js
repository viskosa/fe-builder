var gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    stylus = require('gulp-stylus'),
    prettify = require('gulp-html-prettify'),
    jade = require('gulp-jade'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    watch = require('gulp-watch'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    gutil = require('gulp-util'),   // для отслеживания ошибок сборки
    filesJS = [                     
                './public/js/*.js',
                './public/js/modules/*.js'
                //'./public/js/lib/*.js'    // раскомментировать, если появятся файлы в папке lib
                ],
    paths = {                               // эти файлы отслеживаем на изменение - нужно для browserSync
                html:['index.html'],
                css:['./public/css/styl.css'],
                script:['./public/script/build.js']
            };
       
// BrowserSync ----------------------------
gulp.task('browserSync', function() {
    browserSync({
        server: { baseDir: "./"},
        open: true,
        notify: false
    });
});

// STYLUS --------------------------------
gulp.task('stylus', function () {
    return gulp.src('./public/styl/001general.styl') // берем general.styl, в который подключены все остальные styl-файлы
        //.pipe(sourcemaps.init()) 
        .pipe(stylus())                     // превращаем в css-файл
        .pipe(autoprefixer([
            'Android 2.3',
            'Android >= 4',
            'Chrome >= 20',
            'Firefox >= 24',
            'Explorer >= 8',
            'iOS >= 6',
            'Opera >= 12',
            'Safari >= 6'
        ]))
        //.pipe(sourcemaps.write())
        .pipe(concatCss('styl.css'))        // конкатенируем css-файлы (хотя он и так один?)
        .pipe(gulp.dest('./public/css'))    // и кладем в папку css
});

// CSS --------------------------------------
gulp.task('css', function() {
    return gulp.src(paths.css)              // берем файл style.css из папки css         
        .pipe(sourcemaps.init())
        .pipe(minifyCss())                  // минифицируем
        .pipe(sourcemaps.write())
        .pipe(rename('build.min.css'))      // переименовываем
        .pipe(gulp.dest('./public/build'))  // кладем в папку build
        .pipe(browserSync.reload({stream:true})); // и обновляем браузер
});

// JADE -------------------------------------
gulp.task('jade', function() {
    var YOUR_LOCALS = {};

    return gulp.src('./public/template/*.jade')
        .pipe(jade({
            locals: YOUR_LOCALS
        }))
        .pipe(prettify({indent_char: ' ', indent_size: 3}))
        .pipe(gulp.dest('./'))
})

// HTML -------------------------------------
gulp.task('html', function(){
    gulp.src(paths.html)                      // берем файл index.html
    .pipe(browserSync.reload({stream:true})); // и обновляем браузер
});

// IMAGES ------------------------------------
gulp.task('image', function () {
    return gulp.src('./public/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false},
            ],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./public/images/'));
});

// JS concat ---------------------------------
gulp.task('js', function() {
    return gulp.src(filesJS)                // сюда можно передать массив js-файлов напрямую
        .pipe(concat('build.js'))           // так будет называться результирующий файл
        .pipe(gulp.dest('./public/script')) // кладем в промежуточную папку script
});

// JS for browserSync ------------------------
gulp.task('js-sync', function() {
    return gulp.src(paths.script)           // берем файл build.js
        .pipe(sourcemaps.init())    
        .pipe(uglify())                     // минифицируем его
        .pipe(sourcemaps.write())
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })//для отображения ошибки сборки js-файлов. Вставлять в любой таск
        .pipe(rename('build.min.js'))       // переименовываем
        .pipe(gulp.dest('./public/build'))  // кладем в папку build
        .pipe(browserSync.reload({stream:true})); // и обновляем браузер
});

// WATCHER -----------------------------------
gulp.task('watch', function() {
    gulp.watch('./public/styl/*.styl', ['stylus']);
    gulp.watch(paths.css, ['css']);
    gulp.watch(filesJS, ['js']);            // отслеживаем все js-файлы
    gulp.watch(paths.script, ['js-sync']);
    gulp.watch("./public/template/*.jade", ['jade']);
    //gulp.watch('./public/js/*.js', ['js']); // можно и напрямую здесь указывать каждый js-файл
    gulp.watch(paths.html, ['html']);
});

gulp.task('default', ['watch', 'browserSync']);

