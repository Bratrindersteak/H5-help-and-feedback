/**
 *   @description: pv统计业务
 *   @version    : 2.0.3
 *   @update-log :
 *      1.0.1 - 20150202 刘文龙 pv统计业务
 *      1.0.2 - 20150302 陈  龙 在pv统计字段中加入了details字段
 *      1.0.3 - 20150702 陈  龙 加入新统计参数mcode
 *                              加入了自动发送pv,并且加入了发送标志位，保证会不重复发送
 *      1.0.4 - 20160303 陈  龙 修复TracePV.init自动发送pv的bug
 *      2.0.1 - 20160304 陈  龙 加入了pc统计pv的逻辑,通过检测浏览器类型,向不同的统计后台发送统计请
 *      2.0.2 - 20160418 陈  龙 统计业务支持通过配置参数向指定后台发统计请求
 *      2.0.3 - 2016-11-03 王宏光 fix https
 */

define('trace/pv',function(require, exports, module) {

    var $ = svp.$ || window.Zepto;
    var global = window;

    var vars = require('base/vars'),
        Util = require('base/util'),
        URL = require('base/url'),
        Trace = require('trace'),
        Cookie = require('base/cookie'),
        codec = require('base/codec'),
        pp = require('base/passport');

    var TraceH5PV = {
        sendFlag: false,
        pv: function (more, details) {
            if (this.sendFlag) {
                return;
            }
            this.sendFlag = true;
            var params = {};
            more = more || {};
            var videoData = window.VideoData || window.videoData || {};
            var channeled =  Trace.getChanneled();
            if (more && 'undefined' !== typeof more.channeled) {
                channeled = more.channeled;
            } 
            var vid = videoData.vid || '';
            var _href = window.location.href || (vars.PROTOCOL+'m.tv.sohu.com/');
            var plid = videoData.plid || videoData.aid || videoData.sid || '';
            details = (typeof details === 'undefined') ? {} : details;
            if (window.is_mall) {
                if (window.pmallPvExt == undefined) Trace.initPmallCookies();
                if (window.pmallPvExt_pv == undefined) Trace.initPmallCookies(2);
                details = $.extend({}, details, window.pmallPvExt || {}, window.pmallPvExt_pv || {});
            }
            if (window.is_fans) {
                if (window.fansPvExt == undefined) Trace.initFansCookies();
                if (window.fansPvExt_pv == undefined) Trace.initFansCookies(2);
                details = $.extend({}, details, window.fansPvExt || {}, window.fansPvExt_pv || {});
            }
            var columnid = URL.getParam('columnid');
            if (columnid !== null && columnid !== '') {
                details.columnId = columnid;
            }
            details.ext1 = 'foxplayer_' + window.location.host;

            try {
                params = {
                    url: encodeURIComponent(_href),
                    refer: encodeURIComponent(document.referrer || (vars.PROTOCOL+'m.tv.sohu.com/')),
                    uid: Trace.getUid(),
                    webtype: Trace.getConnectionType(),
                    screen: Trace.getScreenSize(),
                    catecode: Trace.getVideoData('cateCode') || Trace.getVideoData('cate_code') || '',
                    pid: plid,
                    vid: Trace.getVideoData('vid') || '',
                    os: Trace.getOS(),
                    platform: Trace.getPlatform(),
                    passport: Trace.getPassport() || URL.getParam('passport') || (window.SohuAppUserData && window.SohuAppUserData.passport) || details.passport ||  '',
                    t: (new Date()).getTime(),
                    channeled: channeled,
                    oth: Trace.getLQD(),
                    cd: Trace.getLCODE(),
                    MTV_SRC: encodeURIComponent(Trace.getChannelSrc())
                };

                videoData.ugcode && (params.ugcode2 = videoData.ugcode),
                videoData.ugu && (params.ugu2 = videoData.ugu),
                videoData.liveId && (params.cid = "9002");

                params.details = JSON.stringify(details);

            } catch (e) {
                typeof console !== 'undefined' && typeof console.log === 'function' && console.log('trace h5pv exception ', e);
            }

            if (vars.ENABLE_DEBUG) {
                typeof console !== 'undefined' && typeof console.log === 'function' && console.log('trace h5pv ', params);
            }
            Util.pingback(vars.PROTOCOL + 'z.m.tv.sohu.com/pv.gif?' + $.param(params));
        },
        pvMall: function (more, details) {
            if (this.sendFlag) {
                return;
            }
            this.sendFlag = true;
            var params = {};
            more = more || {};
            var videoData = window.VideoData || window.videoData || {};
            var channeled =  Trace.getChanneled();
            if (more && 'undefined' !== typeof more.channeled) {
                channeled = more.channeled;
            } 
            var vid = videoData.vid || '';
            var _href = window.location.href || (vars.PROTOCOL+'m.tv.sohu.com/');
            var plid = videoData.plid || videoData.aid || videoData.sid || '';
            details = (typeof details === 'undefined') ? {} : details;
            if (window.pmallPvExt == undefined) Trace.initPmallCookies();
            if (window.pmallPvExt_pv == undefined) Trace.initPmallCookies(2);
            details = $.extend({}, details, window.pmallPvExt || {}, window.pmallPvExt_pv || {});
            var columnid = URL.getParam('columnid');

            if (columnid !== null && columnid !== '') {
                details.columnId = columnid;
            }
            details.ext1 = 'foxplayer_' + window.location.host;

            try {
                params = {
                    url: encodeURIComponent(_href),
                    refer: encodeURIComponent(document.referrer || (vars.PROTOCOL+'m.tv.sohu.com/')),
                    uid: Trace.getUid(),
                    webtype: Trace.getConnectionType(),
                    screen: Trace.getScreenSize(),
                    catecode: Trace.getVideoData('cateCode') || Trace.getVideoData('cate_code') || '',
                    pid: plid,
                    vid: Trace.getVideoData('vid') || '',
                    os: Trace.getOS(),
                    platform: Trace.getPlatform(),
                    passport: Trace.getPassport() || URL.getParam('passport') || (window.SohuAppUserData && window.SohuAppUserData.passport) || details.passport ||  '',
                    t: (new Date()).getTime(),
                    channeled: channeled,
                    oth: Trace.getLQD(),
                    cd: Trace.getLCODE(),
                    MTV_SRC: encodeURIComponent(Trace.getChannelSrc())
                };

                videoData.ugcode && (params.ugcode2 = videoData.ugcode),
                videoData.ugu && (params.ugu2 = videoData.ugu),
                videoData.liveId && (params.cid = "9002");

                params.details = JSON.stringify(details);

            } catch (e) {
                typeof console !== 'undefined' && typeof console.log === 'function' && console.log('trace h5pv exception ', e);
            }

            if (vars.ENABLE_DEBUG) {
                typeof console !== 'undefined' && typeof console.log === 'function' && console.log('trace h5pv ', params);
            }

            //给支付页的cookie参数
            var payParams = _.pick(params, 'details', 'channeled', 'MTV_SRC');
            payParams.from = 1;
            Cookie.set('trackMKeys', JSON.stringify(payParams), 1, '.sohu.com');

            Util.pingback(vars.PROTOCOL + 'z.m.tv.sohu.com/pv.gif?' + $.param(params));
        }
    };

    TraceH5PV.iwt = function() {
        //艾瑞 iwt-min
        window.isIwt = true;
        if(window.isIwt) {
            if ('m.tv.sohu.com' === location.host) {
                $('body').append('<img width="1" height="1" src="//sohu.irs01.com/irt?_iwt_UA=UA-sohu-000001&jsonp=_410RZ"/>');
                Util.loadScript(vars.PROTOCOL + 'tv.sohu.com/upload/Trace/iwt-min-1611.js', function () { });
            }
        }
    };

    TraceH5PV.comscore = function() {
        //comscore,20161221统计下线
        if(window.isComscore) {
            var comsoreUrl = (document.location.protocol == 'https:' ? 'https://sb' : 'http://b') + '.scorecardresearch.com/beacon.js';
            Util.loadScript(comsoreUrl, function () {
                console.log('comscore pv scorecardresearch.com/beacon.js');
                if ('undefined' !== typeof window['COMSCORE']) {
                    window['COMSCORE']['beacon']({
                        'c1': '2',
                        'c2': '7395122',
                        'c3': '',
                        'c4': '',
                        'c5': '',
                        'c6': '',
                        'c15': ''
                    });
                }
            });
        }
    };

    TraceH5PV.wrating = function() {
        //wrating,20161221统计下线
        //体育频道单独统计代码
        if(window.isWrating) {
            if ('m.s.sohu.com' === location.host) {
                Util.loadScript((document.location.protocol == 'https:' ? 'https://' : 'http://') + 'js.sohu.com/wrating20120726.js', function () {
                    var _wratingId;
                    try {
                        _wratingId = window['_getAcc']();
                    } catch (e) {
                    }
                    if (_wratingId) {
                        Util.loadScript((document.location.protocol == 'https:' ? 'https://' : 'http://') + 'sohu.wrating.com/a1.js', function () {
                            window['vjAcc'] = _wratingId;
                            window['wrUrl'] = (document.location.protocol == 'https:' ? 'https://' : 'http://') + 'sohu.wrating.com/';
                            try {
                                if (true === window['vjValidateTrack']()) {
                                    var imageUrl = window['wrUrl'] + 'a.gif' + window['vjGetTrackImgUrl']();
                                    $(document.body).append('<div style="display:none"><img src="' + imageUrl + '" id="wrTagImage" /></div>');
                                    window['vjSurveyCheck']();
                                }
                            } catch (e) {
                            }
                        });
                    }
                });

            } else {
                //缔元 c.wrating.com
                Util.loadScript((document.location.protocol == 'https:' ? 'https://' : 'http://') + 'tv.sohu.com/upload/Trace/wrating.js', function () {
                });
            }
        }
    };

    TraceH5PV.init = function(objs) {
        var _self = this;
        var more = $.extend(true, {}, {
            isAutoTrace: vars.IsAutoTrace
        }, objs);

        var autoTrace = more.isAutoTrace;
        var columnid = URL.getParam('columnid');

        if (columnid !== null && columnid !== '') {
            more.columnId = columnid;
        }
        window['_iwt_UA'] = 'UA-sohu-123456';

        if (!vars.IS_EXTERNAL_PLAYER) {
            //站外不发pv
            if (!!autoTrace) {
                TraceH5PV.pv(more);
            }

            if (!/SohuVideoMobile/.test(vars.UA)) {
                TraceH5PV.iwt();
                TraceH5PV.comscore();
                TraceH5PV.wrating();
            }
        }

    };

    
    var TracePCPV = {
        sendFlag: false,
        pv: function (more, details) {
            
            if (this.sendFlag) {
                return;
            }
            this.sendFlag = true;
            more = more || {};
            var channeled =  Trace.getChanneled();
            var videoData = window.VideoData || window.videoData || {};
            var pageData = window.pageData || {};

            if (more && 'undefined' !== typeof more.channeled) {
                channeled = more.channeled;
            }
            var params = {};

            try {
                params = {
                    url: window.location.href,                              //当前页面的url, 这里，不用在编码了, jquery.param已经做了编码
                    refer: document.referrer || (vars.PROTOCOL+'m.tv.sohu.com/'),      //上一个页面的url，没有则为空，这里, 不用在编码了，jquery.param已经做了编码
                    fuid: Trace.getFUid(),                                  //播放器的唯一标识
                    vid: Trace.getVideoData('vid') || more.vid||'',          //视频id
                    suv: Trace.getUid(),                                    //suv   uid
                    passport: Trace.getPassport(),                          //搜狐通行证，针对登陆用户，无登陆为空串
                    catecode: Trace.getVideoData('cateCode') || Trace.getVideoData('cate_code') || '100', //100（电影），最好能到二级分类，如100130，取不到则写死100
                    playlistid: videoData.plid || videoData.aid || videoData.sid || '',          //视频的专辑id
                    pid: '',                                                //cms生成的id, 这里不依赖于cms页面结构，直接传空
                    R: window.screen.width + 'x' + window.screen.height,    //1366x768 (屏幕分辨率,js拿不到屏幕分辨率,直接返回窗口高宽)
                    OS: Util.getPCOS()                                   //(操作系统)

                };
                //接口里没有要求，自己加的 
                params.details = JSON.stringify(details);
                params.channeled = channeled;

            } catch (e) {
                typeof console !== 'undefined' && typeof console.log === 'function' && console.log('trace pcpv exception ', e);
            }

            if (vars.ENABLE_DEBUG) {
                typeof console !== 'undefined' && typeof console.log === 'function' && console.log('trace h5pv ', params);
            }
            Util.pingback(vars.PROTOCOL + 'pv.hd.sohu.com/pvpb.gif?' + $.param(params));
        }
    };

    var TracePV = {
        pv: function (more, details) {
            var destination = Trace.getTraceDestination();

            if (destination === 'pc') {
                TracePCPV.pv(more, details);

            } else {
                TraceH5PV.pv(more, details);
            }
        },
        pvMall: TraceH5PV.pvMall,
        TraceH5PV:TraceH5PV,
        TracePCPV:TracePCPV
    };

    $(document).ready(function() {
        if (!vars.IsPC) {
            TraceH5PV.init();
        }
    });

    //兼容old
    svp.TracePV = TracePV;//建议用
    module.exports  = TracePV;


});