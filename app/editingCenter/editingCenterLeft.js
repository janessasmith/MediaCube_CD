"use strict";
/**
 * created by zheng.lu in 2017.3.14
 * modified by zhang.xiaohua in 2017.3.22
 */
angular.module('editingCenterLeftModule', ["ui.bootstrap", "treeControl"])
    .controller('editingCenterNavController', ["$scope", "$q", "$timeout", "$stateParams", "$state", "trsHttpService", "$location", "editingCenterService",
        function($scope, $q, $timeout, $stateParams, $state, trsHttpService, $location, editingCenterService) {
            initStatus();
            initData();

            function initStatus() {
                $scope.pathes = $location.path().split('/');
                $scope.status = {
                    tab: {
                        website: {
                            isTabSelect: false,
                        },
                        app: {
                            isTabSelect: false,
                        },
                        weixin: {
                            isTabSelect: false,
                        },
                        weibo: {
                            isTabSelect: false,
                        }
                    },
                };
                $scope.status.tab[$scope.pathes[2]].isTabSelect = true;   // 默认打开网址待编

                $scope.data = {
                    subsItems: [],
                    sitesChannels: []
                };
            }

            function initData() {
                //默认用户已订阅的第一个站点和栏目显示
                addSubscribeSite(1).then(function(data){
                    $scope.data.subsItems[0]?querySubscribeChannels($scope.data.subsItems[0]):'';
                    // querySubscribeChannels($scope.data.subsItems[0]);
                });
            }
            $scope.setTabSelected = function(param) {
                $scope.status.tab[param].isTabSelect = true;
                var willgo = 'editctr.' + param;
                if ($state.current.name.indexOf(willgo) >= 0) {
                    $state.go($state.current.name, $stateParams, { reload: $state.current.name });
                } else {
                    $state.go(willgo);
                }
            };

            /**
             * [subscribeModal description] 获取可订阅的站点列表-弹窗
             * @return {[type]} [description]
             */
            $scope.querySitesOnSubscribeCenter = function() {
                editingCenterService.subscribeModal(function(params) {
                    $timeout(function() {
                        addSubscribeSite(1).then(function(data){
                            //如果有已订阅的站点
                            $scope.data.subsItems[0]?querySubscribeChannels($scope.data.subsItems[0]):'';
                        });
                    }, 100);
                });
            };

            function addSubscribeSite(site) {
                var deferred = $q.defer();
                var param = {
                    serviceid: "gov_site",
                    methodname: "querySubscribeSitesOnEditorCenter",
                    MediaType: site
                    // MediaType: site
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), param, 'get').then(function(data) {
                    $scope.data.subsItems = data;
                    $scope.data.subsItems[0]?$scope.data.subsItems[0].isOpen = true:'';
                    deferred.resolve();
                });
                return deferred.promise;
            }

            /**
             * [querySubscribeChannels description] 查询用户已订阅的栏目
             * @param  {[type]} site [description]
             * @return {[type]}      [description]
             */
            $scope.querySubscribeChannels = function(site) {
                querySubscribeChannels(site);
            };

            function querySubscribeChannels(site){
                var param = {
                    "serviceid": "gov_site",
                    "methodname": "querySubscribeChannelsOnEditorCenter",
                    "SiteId": site.SITEID
                };
                if (!site.subsChannel) {
                    trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), param, 'get').then(function(data) {
                        site.subsChannel = data;
                    });
                }
            }

            $scope.removeSubscribeChannel = function(channelid, site, index) {
                var param = {
                    "serviceid": "gov_site",
                    "methodname": "removeSubscribeChannel",
                    "ChannelId": channelid
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), param, 'get').then(function(data) {
                    site.subsChannel.splice(index, 1);
                });
            };
        }
    ]);
