/**
 *
 *   @description: 该文件用于获取用户信息 svai
 *   @version    : 1.0.4
 *   @create-date: 2015-10-08
 *
 *   @interface  :
 *                 1) getUserData(fn);                //获取用户信息, 在fn的回调中返回userData
 *                 2) login(param);                   //拉起客户端登陆, param: 可选参数, actionParam一切参数
 *                 3) indentifyCheck(userData, fn);   //检查用户身份信息, userData: 从getUserData获取的用户信息, fn: 如果验证通过,则调用指定fn回调(不通过不调用！)
 *
 *   @example    :
 *                 var userInfo = require('userInfo');
 *
 *                 1) 获取用户信息
 *                    userInfo.getUserData(function (userData) {
 *                      console.log(userData)
 *                    });
 *
 *                 2) 拉起客户端登陆
 *                    userInfo.login();
 *
 *                 3) 检查用户身份信息
 *                    userInfo.indentifyCheck(userData, function () {
 *                      //如果调用到该方法中，说明已经验证通过
 *                    });
 *
 *   @update-log :
 *                 1.0.1 - 20151027 陈龙 获取用户信息业务
 *                 1.0.2 - 20151126 陈龙 加入了客户端版本判断(5.1.1之前(含5.1.1)版本不检查SohuAppPrivates参数，直接返回url中参数)
 *                 1.0.3 - 20151203 陈龙 新增indentifyCheck方法
 *                 1.0.4 - 20151214 陈龙 在用户身份检查方法中，当是非客户端情况加，尝试拉起app，并跳转到vstar首页
                   1.0.5 - 20170710 guoqing 优化重构
 *
 */
(function(global) {
    'use strict';
    window.svai = window.svai || {};
    svai.getParam = function(a, b) {
        var c, d, e;
        return "undefined" == typeof b ? (d = window.location.href, c = new RegExp("(^|&?)" + a + "=([^&]*)(&|$)", "i")) :
            (d = a, c = new RegExp("(^|&?)" + b + "=([^&]*)(&|$)", "i")), e = d.match(c), null !== e ? decodeURIComponent(e[2]) : null;
    };
    svai.setParam = function(url, name, val) {
        try {
            if (typeof url !== 'undefined' && typeof name !== 'undefined' && typeof val !== 'undefined') {
                val = encodeURIComponent(val);
                if (url.indexOf('?') === -1) {
                    url += '?' + name + '=' + val;
                } else {
                    var urlParamArr = url.split('?');
                    var pStr = urlParamArr[1];
                    var pArr = pStr.split('&');
                    var findFlag = false;
                    for (var i = 0; i <= pArr.length; i++) {
                        var item = pArr[i] || '';
                        var paramArr = item.split('=');
                        if (name === paramArr[0]) {
                            findFlag = true;
                            pArr[i] = name + '=' + val;
                            return false;
                        }
                    }
                    if (!findFlag) {
                        url += '&' + name + '=' + val;
                    } else {
                        url = urlParamArr[0] + '?' + pArr.join('&');
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
        return url;
    };
    svai.setParams = function(url, key, val) {
        if (typeof key === 'string' && typeof val !== 'undefined') {
            return svai.setParam(url, key, val);
        } else if (typeof key === 'object') {
            for (var i in key) {
                url = svai.setParam(url, i, key[i]);
            }
            return url;
        } else {
            return url;
        }
    };
    svai.UA = window.navigator.userAgent;
    svai.IsSohuVideoClient = (/SohuIPC/i.test(svai.UA) || /SohuVideoPad/i.test(svai.UA) || /SohuVideoMobile/i.test(svai.UA) || svai.getParam('clientType') && svai.getParam('clientVer')) ? true : false;
    svai.IsAndroid = !!(/Android|HTC|Adr/i.test(svai.UA) || !!(window.navigator.platform + '').match(/Linux/i));
    svai.IsIpad = !svai.IsAndroid && /iPad/i.test(svai.UA);
    svai.IsIphone = !svai.IsAndroid && /iPod|iPhone/i.test(svai.UA);
    svai.IsIOS = svai.IsIpad || svai.IsIphone;
    svai.JSONParse = function(jsonsrc) {
        var obj = {};
        try {
            if (/\\%/.test(jsonsrc)) {
                jsonsrc = decodeURIComponent(jsonsrc);
            }
            if (typeof(JSON) === 'object' && JSON.parse) {
                obj = eval('[' + jsonsrc + ']')[0];

            } else {
                obj = eval('(' + jsonsrc + ')');
            }
        } catch (e) {
            try {
                if (/\\%/.test(jsonsrc)) {
                    jsonsrc = decodeURIComponent(jsonsrc);
                }
                obj = JSON.parse(jsonsrc);
            } catch (b) {
                obj = null;
            }
        }
        return obj;
    };
    svai.domReady = function(callback) {
        if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
            callback && callback();
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                callback && callback();
            }, false);
        }
        return this
    };
    svai.serialize = function(value) {
        return JSON.stringify(value);
    };
    svai.setCookie = function(name, value, expire, domain) {
        var expires = '';
        if (0 !== expire) {
            var t = new Date();
            t.setTime(t.getTime() + (expire || 24) * 3600000);
            expires = ';expires=' + t.toGMTString();
        }
        var s = encodeURIComponent(name) + '=' + encodeURIComponent(value) + expires + ';path=/' + (domain ? (';domain=' + domain) : '');
        document.cookie = s;
        return true;
    };
    svai.getCookie = function(name) {
        var arrCookie = document.cookie.split(';'),
            arrS;
        for (var i = 0; i < arrCookie.length; i++) {
            var item = arrCookie[i];
            var index = item.indexOf('=');
            var cName = item.substr(0, index);
            var cValue = item.substr(index + 1);
            if (cName.trim() === name) {
                return decodeURIComponent(cValue);
            }
        }
        return '';
    };
    svai.setSession = function(name, value) {
        try {
            if (!!window.sessionStorage) {
                window.sessionStorage.setItem(name, svai.serialize(value));
            }
        } catch (e) {
            svai.setCookie(name, svai.serialize(value), 24);
        }
    };
    svai.getSession = function(name) {
        var sRet = '';
        try {
            if (!!window.sessionStorage) {
                sRet = svai.JSONParse(window.sessionStorage.getItem(name));
            }
        } catch (e) {
            sRet = svai.JSONParse(svai.getCookie(name));
        }
        return sRet;
    };
    var defaultUserInfo = {
        uid: svai.getParam('uid') || '0', //(string) 用户uid唯一标识
        isVip: false,
        passport_id: svai.getParam('passport_id') || '', //(string) passport uid
        passport: svai.getParam('passport') || '',
        mobile: svai.getParam('mobile') || '',
        nickname: svai.getParam('nickname') || '',
        token: svai.getParam('token') || '',
        gid: svai.getParam('gid') || '',
        plat: svai.getParam('plat') || '6',
        poid: '0',
        webtype: 'WiFi',
        userImg: '',
        app_id: '',
        sysver: '0',
        partner: '87',
        sver: svai.getParam('clientVer') || '5.1.0',
        sys: svai.getParam('clientType') || '',
        pn: '',
        mfo: '',
        mfov: '',
        systime: '',
        isApp: svai.IsSohuVideoClient,
        isUsr: false
    };
    var testDefaultUserInfo = { //test
        uid: '763d35acaf08168402f17c37999b0123',
        isVip: true,
        passport_id: '12380219',
        passport: 'npk19000@sohu.com',
        mobile: '',
        nickname: 'npk19000',
        token: '732a9d0a9e906600cdb845381b151da7',
        gid: '02ffff10741010c024d585b5c80100b02b93be251c8686',
        plat: '6',
        poid: '1',
        webtype: 'WiFi',
        userImg: 'http://xxxxxx.jpg',
        app_id: '',
        sysver: '4.4.2',
        partner: '87',
        sver: '5.1.0',
        sys: 'android',
        pn: '93',
        mfo: 'samsung',
        mfov: 'SM-G9006V',
        systime: '1444368975736',
        isApp: true,
        isUsr: true
    };
    var urlClientVer = svai.getParam('clientVer') || '';
    var isTestSituation = /t\.m\.tv\.sohu\.com/i.test(window.location.host) ? true : false;
    var pagePath = 'http://' + (isTestSituation ? 't.' : '') + 'm.tv.sohu.com';
    var isOpenFromApp = document.referrer.trim() ? false : true;
    var userInfoKey = svai.userInfoKey = "sva_user_info";
    //老版本客户端(5.1.2之前版本)直接返回url中获取的参数
    if (typeof urlClientVer === 'string' && urlClientVer.length > 0 && /^[0-4](\.\d)*|5\.[01]\.[01](\.\d)*$/i.test(urlClientVer)) {
        defaultUserInfo.isUsr = true;
    }
    //赋值到全局变量
    window.SohuAppUserData = defaultUserInfo; //default   
    svai.defaultUserInfo = defaultUserInfo;
    //format 用户信息处理
    svai.userInfoProcess = function(SohuAppPrivates) {
        var rst = null;
        try {
            var _sohuAppPrivates;
            if (typeof SohuAppPrivates !== 'undefined' && SohuAppPrivates !== null) {
                rst = {};
                try {
                    _sohuAppPrivates = svai.JSONParse(SohuAppPrivates);
                } catch (e) {}
                //format
                var isVip = (typeof _sohuAppPrivates.isVip === 'string' && _sohuAppPrivates.isVip === '1') ? true : false;

                rst.isVip = isVip; //(string) 是否是vip
                rst.uid = _sohuAppPrivates.uid || svai.getParam('uid') || '0'; //(string) 用户uid唯一标识
                rst.passport_id = _sohuAppPrivates.passport_id || svai.getParam('passport_id') || ''; //(string) passport uid
                rst.passport = _sohuAppPrivates.passport || svai.getParam('passport') || ''; //(string) passport
                rst.mobile = _sohuAppPrivates.mobile || svai.getParam('mobile') || ''; //(string) 手机号
                rst.nickName = _sohuAppPrivates.nickname || svai.getParam('nickname') || ''; //(string) 用户名
                rst.token = _sohuAppPrivates.token || svai.getParam('token') || ''; //(string) token
                rst.gid = _sohuAppPrivates.gid || svai.getParam('gid') || ''; //(string) 设备唯一ID
                rst.plat = _sohuAppPrivates.plat || svai.getParam('plat') || '6'; //(string) 平台编号
                rst.poid = _sohuAppPrivates.poid || '0'; //(string) 产品号id
                rst.webType = _sohuAppPrivates.webtype || 'WiFi'; //(string) 网络环境 (unavailable, unknown, 2g, 3g, 4g, wifi)
                rst.userImg = _sohuAppPrivates.userImg || ''; //(string) 用户头像
                rst.appId = _sohuAppPrivates.app_id || ''; //(string) 由用户中心传递给搜狐影院
                rst.sysVer = _sohuAppPrivates.sysver || '0'; //(string) 客户端操作系统版本号 
                rst.sver = _sohuAppPrivates.sver || svai.getParam('sver') || svai.getParam('clientVer') || '5.1.0'; //(string) 客户端版本号, 如:5.1.0
                rst.partner = _sohuAppPrivates.partner || '87'; //(string) 合作商号码
                rst.sys = _sohuAppPrivates.sys || svai.getParam('clientType') || ''; //(string) 客户端操作系统, 如: AndroidPhone
                rst.pn = _sohuAppPrivates.pn || ''; //(string) 渠道号
                rst.mfo = _sohuAppPrivates.mfo || ''; //(string) 终端生产厂商
                rst.mfov = _sohuAppPrivates.mfov || ''; //(string) 终端具体机型
                rst.sysTime = _sohuAppPrivates.systime || ''; //(string) 创建时间戳
                rst.isApp = svai.IsSohuVideoClient; //(boolean) 是否客户端内
                rst.isUsr = true; //(boolean) 是否客获取户端内用户SohuAppPrivates信息
                defaultUserInfo = rst;
            }
        } catch (e) {}
        return rst;
    };

    //app主动调
    if (typeof window.initSohuVideoPage == 'undefined') {
        window.initSohuVideoPage = function(passData) {
            passData = passData || window.SohuAppPrivates;
            if (!passData) {
                return;
            }
            defaultUserInfo = svai.userInfoProcess(passData);
            if (defaultUserInfo && defaultUserInfo.uid) window.SohuAppUserData = defaultUserInfo; //default  
            return defaultUserInfo;
        };
    }

    svai._turnFlag = false; //是否已经发送app请求
    //dom加载后初始化用户信息，解析后保存到window.SohuAppUserData
    svai.initSvaUserInfo = function(callback) {
        //如果在非客户端下，直接返回默认数据test
        if (svai.IsSohuVideoClient) {
            console.info('搜狐视频客户端内');
            svai._turnOnApp();
            //解析用户信息
            svai.getUserData(function(userInfo) {
                var _usr = userInfo || window.SohuAppUserData || {};
                callback && callback(defaultUserInfo);
            }.bind(svai));

        } else {
            console.info('非搜狐视频客户端');
            defaultUserInfo.isUsr = true;
            if (/t\.m\.tv\.sohu\.com|my\.test\.sohu\.com/i.test(window.location.host)) {
                //如果在pc下，直接模拟客户端数据-测试用
                defaultUserInfo = testDefaultUserInfo;
                window.SohuAppUserData = defaultUserInfo;
                callback && callback(defaultUserInfo);
            }
        }

    };


    //告诉搜狐视频客户端获取用户信息
    svai._turnOnApp = function() {
        if (svai.IsSohuVideoClient) {
            //告诉搜狐视频客户端获取用户信息请求
            try {
                if (svai.IsAndroid) {
                    svai._turnFlag = true;
                    try {
                        handler.appCallback(3, 1, '{}');
                    } catch (e) {}

                } else if (svai.IsIOS) {
                    try {
                        var appLoaded = function() {
                            svai._turnFlag = true;
                            var ifr = document.createElement('iframe'),
                                body = document.body;
                            ifr.style.display = 'none';
                            ifr.src = 'js://jsLoadFinish';
                            body.appendChild(ifr);
                            setTimeout(function() {
                                body.removeChild(ifr);
                            }, 2000);
                        }
                        svai._turnFlag = true;
                        appLoaded();
                    } catch (e) {}
                }
            } catch (e) {
                console.log(e);
            }

        }
    };

    //获取用户信息
    svai.getUserData = function(fn) {
        fn = typeof fn === 'function' ? fn : function() {};
        var callbackWrap = function(userData) {
            window.SohuAppUserData = userData;
            fn(userData);
        };
        if (!svai.IsSohuVideoClient) {
            console.info('非搜狐视频客户端内,无法获取APP用户信息!!!');
            callbackWrap(defaultUserInfo);
            return;
        }
        var getLocalUserData = function() {
            var ud = null;
            var userDataCache = svai.getSession(userInfoKey);
            if (userDataCache) {
                try {
                    ud = svai.JSONParse(userDataCache);
                } catch (e) {
                    ud = null;
                }
            }
            return ud;
        }
        var p = svai.getParam('passport');
        var userData = getLocalUserData();
        if (userData && userData.passport && p && p != userData.passport) {
            svai.setSession(userInfoKey, ''); //切换账号
        }
        //例如客户端5.1.2版本一下的直接返回默认的userInfo
        if (defaultUserInfo.isUsr) {
            callbackWrap(defaultUserInfo);
            //5.1.2+版本
        } else {
            var userData = null;
            //如果从客户端打开页面，先把缓存里的userInfo清了，否则优先取缓存
            if (isOpenFromApp) {
                svai.setSession(userInfoKey, '');

            } else {
                var userDataCache = svai.getSession(userInfoKey);
                if (userDataCache) {
                    try {
                        userData = svai.JSONParse(userDataCache);
                    } catch (e) {}
                } else {
                    userData = null;
                }
            }
            //如果localStorage中有userInfo
            if (userData && userData.uid) {
                console.log('hit storage userData...', userData.uid);
                callbackWrap(userData);

            } else {
                if (!svai._turnFlag) svai._turnOnApp();
                var tryCnt = 0,
                    tryTime = 200;
                var usrDataTimer = setInterval(function() {
                    tryCnt += tryTime;
                    if (typeof window.SohuAppPrivates !== 'undefined' && window.SohuAppPrivates !== null) {
                        //取到SohuAppPrivates
                        window.SohuAppUserData = svai.userInfoProcess(window.SohuAppPrivates);
                        if (window.SohuAppUserData && window.SohuAppUserData.uid) svai.setSession(userInfoKey, userData);
                        clearInterval(usrDataTimer);
                        callbackWrap(svai.defaultUserInfo);

                    }
                    if (tryCnt >= 3000) {
                        //大于最长等待时间3s
                        clearInterval(usrDataTimer);
                        callbackWrap(svai.defaultUserInfo);
                    }
                }, tryTime);
            }
        }
    };
    //1.页面的DOMContentLoaded就试着注入 SohuAppPrivates 变量
    svai.domReady(function() {
        svai.initSvaUserInfo(function(ud) {
            console.log(JSON.stringify(ud));
        });
    });

    if (typeof define == 'function') {
        //2.通过seaj模块加载
        define('svaUserInfo', function(require, exports, module) {
            'use strict';
            var Action = require('base/action');
            var tip = require('ui/tips');

            var clientUser = {
                init: function(callback) {
                    svai.initSvaUserInfo(callback);
                },
                getUserData: function(callback) {
                    svai.getUserData(callback);
                },
                indentifyCheck: function(userData, fn) {
                    fn = typeof fn === 'function' ? fn : function() {};
                    if (userData !== null && userData.isApp) {
                        //已经登录
                        if (userData.passport !== '' && userData.token !== '') {
                            var isWXAccount = userData.passport.indexOf('@wechat.sohu.com') > -1 ? true : false;
                            var isQQAccount = userData.passport.indexOf('@qq.sohu.com') > -1 ? true : false;
                            var isSinaAccount = userData.passport.indexOf('@sina.sohu.com') > -1 ? true : false;
                            //检查是否绑定手机(微信、qq、新浪账号登录无需手机绑定)
                            if (userData.mobile !== '' || isWXAccount || isQQAccount || isSinaAccount) {
                                fn();
                                //没绑定手机号，拉起绑定手机号页面
                            } else {
                                var param = {
                                    passport: userData.passport,
                                    token: userData.token,
                                    uid: userData.uid,
                                    gid: userData.gid,
                                    poid: userData.poid,
                                    sysver: userData.sysVer,
                                    clientVer: userData.sver,
                                    goBackType: 1
                                };
                                //跳转到手机绑定页面
                                window.location.href = svai.setParams(config.urls.bindPhoneNumPage, param);
                            }

                        } else {
                            //只有在客户端里才有效,尚未登录, 拉起app登录
                            clientUser.login();
                        }
                    } else {
                        tip.showTip('对不起，请您打开搜狐视频客户端进行操作', config.tipShowTime);
                        //尝试拉起app
                        var aParam = Action.parserAttributes();
                        aParam.action = '1.18';
                        aParam.urls = config.urls.indexPage;
                        Action.sendAction(aParam);
                    }
                },
                login: function() {
                    //只有在客户端里才有效,尚未登录, 拉起app登录
                    svai.setSession(userInfoKey, ''); //切换账号
                    setTimeout(function() {
                        var aParam = Action.parserAttributes();
                        aParam.action = '2.6';
                        aParam.type = 'click';
                        Action.sendAction(aParam);
                    }, 500);
                }
            };

            module.exports = clientUser;
        });
    }

}(window));
