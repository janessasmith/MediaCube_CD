"use strict";
/**
 * created by zheng.lu in 2017.2.27
 */
angular.module('editingCenterModule', [
    'trsNavLocationModule',
    'ngTagsInput',
    'mgcrea.ngStrap.typeahead',
    'mgcrea.ngStrap.popover',

    'editingCenterRouterModule',     // 采编中心总路由
    'editingCenterLeftModule',       // 采编中心左侧

    'editingCenterWebsiteModule',    // 采编中心-网址
    'editingCenterAppModule',        // 采编中心-app
    'editingCenterWeixinModule',     // 采编中心-微信
    'editingCenterWeiboModule',      // 采编中心-微博
    'initSingleSelectionModule',     // 采编中心-公共服务-下拉
    'editingCenterServiceModule'     // 采编中心-公共服务
]).
controller('EditingCenterController', ['$scope', '$state', '$location',
    function($scope, $state, $location) {

    }
]).value('editingMediatype', {
    // 网站：1，APP：2，微信：3，微博：4
    website:1,
    app:2,
    weixin:3,
    weibo:4,
});
