'use strict';
/**
 * created by zhuang.xiqi in 2017.3.23
 */
angular.module('util.trsSearch', ['util.trsSingleSelection'])
    .directive('trsSearch', [function() {
        return {
            restrict: 'E',
            // replace: true,
            templateUrl: './components/util/trsSearch/trsSearch_tpl.html'
        };
    }]);
