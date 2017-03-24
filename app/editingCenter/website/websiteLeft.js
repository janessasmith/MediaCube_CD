"use strict";
/**
 * created by zheng.lu in 2017.2.27
 */
angular.module('websiteLeftModule', [])
    .controller('websiteLeftCtrl', ["$scope", "$q", "$location", "$state", "$filter", "trsHttpService", "editingCenterService", "editingMediatype",
        function($scope, $q, $location, $state, $filter, trsHttpService, editingCenterService, editingMediatype) {
            initStatus();
            initData();

            /**
             * [initStatus description] 初始化状态
             * @return {[type]} [description]
             */
            function initStatus() {
                $scope.router = $location.path().split('/');
                $scope.status = {
                    sites: [], // 一级导航数据存放到该数组
                    selectedSite: {},
                    favoriteChannels: [], // 常用栏目

                    platformParam: ["waitcompiled", "pending", "waitpending", "signed"],
                    selectedPlatform: $scope.router[4] || "waitcompiled", // 默认展开平台
                    expandedNode: {
                        waitcompiled: [],
                        pending: [],
                        waitpending: [],
                        signed: []
                    },
                    waitcompiled: {
                        channels: "",
                        selectedChnl: "",
                        selectedChnlId: "",
                        isSelected: true
                    },
                    pending: {
                        channels: "",
                        selectedChnl: "",
                        isSelected: $scope.router[4] === 'pending',
                    },
                    waitpending: {
                        channels: "",
                        selectedChnl: "",
                        isSelected: $scope.router[4] === 'waitpending',
                    },
                    signed: {
                        channels: "",
                        selectedChnl: "",
                        isSelected: $scope.router[4] === 'signed',
                    },
                    channelTreeOptions: editingCenterService.channelTreeOptions()
                };
            }

            /**
             * [initData description] 初始化数据
             * @return {[type]} [description]
             */
            function initData() {
                initSites()
                    .then(function() {
                        initChannelList($scope.status.selectedSite);
                        // $state.go('editctr.website.' + $scope.status.selectedPlatform, { siteid: $scope.status.selectedSite.SITEID });
                    });
            }

            /**
             * [initSites description] 初始化一级导航站点列表
             * @return {[type]} [description]
             */
            function initSites() {
                var deferred = $q.defer();
                editingCenterService.querySitesByMediaType(editingMediatype.website).then(function(data) {
                    // 当网站不存在时退出 WCM bug
                    if (!data || data.length < 1) return;
                    $scope.status.sites = data;
                    // $scope.status.sites中挑选跟url中siteid相同的值的数组，返给filteredSite 被选中的网站 [filterBy的唯一性]
                    var filteredSite = $filter('filterBy')($scope.status.sites, ['SITEID'], $location.search().siteid);
                    // 将一级导航第一栏赋值给$scope.status.selectedSite
                    $scope.status.selectedSite = filteredSite.length > 0 ? filteredSite[0] : data[0];

                    deferred.resolve();
                });
                return deferred.promise;
            }

            /**
             * [selectSites description] 点击一级导航站点切换
             * @param  {[type]} site [description] 被选中的一级导航站点
             * @return {[type]}      [description]
             */
            $scope.selectSites = function(site) {
                if ($scope.status.selectedSite === site) return;
                // 将点中的站点赋给$scope.status.selectedSite展示出来
                $scope.status.selectedSite = site;
                $state.go($state.$current, {
                    siteid: site.SITEID
                });
            };

            /**
             * [initChannelList description] 请求子栏目列表中的一级子栏目
             * @param  {[type]} siteid [description] 根据siteid获取子级
             * @return {[type]}        [description]
             */
            function initChannelList(site) {
                editingCenterService.queryChildChannel(site.SITEID, 0).then(function(data) {
                    $scope.status[$scope.status.selectedPlatform].channels = data;
                    angular.forEach($scope.status[$scope.status.selectedPlatform].channels, function(value, key) {
                        // 当为第一级channel时，没有添加常用功能
                        value.channelfirst = true;
                        // 浏览器刷新后依然展示之前选中的栏目
                        if (value.CHANNELID == $location.search().channelid) {
                            $scope.status[$scope.status.selectedPlatform].selectedChnl = value;
                            $scope.status[$scope.status.selectedPlatform].selectedChnlId = value.CHANNELID;
                        }
                    });

                    $state.go('editctr.website.' + $scope.status.selectedPlatform, {
                        siteid: $scope.status.selectedSite.SITEID,
                        // channelid: $scope.status[$scope.status.selectedPlatform].selectedChnl.CHANNELID
                        channelid: data[0].CHANNELID
                    });

                    queryFavoriteChannels();
                });
            }

            /**
             * [queryChildrenChannels description] 获取子栏目列表
             * @param  {[type]} item [description] 子栏目节点
             * @return {[type]}      [description]
             */
            function queryChildrenChannels(item) {
                if (item.HASCHILDREN == 'true' && !item.CHILDREN) {
                    // var params = {};//测试多级目录
                    // trsHttpService.httpServer('./editingCenter/data/treedata.json', params, "get").then(function(data) {
                    editingCenterService.queryChildChannel(item.SITEID, item.CHANNELID).then(function(data) {
                        // 将选中的子节点保存到item.CHILDREN中
                        item.CHILDREN = data;
                        //判断该子节点是否为常用栏目，若是，则给该栏目状态显示为常
                        // angular.forEach(data, function(value, key) {
                        //     angular.forEach($scope.status.favoriteChannels, function(valuef, keyf) {
                        //         if (value.CHANNELID == valuef.CHANNELID) {
                        //             value.clicked = true;
                        //         }
                        //     });
                        // });
                    });
                }
            }

            /**
             * [queryNodeChildren description] 点击子栏目列表 查询其子节点 异步加载树
             * @param  {[type]} node [description] 节点信息
             * @return {[type]}      [description]
             */
            $scope.queryNodeChildren = function(node) {
                queryChildrenChannels(node);
            };

            /**
             * [setWebSelectedChnl description]设置网站当前选中的栏目
             * @param {[type]} item     [description]  被点击对象node
             * @param {[type]} platform [description] 平台：待编，待审，已签发
             */
            $scope.setWebSelectedChnl = function(item, platform) {
                $scope.status[platform].selectedChnl = item; // 将当前选中的对象赋给selectedChnl
                $scope.status[$scope.status.selectedPlatform].selectedChnl = item;
                $scope.status[platform].selectedChnlId = item.CHANNELID;
                if (angular.isObject(item))
                    $state.go("editctr.website." + platform, {
                        channelid: item.CHANNELID,
                    }, {
                        reload: "editctr.website." + platform
                    });
                else {
                    $state.go("editctr.website." + platform + "." + item, "", {
                        reload: "editctr.website." + platform + "." + item
                    });
                }
            };

            /**
             * [getSelectedNode description] 判断栏目树中的栏目是否被选中
             * @return {[type]} [description] 根据selectedChnl
             */
            $scope.getSelectedNode = function() {
                if (angular.isObject($scope.status[$scope.status.selectedPlatform].selectedChnl)) {
                    return $scope.status[$scope.status.selectedPlatform].selectedChnl;
                } else {
                    return undefined;
                }
            };

            /**
             * [queryFavoriteChannels description] 获取当前用户在指定站点下的常用栏目列表
             * @return {[type]} [description] 根据siteid保存
             */
            function queryFavoriteChannels() {
                var params = {
                    "serviceid": "gov_site",
                    "methodname": "queryFavoriteChannelsOnEditorCenter",
                    "SiteId": $scope.status.selectedSite.SITEID // 将当前点击的栏目siteid传给后台保存
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    $scope.status.favoriteChannels = data; // 将获取到的数据存入数组
                    // findFavChanData(data);
                });
            }

            /**
             * [checkfavoriteChannel description] 检查栏目中是否设为常用
             * @param  {[type]} item [description] 子栏目
             * @return {[type]}      [description]
             */
            $scope.checkfavoriteChannel = function(item) {
                for(var i = 0; i < $scope.status.favoriteChannels.length; i++) {
                    if(item.CHANNELID == $scope.status.favoriteChannels[i].CHANNELID) {
                        item.clicked = true;
                    }
                }
            };

            /**
             * [findFavChanData description] 栏目中默认常用栏目状态显示
             * @param  {[type]} data [description] 常用栏目数据
             * @return {[type]}      [description]
             */
            // function findFavChanData(data) {
            //     angular.forEach($scope.status[$scope.status.selectedPlatform].channels, function(value, key) {
            //         angular.forEach(data, function(valuef, keyf) {
            //             if (value.CHANNELID == valuef.CHANNELID) {
            //                 value.clicked = true;
            //             }
            //         });
            //     });
            // }

            /**
             * [addFavoriteChannel description] 将栏目设置为常用栏目
             * @param {[type]} node [description]
             */
            $scope.addFavoriteChannel = function(node) {
                node.clicked = true;
                var params = {
                    "serviceid": "gov_site",
                    "methodname": "addFavoriteChannel",
                    "ChannelId": node.CHANNELID
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    $scope.status.favoriteChannels.push(data);
                });
            };

            /**
             * [removeFavoriteChannel description] 取消常用栏目
             * @param  {[type]} channel [description] 该栏目
             * @param  {[type]} index [description] 该栏目index
             * @return {[type]}           [description]
             */
            $scope.removeFavoriteChannel = function(channel, index) {
                var params = {
                    "serviceid": "gov_site",
                    "methodname": "removeFavoriteChannel",
                    "ChannelId": channel.CHANNELID
                };
                trsHttpService.httpServer(trsHttpService.getWCMRootUrl(), params, "get").then(function(data) {
                    if (index === 0) {
                        angular.forEach($scope.status.favoriteChannels, function(value, key) {
                            if (value.CHANNELID == channel.CHANNELID) {
                                index = key;
                            }
                        });
                    }
                    $scope.status.favoriteChannels.splice(index, 1);
                    removeFavChanData(channel, $scope.status[$scope.status.selectedPlatform].channels);
                });
            };

            /**
             * [removeFavChanData description]删除常用栏目时，对栏目状态显示的操作
             * @param  {[type]} channel [description]
             * @return {[type]}           [description]
             */
            function removeFavChanData(channel, allchannels) {
                angular.forEach(allchannels, function(value, key) {
                    // if (value.CHANNELID == channel.CHANNELID) {
                    //     value.clicked = false;
                    // } else if (value.CHILDREN) {
                    //     angular.forEach(value.CHILDREN, function(valuec, keyc) {
                    //         if (valuec.CHANNELID == channel.CHANNELID) {
                    //             valuec.clicked = false;
                    //         }
                    //     });
                    // }
                    // 多级子栏目时，最好使用for循环
                    // 二级
                    if (value.CHILDREN) {
                        angular.forEach(value.CHILDREN, function(valuec, keyc) {
                            if (valuec.CHANNELID == channel.CHANNELID) {
                                valuec.clicked = false;
                                //三级
                            } else if (valuec.CHILDREN) {
                                angular.forEach(valuec.CHILDREN, function(valuect, keyct) {
                                    if (valuect.CHANNELID == channel.CHANNELID) {
                                        valuect.clicked = false;
                                        //四级
                                    } else if (valuect.CHILDREN) {
                                        angular.forEach(valuect.CHILDREN, function(valuecf, keycf) {
                                            if (valuecf.CHANNELID == channel.CHANNELID) {
                                                valuecf.clicked = false;
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }

        }
    ]);
