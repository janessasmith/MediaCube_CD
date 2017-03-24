"use strict";
/**
 * created by zheng.lu in 2017.3.22
 */
angular.module('editingCenterAppRouterModule', [])
    .config(["$stateProvider", function($stateProvider) {
        $stateProvider.state('editctr.app', {
            url: '/app',
            views: {
                /*'app@editctr': {
                    templateUrl: './editingCenter/app/left_tpl.html',
                    controller: 'appLeftCtrl'
                }*/

            }
        });
    }]);
