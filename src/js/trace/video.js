/**
 *   @description : 视频播放统计
 *   @version     : 2.0.2
 *   @update-log  :
 *      1.0.1 - 20150225 周国庆 视频播放统计
 *      1.0.2 - 20150610 周国庆 在vv统计中加入了details字段
 *      1.0.3 - 20150810 周国庆 加入新统计参数mcode
 *      1.0.4 - 20151210 陈  龙 vv统计中加入muid字段
 *      2.0.1 - 20160311 陈  龙 将DMPingbackNew更名为DCPingback,因为原来h5统计是向dc发送,并不是dm
 *                              新增DMPingback方法,这个真正的向dm发送统计,同时做了pc和h5统计发送的兼容逻辑,改后,h5的vv统计发到dc, pc的发送的dm
 *      2.0.2 - 2016-11-03 王宏光 fix https
 *      2.0.2 - 2017-05-25 周国庆 整理统计代码,挪到播放器里见 player/vstats.js
 */

svp.define('trace/video', function (require, exports, module) {
    'use strict';
    var $ = svp.$;
    var global = window;
    var vars = require('base/vars');
    var Cookie = require('base/cookie');
    var Util = require('base/util');
    var Trace = require('trace');
    var URL = require('base/url');
    var codec = require('base/codec');
    var ClickTrace = require('trace/click');
    /**
     * @module trace.video
     * @namespace VideoTrace
     * @property {number}   t                       当前时间戳毫秒
     * @property {number}   playId                  播放开始时候发playcount时的时间戳
     * @property {boolean}  inited                  初始化标识位
     * @property {function} init                    初始化
     * @property {function} getPCRepParamFromPlayer 从player对象中获取上报参数
     * @property {function} qcPingback              qc统计
     * @property {function} parseChanneledJson      组装channeled json结构
     * @property {function} qfPingback              qf统计
     * @property {function} DMPingback              发pc-dm统计调用的函数
     * @property {function} DCPingback              发h5-dc统计调用的函数
     * @property {function} vv                      vv统计
     * @property {function} realVV                  realvv统计
     * @property {function} start                   视频第一次开始播放的事件，同一视频观看完毕后再次播放会再次触发这个事件
     * @property {function} heart                   视频播放心跳（2分钟一次）
     * @property {function} ended                   视频播放完毕统计
     * @property {function} abort                   视频下载中断，浏览器不会继续下载
     * @property {function} error                   播放错误
     * @property {function} buffer                  缓冲统计
     * @property {function} autoPlay                自动播放发送统计
     * @property {function} userClickPlay           用户点击播放发送统计
     */

    var TraceVideo = {

        /**
         * @memberOf TraceVideo
         * @summary 当前时间戳
         * @type {number}
         */
        t: (+new Date),

        /**
         * @memberOf TraceVideo
         * @summary 播放开始时候发playcount时的时间戳
         * @type {number}
         */
        playId: (+new Date),//播放开始时候发playcount时的时间戳

        /**
         * @memberOf TraceVideo
         * @summary 初始化标志位
         * @type {Boolean}
         */
        inited: false,

        /**
         * @memberOf TraceVideo
         * @summary 从player对象中获取上报参数
         * @type {Boolean}
         */
        getPCRepParamFromPlayer: function (player) {
            var cache = typeof player !== 'undefined' && typeof player.cache !== 'undefined' ? player.cache : {};
            //清晰度 普清: 2; 高清: 1; 超清: 21; 原画: 31;
            var hdConfig = {
                nor: '2',
                hig: '1',
                sup: '21',
                ori: '31'
            };
            //是否直播 0: 非直播; 1: 电视台直播; 2: 单场直播
            var ltypeConfig = {
                vod: '0',
                live: '1',
                sLive: '2'
            };

            var rst = {
                fver: cache.fver || 'v4.0',
                isHD: hdConfig[cache.modeType] || '2',
                ltype: ltypeConfig[cache.mediaType] || '0',
                lb: cache.lb || 0,//联播类型 默认0: 不联播; 1: 播放器全屏联播; 2: 页面联播;
                autoplay: cache.autoplay || false
            };

            return rst;
        },

        /**
         * @memberOf TraceVideo
         * @summary 初始化
         */
        init: function () {
            //pt=4： html5-ipad播放
            //pt=41：html5-iphone播放
            //pt=42：html5-android播放
            //pt=43：html5-windows播放
            //pt=44：html5-其它平台播放

            var platType = 44,
                videoData = window.VideoData || window.videoData || {},
                qcPlat = '';

            if (vars.IsIPad) {
                platType = 4;
                qcPlat = '1h5';

            } else if (vars.IsIphone) {
                platType = 41;
                qcPlat = '3h5';

            } else if (vars.IsAndroid) {
                platType = 42;
                qcPlat = '6h5';

            } else if (vars.IsWindowsPhone) {
                platType = 43;
                qcPlat = '11h5';

            } else if (vars.IsIEMobile) {
                platType = 43;
            }

            TraceVideo.qcPlat = qcPlat;
            TraceVideo.platType = platType;
            TraceVideo.qfDomain = ((Math.random() > 0.5) ? 'qf1' : 'qf2') + '.hd.sohu.com.cn';

            TraceVideo.qcURL = (null !== URL.getQueryString('r') && videoData) ?
            vars.PROTOCOL + 'sptjs1.hd.sohu.com.cn/h5/tttst.html' :
            vars.PROTOCOL + 'qc.hd.sohu.com.cn/caton/video/';
          
            TraceVideo.inited = true;
        },
        getVideoData: function (key) {
            var videoData = window.VideoData || window.videoData || (svp._player && svp._player.videoData) || {};
            if(key) {
                return videoData[key] || '';
            }else{
                return videoData;
            }
        },
        /**
         * @memberOf TraceVideo
         * @summary qc统计
         * @param  {string} paramaString -统计参数
         */
        qcPingback: function (paramaString) {
            //qs播放质量
            if (false === TraceVideo.inited) {
                TraceVideo.init();
            }

            if ('1h5' === TraceVideo.qcPlat) {

                return;
            }

            var qcOS = '',
                model = '',
                videoData = TraceVideo.getVideoData();
            var videoSrc = videoData.video_src || '';
            var plid = videoData.plid || videoData.aid || videoData.sid || '';

            if (vars.IsIOS) {
                qcOS = 1;

            } else if (vars.IsAndroid) {
                qcOS = 2;

            } else if (vars.IsWindowsPhone) {
                qcOS = 3;
            }

            if (vars.IsIPad) {
                model = 'ipad';

            } else if (vars.IsIpod) {
                model = 'ipod';

            } else if (vars.IsIPhone) {
                model = 'iphone';

            } else if (vars.IsWindowsPhone) {
                model = 'windowsphone';
            }

            var videoType = '';

            if (videoSrc.match(/\.m3u8/i)) {
                videoType = 'm3u8';

            } else if (videoSrc.match(/\.mp4/i)) {
                videoType = 'mp4';
            }

            var paramArr = [
                '&uid=', Cookie.get('SUV') || '',
                '&poid=',
                '&plat=', TraceVideo.qcPlat, // iPad: 1h5 Androd: 6h5
                '&sver=',
                '&os=', qcOS,
                '&sysver=', Util.getOSVersion(),
                '&net=', Trace.getConnectionType(),
                '&playmode=',
                '&vid=', videoData.vid || '',
                '&sid=', plid,
                '&vtype=', videoType,
                '&pn=', model,
                '&duFile=', encodeURIComponent(videoSrc),
                '&version=', videoData.videoVersion || 0,
                '&isp2p=0',
                '&ltype=0',
                '&site=', videoData.site || '1',
                '&time=', (+new Date)
            ];

            paramaString += paramArr.join('');

            Util.pingback(TraceVideo.qcURL + '?' + paramaString);
        },

        /**
         * @memberOf TraceVideo
         * @summary 组装channeled json结构
         * @return {object}
         */
        parseChanneledJson: function () {
            var retjson = {};
            var channeled = Trace.getChanneled();
            var _href = location.href || (vars.PROTOCOL+'m.tv.sohu.com/');
            retjson.channeled = channeled || '1212120001';
            retjson.href = _href;
            retjson.clientUid = Trace.getClientUid();

            return retjson;
        },

        /**
         * @memberOf TraceVideo
         * @summary qf统计
         * @param  {string} paramaString -统计参数
         */
        qfPingback: function (paramaString) {

            if (false === TraceVideo.inited) {
                TraceVideo.init();
            }
            var videoData =  TraceVideo.getVideoData();

            paramaString += [
                '&seekto=0',
                '&pt=', TraceVideo.platType,
                '&sid=', Cookie.get('SUV') || '',
                '&vid=', videoData.vid || '',
                '&nid=', videoData.nid || '',
                '&ref=', encodeURIComponent(location.href),
                '&dom=',
                '&t=', TraceVideo.t++
            ].join('');

            Util.pingback(vars.PROTOCOL + '' + TraceVideo.qfDomain + '/dov.do?method=stat' + paramaString);
        },

        /**
         * @memberOf TraceVideo
         * @summary 发h5-dc统计调用的函数
         * @param {string} params -统计带的参数
         * @param {string} url    -统计url
         */
        DCPingback: function (params, url, details) {
            var videoData = TraceVideo.getVideoData();
            var chljson = TraceVideo.parseChanneledJson();
            var channeled = chljson.channeled;
            var href = chljson.href || location.href;
            var plid = videoData.plid || videoData.aid || videoData.sid || '';

            params = $.extend({
                url: href,
                refer: document.referrer || (vars.PROTOCOL+'m.tv.sohu.com/'),
                uid: Trace.getUid(),
                webtype: Trace.getConnectionType(),
                screen: Trace.getScreenSize(),
                catecode: Trace.getVideoData('cateCode')||Trace.getVideoData('cate_code'),
                pid: plid,
                vid: Trace.getVideoData('vid'),
                cateid: Trace.getVideoData('cid'),
                ltype: Trace.getVideoData('ltype'),
                company: Trace.getVideoData('company'),
                version: '0',
                type: ('9001' === Trace.getVideoData('cid') ? 'my' : 'vrs'),
                td: Trace.getVideoData('totalDuration') || Trace.getVideoData('total_duration') || 0,
                apikey: vars.API_KEY,
                t: +new Date,
                os: Trace.getOS(),
                platform: Trace.getPlatform(),
                passport: Trace.getPassport(),
                channeled: channeled,
                site: videoData.site || '1',
                playid: TraceVideo.playId,
                nid: videoData.nid || '',
                MTV_SRC: encodeURIComponent(Trace.getChannelSrc()),
                muid: Cookie.get('MUID') || Cookie.get('_muid_')||'0'
            }, params);

            videoData.ugcode && (params.ugcode2 = videoData.ugcode),
            videoData.ugu && (params.ugu2 = videoData.ugu),
            videoData.liveId && (params.cid = "9002");

            //该参数是统计后台过滤防刷数据用的
            params.mcode = params.mcode|| videoData.mCode || codec.md5((Cookie.get('MUID') || Cookie.get('_muid_')||'0') + params.vid + 'sohu_tv_html5');

            details = (typeof details === 'undefined') ? {} : details;
            var columnid = URL.getParam('columnid');

            if (columnid !== null && columnid !== '') {
                details.columnId = columnid;
            }
            details.ext1 = 'foxplayer_' + window.location.host;

            if (details !== null) {
                params.details = JSON.stringify(details);
            }

            Util.pingback((url || vars.PROTOCOL + 'z.m.tv.sohu.com/vv.gif') + '?' + $.param(params));
            /* 统计flash播放 */
            if (window.flashStatistId) {
                params.channeled = window.flashStatistId;
                Util.pingback((url || vars.PROTOCOL + 'z.m.tv.sohu.com/vv.gif') + '?' + $.param(params));
            }
        },

        /**
         * @memberOf TraceVideo
         * @summary 发pc-dm统计调用的函数
         * @param {string} params -统计带的参数
         * @param {string} url    -统计url
         */
        DMPingback: function (params, url, details) {
            var videoData = TraceVideo.getVideoData();;
            var t5BeforeMd5 = '';
            var vid = Trace.getVideoData('vid');
            var uid = Trace.getFUid();
            var systype = videoData.site === '1' ? 0 : 1;
            var timestamp = (new Date()).getTime();
            var isIframe = window.top === window ? 0 : 1;

            try {
                t5BeforeMd5 = (parseInt(vid, 10) % 127).toString();
                t5BeforeMd5 += uid;
                t5BeforeMd5 += timestamp % 127;

            } catch (e) {
            }

            params = $.extend({
                fver: params.fver || 'v4.0',                              //H5播放器版本
                isHD: params.isHD || '2',                                 //清晰度 普清: 2; 高清: 1; 超清: 21; 原画: 31;
                refer: document.referrer || vars.PROTOCOL + 'tv.sohu.com/',
                playListId: videoData.plid || videoData.aid || videoData.sid || '',          //视频的专辑id
                isp2p: 0,                                                 //是否p2p加速 0: 否; 1: 是;
                systype: systype,                                         //视频类型 1: ugc或pgc; 0: vrs视频;
                t: timestamp,                                             //时间戳
                heart: 30,                                                //心跳间隔 3分钟以外: 30; 3分钟以内: 10;
                t5: codec.md5(t5BeforeMd5),                               //MD5码 有uid，vid和t三个参数生成，规范见下方，videoEnds可以不发，生成逻辑为Md5（vid%127+uid+t%127），这里面的“+”是字符串连接，不是相加。
                uid: uid,                                                 //H5播放器用户唯一标识
                vid: vid,
                site: videoData.site || '1',
                areaid: videoData.areaId || videoData.area_id,
                ltype: params.ltype || 0,                                 //是否直播 0: 非直播; 1: 电视台直播; 2: 单场直播
                time: params.time || 0,                                   //播放完后的实际总时长 msg=videoEnds时有值，其它为0
                sid: Trace.getUid(),                                      //Js的唯一用户cookieid Js的suv
                uuid: params.uuid || Util.createUUID(),                   //唯一的一次播放标识 每一次观看该值都不同
                td: videoData.duration || '',                             //视频物理时长
                isIframe: isIframe,                                       //是否iframe页面播放 0: 否; 1: 是;
                atype: 0,                                                 //客户端类型 常量值0
                lb: params.lb || 0,                                       //联播类型 默认0: 不联播; 1: 播放器全屏联播; 2: 页面联播;
                autoplay: params.autoplay || 0,                           //自动播放 自动: 1; 0: 不自动播放器;
                passport: Trace.getPassport(),
                out: params.out || 0,                                     //是否是站外 站外: 1; 站内: 0;
                catcode: Trace.getVideoData('cateCode')  ||Trace.getVideoData('cate_code'),                  //视频分类
                muid: Cookie.get('MUID') || Cookie.get('_muid_')||'0'
            }, params);

            videoData.ugcode && (params.ugcode2 = videoData.ugcode),
            videoData.ugu && (params.ugu2 = videoData.ugu),
            videoData.liveId && (params.cid = "9002");
            //该参数是统计后台过滤防刷数据用的
            params.mcode = params.mcode|| videoData.mCode || codec.md5((Cookie.get('MUID') || Cookie.get('_muid_')||'0') + params.vid + 'sohu_tv_html5');


            details = (typeof details === 'undefined') ? {} : details;
            var columnid = URL.getParam('columnid');

            if (columnid !== null && columnid !== '') {
                details.columnId = columnid;
            }
            details.ext1 = 'foxplayer_' + window.location.host;

            if (details !== null) {
                params.details = Util.JSONStringify(details);
            }

            Util.pingback((url || vars.PROTOCOL + 'pb.hd.sohu.com.cn/hdpb.gif') + '?' + $.param(params));
        },

        /**
         * @memberOf TraceVideo
         * @summary 统计vv
         */
        vv: function (options) {
            options=options||{};
            var videoData =TraceVideo.getVideoData();

            if (!vars.IsPC) {
                var duration = 10;
                var params = $.extend({
                    vid:  videoData.vid || '0',
                    msg: 'playCount',
                    time:options.time|| '0'
                });
                //如果是直播，是不包含duration字段的。默认为10
                if (typeof videoData !== 'undefined' && typeof videoData.duration !== 'undefined') {
                    duration = videoData.duration || options.duration||0;
                }
                //qf
                TraceVideo.qfPingback('&error=0&code=2&allno=0&vvmark=1&totTime=' + duration);

                // if (!vars.IS_EXTERNAL_PLAYER) {
                //   Comscore vv pingback
                //   Util.pingback(vars.PROTOCOL + 'b.scorecardresearch.com/b?c1=1&c2=7395122&c3=&c4=&c5=&c6=&c11=' + (Cookie.get('SUV') || ''));
                // }

                TraceVideo.DCPingback(params);
                TraceVideo.playId = +new Date;
                TraceVideo.qcPingback('code=10&duation=0');

            } else {
                var params = TraceVideo.getPCRepParamFromPlayer();
                params.msg = 'playCount';
                TraceVideo.DMPingback(params);
            }
        },

        /**
         * @memberOf TraceVideo
         * @summary 真正开始播放发送统计
         * @param1  {player} player
         * @param2  {options} startPlayTime -播放时间戳
         */
        realVV: function (options) {
            var playtime = 0;
            if(typeof options=='object') {
                 options = options || {};
                 playtime = options.time;
            }else if(typeof options=='number'){
                 playtime = options;
            }else{
                 playtime = TraceVideo.playId ? (((+new Date) - TraceVideo.playId) / 1000) : 0;
            }

            if (!vars.IsPC) {
                var videoData = TraceVideo.getVideoData();
                var params = $.extend({
                    msg: 'videoStart',
                    time: playtime,
                });
                TraceVideo.DCPingback(params);
                TraceVideo.qcPingback('code=5&duation=' + playtime);

            } else {
                var params = TraceVideo.getPCRepParamFromPlayer();
                params.msg = 'videoStart';
                params.time = playtime;
                TraceVideo.DMPingback(params);
            }
        },

        /**
         * @memberOf TraceVideo
         * @summary 视频第一次开始播放的事件，同一视频观看完毕后再次播放会再次触发这个事件
         */
        start: function (options) {
            var videoData = TraceVideo.getVideoData();
            var playtime = 0;
            if(typeof options=='object') {
                options = options || {};
                playtime = options.time;
            }else if(typeof options=='number'){
                playtime = options||0;
            }else{
                playtime = TraceVideo.playId ? (((+new Date) - TraceVideo.playId) / 1000) : 0;
            }
            var params = $.extend({
                vid: videoData.vid,
                time:playtime
            },options);
            ClickTrace.pingback(null, 'video_play_start', params);
            TraceVideo.qcPingback('code=15');
        },

        /**
         * @memberOf TraceVideo
         * @summary 视频播放心跳（2分钟一次）
         * @param  {number} time -当前播放时间
         */
        heart: function (options) {
            var playtime = 0;
            if(typeof options=='object') {
                options = options || {};
                playtime = options.time;
            }else if(typeof options=='number'){
                playtime = options||0;
            }else{
                playtime = TraceVideo.playId ? (((+new Date) - TraceVideo.playId) / 1000) : 0;
            }

            if (!vars.IsPC) {
                var params = $.extend({
                    tc: time,
                },options);

                TraceVideo.DCPingback(params,vars.PROTOCOL + 'z.m.tv.sohu.com/playtime.gif');
            } else {
                var params = TraceVideo.getPCRepParamFromPlayer();
                params.tc  = time;
                TraceVideo.DMPingback(params);
            }
        },

        /**
         * @memberOf TraceVideo
         * @summary 视频播放完毕
         * @param  {number} time        播放时长
         * @param  {number} bufferCount 缓冲次数
         */
        ended: function ( bufferCount, playtime) {
            var videoData = TraceVideo.getVideoData();
            var time =  playtime|| TraceVideo.playId ? (((+new Date) - TraceVideo.playId) / 1000) : 0;
            var buffered=bufferCount||0;
            
            if(typeof bufferCount=='object') {
                time = bufferCount.time||TraceVideo.playId ? (((+new Date) - TraceVideo.playId) / 1000) : 0; 
            }
            if (!vars.IsPC) {
                var params = $.extend({
                    msg: 'videoEnds',
                    time: time,
                });
                TraceVideo.DCPingback(params);
                TraceVideo.qcPingback('code=7&duration=' + time + '&ct=' + buffered);

            } else {
                var params = TraceVideo.getPCRepParamFromPlayer(player);
                params.msg = 'videoEnds';
                params.time = time;
                TraceVideo.DMPingback(params);
            }
        },
        /**
         * @memberOf TraceVideo
         * @summary 视频下载中断，浏览器不会继续下载
         */
        abort: function () {
            TraceVideo.qfPingback('&code=8&error=800&allno=1&drag=-1');
        },

        /**
         * @memberOf TraceVideo
         * @summary 播放错误
         * @param  {number} startPlayTime -播放时间戳
         */
        error: function (startPlayTime) {
            TraceVideo.qfPingback('&error=500&code=2&allno=1&vvmark=0');
            TraceVideo.qcPingback('code=8&duation=' +
                (((+new Date) - startPlayTime) / 1000) +
                '&error=' + (!window['VideoData']['video_src'] ? '401' : '1000'));
        },

        /**
         * @memberOf TraceVideo
         * @summary 缓冲统计测试
         * @param  {number} bufferCount   -缓冲次数
         * @param  {number} startPlayTime -播放时间戳
         */
        buffer: function (bufferCount, startPlayTime) {
            var duation = ((+new Date) - startPlayTime) / 1000;

            if (1 === bufferCount || 4 === bufferCount) {
                TraceVideo.qfPingback('&code=5&bufno=1&allbufno=' + bufferCount);
            }

            TraceVideo.qcPingback('code=' + ((bufferCount === 1) ? 6 : 4) +
                '&ct=' + bufferCount +
                '&duation=' + duation);
        },

        /**
         * @memberOf TraceVideo
         * @summary 自动播放发送统计
         */
        autoPlay: function () {
            TraceVideo.qcPingback('code=30');
        },

        /**
         * @memberOf TraceVideo
         * @summary 用户点击播放发送统计
         */
        userClickPlay: function () {
            TraceVideo.qcPingback('code=31');
        }
    };

    svp.TraceVideo = TraceVideo; //建议用

    module.exports = TraceVideo;


});