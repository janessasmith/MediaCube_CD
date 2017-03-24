"use strict";
/**
 * created by zheng.lu in 2017.3.22
 */
angular.module('editingCenterWeiboRouterModule', [])
    .config(["$stateProvider", function($stateProvider) {
        $stateProvider.state('editctr.weibo', {
            url: '/weibo',
            views: {
                /*'app@editctr': {
                    templateUrl: './editingCenter/weibo/left_tpl.html',
                    controller: 'weiboLeftCtrl'
                }*/
            }
        });
    }]);
