"use strict";
/**
 * created by zheng.lu in 2017.2.27
 */
angular.module('editingCenterRouterModule', [])
    .config(["$stateProvider", function($stateProvider) {
        $stateProvider.state("editctr", {
            url: '/editctr',
            views: {
                '': {
                    templateUrl: './editingCenter/index_tpl.html',
                    controller: 'EditingCenterController'
                },
                'head@editctr': {
                    templateUrl: './header_tpl.html',
                    controller: 'HeaderController'
                },
                'left@editctr': {
                    templateUrl: './editingCenter/left_tpl.html',
                    controller: 'editingCenterNavController'
                },
                'footer@editctr': {
                    templateUrl: './footer_tpl.html'
                }
            }
        });
    }]);
