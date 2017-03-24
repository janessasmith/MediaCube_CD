 /*global module:false*/
 "use strict";
 /**
  * created by zheng.lu in 2017.2.27
  * modified by zheng.lu in 2017.3.24
  */
 module.exports = function(grunt) {
     // Project configuration.
     grunt.initConfig({
         // Metadata.
         pkg: grunt.file.readJSON('package.json'),

         banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
             '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
             '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
             '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
             ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

         jsfiles: [
             'app/app.js',
             'app/main.js',
             'app/appRouter.js',
             'app/login/**/*.js',
             'app/appHeader.js',
             'app/editingCenter/**/*.js',
             'app/components/**/*.js',
             '!app/components/util/ueditor/dialogs/**/*.js',
             '!app/components/service/editPicture/trsCutPicture/cropper/js/*.js'
         ],
         jsfiles2: [ //碎片化可视化编辑
             'app/login/*.js',
             'app/editingCenter/service/initSelectedService/trsSingleSelectionService.js',
             'app/components/util/bootstrapPaginator/*.js',
             'app/components/service/sweetalert/*.js',
             'app/components/util/colorPicker/*.js',
             'app/components/service/selectDocument/*.js',
             'app/components/util/dateTimePicker/*.js',
             'app/components/util/dropListUtil/*.js',
             'app/components/util/smallIcon/*.js',
             'app/components/util/trsHttpService/httpService.js',
             'app/components/util/trsMessage/*.js',
             'app/components/util/trsTree/*.js',
             'app/components/util/trsImageUpload/*.js',
             'app/components/util/trsCheckbox/*.js',
             'app/components/filter/trslimitTo/*.js',
             'app/components/util/trsDropDownList/*.js',
             'app/components/service/spliceString/*.js',
             '!app/components/util/ueditor/dialogs/material/internal.js'
         ],
         cssfiles: [
             'app/app.css',
             'app/login/*.css',
             'app/login/**/*.css',
             'app/editingCenter/**/*.css',
             'app/components/**/*.css',
             '!app/components/util/ueditor/dialogs/**/*.css',
             '!app/components/util/ueditor/service/css/ueditorBuiltInStyles.css',
             '!app/components/service/editPicture/trsCutPicture/cropper/css/*.css'
         ],
         otherFiles: [
             'lib/**/*',
             'components/**/*',
             'i18n/**/*',
             'login/**/*',
             '!login/**/*.css',
             '!login/**/*.less',
             '!login/**/*.js',
             'main.js'
         ],
         // Task configuration.
         less: {
             dist: {
                 files: [{
                     expand: true,
                     cwd: 'app',
                     src: [
                         '**/*.less',
                         '!*.less',
                         '!bower_components/**/*.less',
                         '!lib/**/*.less',
                     ],
                     dest: 'app',
                     ext: '.css'
                 }]
             },
         },
         concat: {
             options: {
                 banner: '/**\n * <%= pkg.name %> - concat JS for app\n * @licence <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)\n */\n\n\n'
             },
             js: {
                 // src: ['src/**/*.js'],
                 src: '<%= jsfiles %>',
                 dest: 'dist/<%= pkg.name %>.js'
             },
             js2: {
                 src: '<%= jsfiles2 %>',
                 dest: 'dist/editingCenter/website/fragmentManagement/visualEditing/js/visualEditing.js'
             },
             css: {
                 src: '<%= cssfiles %>',
                 dest: 'dist/<%= pkg.name %>.css'
             }
         },
         replace: { // 对应css和js生成版本号，避免css和js缓存
             indexjs: {
                 options: {
                     patterns: [{
                         match: /js\?v=(\d{14})/,
                         replacement: 'js?v=<%= grunt.template.today("yyyymmddHHmmss") %>'
                     }]
                 },
                 files: [{
                     src: ['dist/index.html'],
                     dest: 'dist/index.html'
                 }]
             },
             indexcss: {
                 options: {
                     patterns: [{
                         match: /css\?v=(\d{14})/,
                         replacement: 'css?v=<%= grunt.template.today("yyyymmddHHmmss") %>'
                     }]
                 },
                 files: [{
                     src: ['dist/index.html'],
                     dest: 'dist/index.html'
                 }]
             },
             htmlreplace: {
                 options: {
                     patterns: [{
                         match: /_tpl\.html+(\?v=(\d{14}))?/g,
                         replacement: '_tpl.html?v=<%= grunt.template.today("yyyymmddHHmmss") %>'
                     }]
                 },
                 files: [{
                     src: ['dist/app.js'],
                     dest: 'dist/app.js'
                 }]
             }
         },
         jshint: {
             options: {
                 curly: false,
                 eqeqeq: false,
                 newcap: false,
                 noarg: false,
                 sub: false,
                 undef: true,
                 boss: true,
                 node: true,
                 '-W033': true, // ignore: Missing semicolon
                 globals: {}
             },
             gruntfile: {
                 src: 'Gruntfile.js'
             },
             app: {
                 src: ['<%= concat.js.dest %>']
             },
             lib_test: {
                 src: ['lib/**/*.js', 'test/**/*.js']
             }
         },
         uglify: {
             options: {
                 banner: '<%= banner %>'
             },
             dist: {
                 src: '<%= concat.js.dest %>',
                 dest: 'dist/<%= pkg.name %>.min.js'
             }
         },
         cssmin: {
             options: {
                 banner: '<%= banner %>'
             },
             dist: {
                 src: '<%= concat.css.dest %>',
                 dest: 'dist/<%= pkg.name %>.min.css'
             }
         },
         qunit: {
             files: ['test/**/*.html']
         },
         copy: {
             edit: {
                 files: [{
                     expand: true,
                     cwd: 'app',
                     flatten: false,
                     src: [
                         'editingCenter/**/*',
                         '!editingCenter/**/*.js',
                         '!editingCenter/**/*.css',
                         '!editingCenter/**/*.less'
                     ],
                     dest: 'dist'
                 }]
             },
             other: {
                 files: [{
                     expand: true,
                     cwd: 'app',
                     flatten: false,
                     src: '<%= otherFiles %>',
                     dest: 'dist/'
                 }]
             },
             rootHtmlFile: {
                 files: [{
                     expand: true,
                     cwd: 'app',
                     flatten: false,
                     src: ['*.html'],
                     dest: 'dist/'
                 }]
             },
         },
         bower: {
             install: {
                 options: {
                     targetDir: 'dist/lib',
                     layout: 'byComponent',
                     install: true,
                     verbose: false,
                     cleanTargetDir: false,
                     cleanBowerDir: false,
                     bowerOptions: {}
                 }
             }
         },

         html2js: {
             options: {
                 // custom options, see below
             },
             main: {
                 src: ['app/components/htmlTemplates/*.html'],
                 dest: 'app/components/htmlTemplates/templates.js'
             }
         },
         // 配置一个静态文件 Web 服务器，用于在修改文件后自动刷新网页，从而看到修改效果
         connect: {
             options: {
                 port: 80,
                 hostname: 'localhost', // 默认就是这个值，可配置为本机某个 IP，localhost 或域名
                 livereload: 35729 // 声明给 watch 监听的端口
             },
             server: {
                 options: {
                     open: true, // 自动打开网页 http://
                     base: [
                         'dist' // 指定主目录
                     ]
                 }
             }
         },
         watch: {
             gruntfile: {
                 files: '<%= jshint.gruntfile.src %>',
                 tasks: ['jshint:gruntfile']
             },
             appjs: {
                 files: ['app/**/*.js'],
                 tasks: [ /*'jshint:app',*/ 'copy:app', 'html2js', 'concat', 'replace',
                     'uglify'
                 ]
             },
             appcss: {
                 files: ['app/**/*.css'],
                 tasks: [ /*'jshint:app',*/ 'cssmin', 'copy:app', 'concat', 'replace']
             },
             livereload: {
                 options: {
                     livereload: '<%=connect.options.livereload%>' // 监听前面声明的端口  35729
                 },

                 files: [ // 下面文件的改变会实时刷新网页
                     'dist/**/*'
                 ]
             },
             lib_test: {
                 files: '<%= jshint.lib_test.src %>',
                 tasks: ['jshint:lib_test', 'qunit']
             },
             watchrootHtmlFile: {
                 files: ['app/**/*.html'],
                 tasks: ['copy:rootHtmlFile']
             }
         }
     });

     // These plugins provide necessary tasks.
     grunt.loadNpmTasks('grunt-contrib-less');
     grunt.loadNpmTasks('grunt-contrib-concat');
     grunt.loadNpmTasks('grunt-contrib-jshint');
     grunt.loadNpmTasks('grunt-contrib-cssmin');
     grunt.loadNpmTasks('grunt-contrib-copy');
     grunt.loadNpmTasks('grunt-bower-task');
     grunt.loadNpmTasks('grunt-contrib-uglify');
     grunt.loadNpmTasks('grunt-replace');

     // Default task.
     grunt.registerTask('default', [ /*'jshint:app',*/ 'copy',
         'bower', 'less', 'concat', 'replace', 'uglify', 'cssmin' /* 'watch'*/
     ]);
     // LESS to CSS
     grunt.registerTask('lessTask', ['less', 'concat:css']);
 };
