/**
 *   @description : 统计参数的公用方法
 *   @version     : 1.0.6
 *   @update-log  :
 *      1.0.1 - 20150225 周国庆 统计参数的公用方法
 *      1.0.2 - 20150525 周国庆 在获取channeled的逻辑中加入了pageData判断
 *      1.0.3 - 20150803 陈  龙 修复微信播放器统计channeled发送错误的bug
 *      1.0.4 - 20160309 陈  龙 新增getFUid方法
 *                              进行了jshint处理
 *      1.0.5 - 2-16-418 陈  龙 新增getTraceDestination方法
 *      1.0.6 - 2016-11-03 王宏光 fix https
 */

define('trace', function (require, exports, module) {

    'use strict';

    var vars = require('base/vars'),
        Util = require('base/util'),
        URL = require('base/url'),
        Cookie = require('base/cookie'),
        pp = require('base/passport');

    var screenSize = vars.ScreenSize;
    var sUserAgent = window.navigator.userAgent;
    var passport = pp.getPassport();
    var cookieTimeout = 1; //商城和粉丝cookie失效时间

    var sysOS = function () {

        if (vars.IsIOS) {

            return 'ios';
        }

        if (vars.IsAndroid) {

            return 'android';
        }

        var isWin = (navigator.platform === 'Win32') || (navigator.platform === 'Win64') || (navigator.platform === 'Windows');
        var isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel');

        if (isMac) {

            return 'Mac';
        }
        var isUnix = (navigator.platform === 'X11') && !isWin && !isMac;

        if (isUnix) {

            return 'Unix';
        }
        var isLinux = (String(navigator.platform).indexOf('Linux') > -1);

        if (isLinux) {

            return 'Linux';
        }

        if (isWin) {
            var isWin2K = sUserAgent.indexOf('Windows NT 5.0') > -1 || sUserAgent.indexOf('Windows 2000') > -1;

            if (isWin2K) {

                return 'Win2000';
            }
            var isWinXP = sUserAgent.indexOf('Windows NT 5.1') > -1 || sUserAgent.indexOf('Windows XP') > -1;

            if (isWinXP) {

                return 'WinXP';
            }
            var isWin2003 = sUserAgent.indexOf('Windows NT 5.2') > -1 || sUserAgent.indexOf('Windows 2003') > -1;

            if (isWin2003) {

                return 'Win2003';
            }
            var isWinVista = sUserAgent.indexOf('Windows NT 6.0') > -1 || sUserAgent.indexOf('Windows Vista') > -1;

            if (isWinVista) {

                return 'WinVista';
            }
            var isWin7 = sUserAgent.indexOf('Windows NT 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1;

            if (isWin7) {

                return 'Win7';
            }
            var isWin8 = sUserAgent.indexOf('Windows NT 6.2') > -1 || sUserAgent.indexOf('Windows 8') > -1;

            if (isWin8) {

                return 'Win8';
            }
        }

        if (vars.IsWindows) {

            return 'windows';
        }

        return 'other';
    };

    var sysPlatform = function () {

        if (vars.IsIOS) {

            if (vars.IsIPad) {

                return 'ipad';

            } else {

                return 'iphone';
            }

        } else if (vars.IsAndroid) {

            if (vars.IsAndroidPad) {

                return 'androidpad';

            } else {

                return 'android';
            }

        } else if (vars.IsWindowsPhone) {

            return 'windowsphone';

        } else if (vars.IsWindows) {
            var isWin = (navigator.platform === 'Win32') || (navigator.platform === 'Windows');
            var plat64 = sUserAgent.indexOf('WOW64') > -1 || sUserAgent.indexOf('Win64') > -1;

            if (isWin && plat64) {

                return 'Win64';

            } else {

                return 'Win32';
            }

        } else {

            return navigator.platform;
        }

    };

    /**
     * @module trace
     * @namespace trace
     * @property {function} getUid                -获取uid
     * @property {function} getFUid               -获取fuid
     * @property {function} getClientUid          -拉起客户端 uid从url中获取
     * @property {function} getScreenSize         -获取窗口尺寸
     * @property {function} getPassport           -获取passport
     * @property {function} getOS                 -获取系统类型
     * @property {function} getPlatform           -获取平台
     * @property {function} getVideoData          -获取videoData指定字段值
     * @property {function} getQueryString        -获取url search param
     * @property {function} getChannelSrc         -取MTV_SRC渠道号
     * @property {function} getChanneled          -取Channeled值
     * @property {function} getConnectionType     -获取网络状态
     */
    var Trace = {
        /**
         * @memberOf trace
         * @summary 获取uid
         * @return {string}
         */
        getUid: function () {

            return Cookie.get('SUV') || '';
        },
        /**
         * @memberOf trace
         * @summary 获取fuid
         * @return {string}
         */
        getFUid: function () {
            var fuid = Cookie.get('fuid');

            if (!fuid) {
                fuid = Cookie.get('SUV');
            }

            return fuid;
        },
        /**
         * @memberOf trace
         * @summary 拉起客户端 uid从url中获取
         * @return {string}
         */
        getClientUid: function () {

            return Trace.getQueryString('uid') || '';
        },
        /**
         * @memberOf trace
         * @summary 获取窗口尺寸
         * @return {number}
         */
        getScreenSize: function () {

            return screenSize;
        },
        /**
         * @memberOf trace
         * @summary 获取passport obj
         * @return {string}
         */
        getPassport: function () {

            return passport;
        },
        /**
         * @memberOf trace
         * @summary 获取系统类型
         * @return {string}
         */
        getOS: function () {

            return sysOS();
        },
        /**
         * @memberOf trace
         * @summary 获取平台
         * @return {string}
         */
        getPlatform: function () {

            return sysPlatform();
        },
        /**
         * @memberOf trace
         * @param  {string} key －获取videoData指定字段key
         * @return {string}
         */
        getVideoData: function (key) {
            var videoData = window['VideoData'] || window['videoData'] || {};

            return videoData[key] || '';
        },
        /**
         * @memberOf trace
         * @param  {string} name 获取url search
         * @return {string}
         */
        getQueryString: function (name) {
            var reg = new RegExp('(^|&?)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);

            if (r !== null) {

                return unescape(r[2]);
            }

            return '';
        },
        getLQD: function() {
            return Trace.getQueryString("lqd") || Cookie.get("_LQD") || ""
        },
        getLCODE: function() {
            return Trace.getQueryString("lcode") || Cookie.get("_LCODE") || ""
        },
        /**
         * @memberOf trace
         * @summary 取MTV_SRC渠道号
         * @return {string}
         */
        getChannelSrc: function () {
            //trace中的src在url中没有时候，还需要从cookie中取，而拉起时候就不需要走cookie中的src
            var channelSrc = Trace.getQueryString('src') || Trace.getQueryString('SRC') || Cookie.get('MTV_SRC') || '0';
            channelSrc = channelSrc.replace('|', '').replace('%7C', '');
            var isip = /(\d+).(\d+).(\d+).(\d+)/i.test(window.document.domain);
            //微信
            if (channelSrc === '0' && vars.IsWeixinBrowser) {
                channelSrc = '11040001';
            }

            if (channelSrc === '0' && (isip || window.document.domain === '')) {
                channelSrc = '11050001'; //默认m.tv.sohu.com
            }

            return channelSrc;
        },
        /**
         * @memberOf trace
         * @summary 取Channeled值
         * @return {string}
         */
        getChanneled: function () {
            //trace中的channeled在url中和videodata中没有时候，还需要从cookie中取
            var videoData = window['VideoData'] || window['videoData'] || {};
            var pageData = window['pageData'] || {};
            var _urlsrc = Trace.getQueryString('src') || Trace.getQueryString('SRC') || '';
            _urlsrc = _urlsrc.replace('|', '').replace('%7C', '');
            var _defsrc = '1212120001';

            if (_urlsrc) {
                _defsrc = '1212130001'; //渠道
            }
            var cld = Cookie.get('_channeled') || _defsrc; //有些是不支持cookie
            var _href = location.href || vars.PROTOCOL + 'm.tv.sohu.com/';

            try {

                if (_href.indexOf('hots') > -1 || (typeof videoDataFirst !== 'undefined' && videoDataFirst)) {
                    //热点流&短视频
                    cld = videoData['channeled'] || Trace.getQueryString('channeled') || pageData['channeled'] || cld;

                } else {
                    cld = Trace.getQueryString('channeled') || videoData['channeled'] || pageData['channeled'] || cld;
                }

                //微信
                if (vars.IsWeixinBrowser) {
                    // if(cld != '1211110100' && cld != '1211110200'){
                    if (cld.substr(0, 6) !== '121111') {
                        cld = '1211110001';
                    }
                }

                if (URL.getQueryString('from') === 'sogou') {
                    cld = '1200150001';
                }

            } catch (e) {

                if (typeof console !== 'undefined' && typeof console.log === 'function') {
                    console.log(e);
                }
            }

            return cld;
        },
        /**
         * @memberOf trace
         * @summary Android获取网络连接类型，如 果取不到返回空字符串，
         * @return {string}  2g|3g|wifi
         */
        getConnectionType: function () {

            return Util.getConnectionType() || '';
        },
        /**
         * @memberOf trace
         * @summary Android获取网络trace 发送目标
         * @return {string}  pc|h5
         */
        getTraceDestination: function () {
            var rst = vars.IsPC ? 'pc' : 'h5';
            var pageData = window.pageData || {};

            if (typeof pageData.traceDestination !== 'undefined' && $(['pc', 'h5']).indexOf(pageData.traceDestination) > -1) {
                rst = pageData.traceDestination;
            }

            return rst;
        },

        /**
         * 自媒体商城cookie初始化
         * type 1:公共 2:专门用于pv
         * @return 
         */
        initPmallCookies: function(type) {
            type = type || 1;
            var search = URL.getQueryData(location.search);
            function set(k, v) {
                Cookie.set(k, v, cookieTimeout, '.sohu.com');
            }
            function get(k) {
                return Cookie.get(k);
            }
            //处理累计入口参数
            function processMLS(v) {
                if (v) {
                    var mls = get('_pass_mls');
                    if (mls) {
                        var arr = mls.split('_');
                        var idx = _.indexOf(arr, v);
                        if (idx == -1) {
                            arr.push(v)
                        } else {
                            if (arr.length > 1 && idx != arr.length-1 && v != arr[0]) {
                                arr[idx] = null;
                                arr.push(v);
                            }
                        }
                        arr = _.without(arr, null);
                        set('_pass_mls', arr.join('_'));
                    } else {
                        set('_pass_mls', v)
                    }
                }
            }

            //处理重要页面信息参数
            function processMPG(v) {
                if (v) {
                    var mpg = get('_pass_mpg');
                    if (mpg) {
                        var arr = mpg.split('_');
                        var idx = _.indexOf(arr, v);
                        if (idx == -1) {
                            arr.push(v)
                        } else {
                            if (arr.length > 1 && idx != arr.length-1 && v != arr[0]) {
                                arr[idx] = null;
                                arr.push(v);
                            }
                        }
                        arr = _.without(arr, null);
                        set('_pass_mpg', arr.join('_'));
                    } else {
                        set('_pass_mpg', v)
                    }
                }
            }

            //处理最后一个入口参数
            function processMLS2(v) {
                if (v) {
                    set('_pass_mls2', v);
                }
            }

            //处理baitu
            function processBaitu(v) {
                if (v) {
                    set('_pass_baitu_from', v);
                }
            }

            //增加pv等需要的参数
            function addPVParams() {
                var p = {};
                p.ismall = 1;
                var mls = get('_pass_mls');
                var mls2 = get('_pass_mls2');
                var mpg = get('_pass_mpg');

                if (mls) p.mls = mls;
                if (mls2) p.mls2 = mls2;
                if (mpg) p.mpg = mpg;
                window.pmallPvExt = p;
                console.log('window.pmallPvExt---->', p);
            }
            function addPVParams_pv() {
                var p_pv = {};
                var baitu_from = get('_pass_baitu_from');
                if (baitu_from) p_pv.baitu_from = baitu_from;
                window.pmallPvExt_pv = p_pv;
                console.log('window.pmallPvExt_pv---->', p_pv);
            }

            

            //初始化
            if (type == 1 && window.pmallPvExt === undefined || window.pmallPvExt.ismall != 1) {
                processMLS(search.mls);
                processMLS2(search.mls);
                var meta = $("meta[property='og:mpg']");
                if (meta.length > 0) {
                    var v = meta.attr("content");
                    processMPG(v);
                }
                var mls = get('_pass_mls');
                var mls2 = get('_pass_mls2');
                var mpg = get('_pass_mpg');
                if(mls) set('_pass_mls', mls);
                if(mls2) set('_pass_mls2', mls2);
                if(mpg) set('_pass_mpg', mpg);
                addPVParams();
            }
            if (type == 2 && window.pmallPvExt_pv === undefined) {
                processBaitu(search.baitu_from);
                var baitu_from = get('_pass_baitu_from');
                if (baitu_from) set('_pass_baitu_from', baitu_from);
                addPVParams_pv();
            }

            var result = {};
            if (type == 1) {
                result = window.pmallPvExt;
            } else if (type == 2) {
                result = window.pmallPvExt_pv;
            }

            return result;

        },

        /**
         * 粉丝社区cookie初始化
         * type 1:公共 2:专门用于pv
         * @return 
         */
        initFansCookies: function(type) {
            type = type || 1;
            var search = URL.getQueryData(location.search);
            function set(k, v) {
                Cookie.set(k, v, cookieTimeout, '.sohu.com');
            }
            function get(k) {
                return Cookie.get(k);
            }
            //处理baitu
            function processBaitu(v) {
                if (v) {
                    set('_pass_baitu_from', v);
                }
            }

            //增加pv等需要的参数
            function addPVParams() {
                var p = {};
                window.fansPvExt = p;
                console.log('window.fansPvExt---->', p);
            }
            function addPVParams_pv() {
                var p_pv = {};
                var baitu_from = get('_pass_baitu_from');
                if (baitu_from) p_pv.baitu_from = baitu_from;
                window.fansPvExt_pv = p_pv;
                console.log('window.fansPvExt_pv---->', p_pv);
            }

            

            //初始化
            if (type == 1 && window.fansPvExt === undefined) {
                //addPVParams();
            }
            if (type == 2 && window.fansPvExt_pv === undefined) {
                processBaitu(search.baitu_from);
                var baitu_from = get('_pass_baitu_from');
                if (baitu_from) set('_pass_baitu_from', baitu_from);
                addPVParams_pv();
            }

            var result = {};
            if (type == 1) {
                result = window.fansPvExt;
            } else if (type == 2) {
                result = window.fansPvExt_pv;
            }

            return result;

        }
    };


    svp.Trace = Trace; //建议用
    module.exports = Trace;
});

//导入基本的trace
define('trace/base',['trace','trace/pv','trace/click'], function (require, exports, module) {

    module.exports = svp.Trace;
});