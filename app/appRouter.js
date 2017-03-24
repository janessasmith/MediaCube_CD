"use strict";
/**
 * created by zheng.lu in 2017.2.27
 */
angular.module('appRouterModule', [])
    .config(["$stateProvider", "$urlRouterProvider", function($stateProvider,
        $urlRouterProvider) {
        // $urlRouterProvider.otherwise('/login');
        $urlRouterProvider.otherwise('/editctr/website/waitcompiled');
    }]);
