"use strict";
/**
 * created by zheng.lu in 2017.2.27
 */
angular.module('headModule', [])
    .controller('HeaderController', ["$scope", "$location",
        function($scope, $location) {
            initStatus();
            initData();

            /**
             * [initStatus description] 初始化状态
             * @return {[type]} [description]
             */
            function initStatus() {
                $scope.currModule = $location.path().split('/')[1];
            }

            /**
             * [initData description] 初始化数据
             * @return {[type]} [description]
             */
            function initData() {

            }

        }
    ]);
