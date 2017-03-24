"use strict";
/**
 * created by zheng.lu in 2017.3.22
 */
angular.module("editingCenterServiceModule", ["subscribeModalMudule"])
    .factory("editingCenterService", ["$modal", "$q", "trsHttpService",
        function($modal, $q, trsHttpService) {
            return {
                // 栏目树初始化参数
                channelTreeOptions: function() {
                    return {
                        nodeChildren: "CHILDREN",
                        allowDeselect: false,
                        dirSelectable: false,
                        injectClasses: {},
                        templateUrl: '../app/components/htmlTemplates/treeTemplate.html',
                        isLeaf: function(node) {
                            return node.HASCHILDREN == 'false';
                        }
                    };
                },
                // 按照渠道查询站点
                querySitesByMediaType: function(mediaType) {
                    var params = {
                        serviceid: "gov_site",
                        methodname: "querySitesOnEditorCenter",
                        MediaType: mediaType, // 网站：1，APP：2，微信：3，微博：4
                        SiteId: ""
                    };
                    var deferred = $q.defer();
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, 'get').then(function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                // 查询平台下的栏目子节点
                queryChildChannel: function(siteid, channelid) {
                    var params = {
                        serviceid: 'gov_site',
                        methodname: 'queryChildrenChannelsOnEditorCenter',
                        SITEID: siteid,
                        ParentChannelId: channelid
                    };
                    var deferred = $q.defer();
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                },
                // 订阅弹窗
                subscribeModal: function(success) {
                    // 打开模态
                    var modalInstance = $modal.open({
                        backdrop: false,
                        templateUrl: "./editingCenter/service/subscribe/subscribe.html",
                        controller: "subscribeModalCtrl",
                        windowClass: 'subscribe-window',
                        // 定义一个成员并将它传递给modal指定的控制器，相当于router的一个resolve属性
                        // 如果需要传递一个object对象，则需要使用angular.copy()
                        // 通过resolve 来向具体Controller注入数据service
                        resolve: {

                        }
                    });
                    modalInstance.result.then(function(params) {
                        success(params);
                    });
                }
            };
        }
    ]);
