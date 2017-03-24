'use strict'
/**
 * created by zhuang.xiqi in 2017.3.24
 */
angular.module('util.trsPager', [])
    .directive('trsPager', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            templateUrl: './components/util/trsPager/trsPager.html',
            scope: {
                previousHide: '@', /* 是否隐藏 上一页 按钮，默认值：false */
                nextHide: '@', /* 是否隐藏 下一页 按钮，默认值：false */
                previousText: '@', /* 上一页按钮的显示文本 */
                nextText: '@', /* 下一页按钮的显示文本 */
                loop: '@', /* 末页是否跳转到首页 */
                curPage: '=', /* 当前页 */
                pagesSize: '=', /* 总页数 */
                callback: '&' /* 回调方法 */
            },
            link: function (scope, iElement, iAttrs) {
                scope.previousHide = scope.previousHide || false;
                scope.nextHide = scope.nextHide || false;
                scope.previousText = scope.previousText || '上一页';
                scope.nextText = scope.nextText || '下一页';
                scope.curPage = scope.curPage || 1;
                scope.loop = scope.loop || false;
                scope.pagesSize = scope.pagesSize || 1;
                scope.setPage = function (num, callback) {
                    if (num < 1 || num > scope.pagesSize) {
                        if (scope.loop) {
                            scope.curPage = 1;//超出索引返回第一页
                            $timeout(function () {
                                callback();
                            });
                        }
                        return false;
                    }
                    scope.curPage = num;
                    $timeout(function () {
                        callback();
                    });
                };
            }
        };
    }])
    ;