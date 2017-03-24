"use strict";
/**
 * created by zheng.lu 2017.3.14
 */
angular.module('websitetoBeCompiledRouterModule', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('editctr.website.waitcompiled', {
            url: '/waitcompiled?channelid',
            views: {
                "main@editctr": {
                    templateUrl: "./editingCenter/website/toBeCompiled/main_tpl.html",
                    controller: "websitetoBeCompiledCtrl"
                }
            }
        }).state('websiteword', {
            url: "/websiteword?channelid&chnldocid&metadataid&siteid&status",
            views: {
                '': {
                    templateUrl: './editingCenter/website/toBeCompiled/word/toBeCompiled_word_tpl.html',
                    controller: "editingCenterWebsiteWordCtrl"
                }
            }
        });
    }]);
