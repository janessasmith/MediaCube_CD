"use strict";
/**
 * created by zheng.lu in 2017.3.22
 */
angular.module('editingCenterWeixinRouterModule', [])
    .config(["$stateProvider", function($stateProvider) {
        $stateProvider.state('editctr.weixin', {
            url: "/weixin",
            views: {
                /*'weixin@editctr': {
                    templateUrl: './editingCenter/weixin/left_tpl.html',
                    controller: 'WeiXinLeftCtrl',
                }*/
            }
        });
    }]);


