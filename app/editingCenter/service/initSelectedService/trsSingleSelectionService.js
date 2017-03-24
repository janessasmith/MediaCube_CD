"use strict";
/**
 *  Module 单选框的数据
 * created by zheng.lu in 2017.3.14
 */
angular.module('initSingleSelectionModule', []).factory('initSingleSelecet', ['trsHttpService', '$q', function(trsHttpService, $q) {
    return {
        // 网站稿件类型
        websiteDocType: function() {
            var docTypeJsons = [{
                name: "稿件类型",
                value: ""
            }, {
                name: "文字",
                value: "20"
            }, {
                name: "链接",
                value: "30"
            }, {
                name: "文件",
                value: "40"
            }, {
                name: "图片",
                value: "50"
            }, {
                name: "视频",
                value: "60"
            }];
            return docTypeJsons;
        },
        // 网站稿件时间排序
        websiteTimeType: function() {
            var timeTypeJsons = [{
                name: "全部时间",
                value: ""
            }, {
                name: "一天之内",
                value: "1d"
            }, {
                name: "一月之内",
                value: "1m"
            }, {
                name: "一年之内",
                value: "1y"
            }];
            return timeTypeJsons;
        },
        // 网站全文检索
        websiteESCondition: function() {
            var websiteESConditionJsons = [{
                name: "全部",
                value: ""
            }, {
                name: "文档",
                value: "DocId"
            }, {
                name: "创建人",
                value: "CrUser"
            }, {
                name: "标题",
                value: "DocTitle"
            }, {
                name: "正文",
                value: "DocContent"
            }];
            return websiteESConditionJsons;
        }

    };
}]);
