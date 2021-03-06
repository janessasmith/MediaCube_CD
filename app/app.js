'use strict';
var app = angular.module('app', [
        'ui.router',
        'ui.bootstrap',
        'ngAnimate',
        'validation',
        'validation.rule',
        'LocalStorageModule',
        'angular.filter',
        'ngSweetAlert',
        'ngFlowGrid',
        'appRouterModule',          // 总路由
        'headModule',               // 头部
        'loginModule',              // 登录
        'editingCenterModule',      // 采编中心
        'components.service',       // 公共服务
        'components.filter',        // 公共过滤操作
        'components.directive',     // 公共指令
        'templates-main',
        'duScroll',//滚动指令插件
    ]).config(['$validationProvider', function($validationProvider) {
        $validationProvider.setSuccessHTML(function(msg) {
            return "";
        });
        $validationProvider.setErrorHTML(function(msg) {
            // remember to return your HTML
            return '<p class="validation-invalid">' + msg + '</p><i></i>';
        });

    }]) //将http的提交参数调整成form的方式
    .config(['$httpProvider', function($httpProvider) {

        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        function toFormData(obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name; //name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += toFormData(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += toFormData(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        }
        // 浏览器缓存设置
        // if (!$httpProvider.defaults.headers.get) {
        //     $httpProvider.defaults.headers.get = {};
        // }
        // $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        // $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? toFormData(data) : data;
        }];
    }])
    /*.run(['$http', 'loginService', function($http, loginService) {
        window.setTimeout(AutoInteraction, 60000);

        function AutoInteraction() {
            //loginService
            if ('id' in $rootScope.loginUser) {
                // $http.get("user/" + $rootScope.loginUser.id);
                $http.get('logininfo');
            };
            setTimeout(AutoInteraction, 60000);
        }
    }]);*/

.config(['$validationProvider', function($validationProvider) {

    var expression = {
        ip: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        sensitiveWords: function(value) {
            var flag = true;
            angular.forEach(value.split("\n"), function(data, index, array) {
                var reg = /^([a-zA-Z0-9\u4e00-\u9fa5]{1,50}),([^,< > / \ ' "]{0,50}),([12]{0,1})$/;
                data.match(reg) ? "" : flag = false;
            });
            return flag;
        },
        userName: function(value) {
            var flag = true;
            if (value == 'admin' || value == 'system') {
                flag = false;
            }
            return flag;
        },
        userNameChar: /^[\u4E00-\u9FA5A-Za-z][\u4E00-\u9FA5A-Za-z0-9_.]+$/,
        uniqueTime: function(value) {
            return value.length < 5;
        },
        maxindex: function(value, scope, element, attrs, param) {
            if (!value) return true;
            return parseInt(value) <= param;
        },
        minindex:function(value, scope, element, attrs, param) {
            if (!value) return true;
            return parseInt(value) >= param;
        }
    };
    var validMsg = {
        ip: {
            error: 'IP格式不正确',
            success: ''
        },
        sensitiveWords: {
            error: '敏感词格式错误',
            success: ''
        },
        userName: {
            error: "用户名不能使用系统保留账号",
            success: ""
        },
        userNameChar: {
            error: "不符合用户名填写规则",
            success: ""
        },
        uniqueTime: {
            error: "排重时间不能大于5位数",
            success: ""
        },
        maxindex: {
            error: "超过最大序号数",
            success: ""
        },
        minindex: {
            error: "小于最小序号数",
            success: ""
        }
    };
    $validationProvider.setExpression(expression) // set expression
        .setDefaultMsg(validMsg); // set valid message
}]);
app.run(['$rootScope', '$location', 'loginService', 'storageListenerService', 'localStorageService', function($rootScope, $location, loginService, storageListenerService, localStorageService) {
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            storageListenerService.removeAllListener();
            if (toState.name == "login" && fromState.name !== "") {
                localStorageService.set('historyUrl', {
                    state: fromState,
                    params: fromParams
                });
                //loginService.setCacheRouter(fromState, fromParams);
            }

        });
}]);


app.value('cgBusyDefaults', {
    message: '数据加载中...',
    backdrop: true,
    delay: 0,
    minDuration: 100,
    wrapperClass: 'mlf-busy'
});
app.value('versionCtrl', {
    isDebug: false, //测试版
    isOffical: false, //正式版,
    isDev: true, //开发版
});
angular.element(document)
    .ready(function() {
        angular.bootstrap(document, ['app']);
    });
