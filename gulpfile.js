let project_folder = require('path').basename(__dirname),
    src_folder = 'src';

let path = {
    build: {
        html: project_folder + '/',
        css: project_folder + '/css/',
        js: project_folder + '/js/',
        img: project_folder + '/img/'
    },
    src: {
        html: src_folder + '/*.html',
        css: src_folder + '/styles/style.scss',
        js: src_folder + '/js/script.js',
        img: src_folder + '/img/**/*.+(png|jpg|gif|ico|svg|webp)'
    },
    watch: {
        html: src_folder + '/**/*.html',
        css: src_folder + '/styles/**/*.scss',
        js: src_folder + '/js/**/*.js',
        img: src_folder + '/img/**/*.{jpg, png, svg, gif, ico, webp}'
    },
    clean: './' + project_folder + '/'
}

let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    fileinclude = require('gulp-file-include'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin');


function browserSync() {
    browsersync.init({
        server: {
            baseDir: './' + project_folder + '/'
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: 'expanded'
            })
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: '.min.css'
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude({
            prefix: '--'
        }))
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(
            rename({
                extname: '.min.js'
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images() {
    return src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true,
            optimizationLevel: 3 // 0 to 7
        }))
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], images)
}

let build = gulp.series( gulp.parallel(js, css, html, images));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;