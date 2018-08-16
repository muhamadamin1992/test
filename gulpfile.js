var gulp        = require('gulp'),

	browserSync = require('browser-sync').create(),

	postcss = require('gulp-postcss'),

	sourcemaps = require('gulp-sourcemaps'),

	assets  = require('postcss-assets'),

	autoprefixer = require('autoprefixer');

	sass        = require('gulp-sass');



// Static Server + watching scss/html files

gulp.task('serve', function() {



    browserSync.init({

        server: "./"

    });

    gulp.watch("*.html").on('change', browserSync.reload);

});



// Compile sass into CSS & auto-inject into browsers




gulp.task('default', ['serve']);