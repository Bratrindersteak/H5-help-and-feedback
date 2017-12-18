import URL from './url';
import { default as vars } from './vars';
import { default as cookie } from './cookie';
import { default as util } from './util';
import { Console } from './console';
import { default as download } from '../data/appDownload';

define('trace/click',function(require, exports, module) {
    'use strict';
    var vars = require('base/vars'),
        Util = require('base/util'),
        URL = require('base/url'),
        codec = require('base/codec'),
        Cookie = require('base/cookie'),
        Trace = require('trace');
    var global = window;
    /**
     * @module trace.click
     * @namespace Trace
     * @property {function}   pingBack  返回指定选择符的DOM集合
     *
     * @example
     *      var ClickTrace = require('trace.click');
     *      行为统计方法调用说明:
     *        针对链接点击的统计：
     *            DOM: <a class="link" href=".." position="sohuapp_download">Link</a>
     *            Javascript:
     *            $('.link').on('click', function() {
     *              var el = $(this);
     *              ClickTrace.pingback(el);
     *              setTimeout(function() {
     *                  location.href = el.attr('href');
     *              }, 50);
     *              return false; //为了在点击链接跳转的时候可以让统计数据发送出去，使用setTimeout做链接跳转
     *            });
     *
     *        针对非链接点击的自定义统计:
     *            ClickTrace.pingback(null, "sohuapp_download");
     */
    var H5ClickTrace = {

        /**
         * @memberof H5ClickTrace
         * @summary 发送统计点信息
         * @type {function}
         * @param {object} el  RR.dom对象
         * @param {string} position (可选)统计字段名，如果为空会尝试从el的position属性获取
         * @param {object} details (可选)统计的附加数据
         * @param {function} callback (可选)回调函数
         */
        pingback: function (el, position, details, callback) {
            position = position || (el && el.attr('position')) || '';
            var videoData = window.VideoData || window.videoData || {};
            var params = {};
            // var isRecomend = window.isRecomend || false;
            var channeled = Trace.getChanneled();
            var vid = Trace.getVideoData('vid') || '';
            var plid = videoData.plid || videoData.aid || videoData.sid || '';
            var _href = window.location.href || (vars.PROTOCOL+'m.tv.sohu.com/')
            details = details || (el && el.attr('details')) || {};
            if (window.is_mall) {
                if (window.pmallPvExt == undefined) Trace.initPmallCookies();
                details = $.extend({}, details, window.pmallPvExt || {});
            }
            if (window.is_fans) {
                if (window.fansPvExt == undefined) Trace.initFansCookies();
                details = $.extend({}, details, window.fansPvExt || {});
            }

            var columnid = URL.getParam('columnid');
            if (columnid !== null && columnid !== '') {
                details.columnId = columnid;
            }
            details.ext1 = 'foxplayer_' + window.location.host;

            try {

                if (vars.IsWeixinBrowser) {
                    // if(channeled != '1211110100' && channeled != '1211110200'){
                    if (channeled.toString().substr(0, 6) !== '121111') {
                        channeled = '1211110001';
                    }
                }

                params = {
                    t: +new Date,
                    uid: Trace.getUid(),
                    position: position,
                    op: 'click',
                    details: Util.JSONStringify(details),
                    nid: Trace.getVideoData('nid') || '',
                    url: encodeURIComponent(_href),
                    refer: encodeURIComponent(document.referrer || (vars.PROTOCOL+'m.tv.sohu.com/')),
                    screen: Trace.getScreenSize(),
                    os: Trace.getOS(),
                    platform: Trace.getPlatform(),
                    passport: Trace.getPassport() || URL.getParam('passport') || (window.SohuAppUserData && window.SohuAppUserData.passport) || details.passport ||  '',
                    vid: vid||details.vid || '',
                    pid: plid || '',
                    channeled: channeled,
                    MTV_SRC: encodeURIComponent(Trace.getChannelSrc())
                };
                //该参数是统计后台过滤防刷数据用的
                params.mcode = videoData.mCode|| details.mcode || codec.md5(Cookie.get('MUID') + params.vid + 'sohu_tv_html5');


            } catch (e) {
                
                if (typeof console !== 'undefined' && typeof console.log === 'function') {
                    console.log('trace click exception ', e);
                }
            }
            //console.log('trace click  ',params);
            Util.pingback(vars.PROTOCOL + 'z.m.tv.sohu.com/h5_cc.gif?' + $.param(params), callback);
        },
        pingbackMall: function (el, position, details, callback) {
            position = position || (el && el.attr('position')) || '';
            var videoData = window.VideoData || window.videoData || {};
            var params = {};
            // var isRecomend = window.isRecomend || false;
            var channeled = Trace.getChanneled();
            var vid = Trace.getVideoData('vid') || '';
            var plid = videoData.plid || videoData.aid || videoData.sid || '';
            var _href = window.location.href || (vars.PROTOCOL+'m.tv.sohu.com/')
            details = details || (el && el.attr('details')) || {};
            if (window.pmallPvExt == undefined) Trace.initPmallCookies();
            details = $.extend({}, details, window.pmallPvExt || {});

            var columnid = URL.getParam('columnid');

            if (columnid !== null && columnid !== '') {
                details.columnId = columnid;
            }
            details.ext1 = 'foxplayer_' + window.location.host;

            try {

                if (vars.IsWeixinBrowser) {
                    // if(channeled != '1211110100' && channeled != '1211110200'){
                    if (channeled.toString().substr(0, 6) !== '121111') {
                        channeled = '1211110001';
                    }
                }

                params = {
                    t: +new Date,
                    uid: Trace.getUid(),
                    position: position,
                    op: 'click',
                    details: Util.JSONStringify(details),
                    nid: Trace.getVideoData('nid') || '',
                    url: encodeURIComponent(_href),
                    refer: encodeURIComponent(document.referrer || (vars.PROTOCOL+'m.tv.sohu.com/')),
                    screen: Trace.getScreenSize(),
                    os: Trace.getOS(),
                    platform: Trace.getPlatform(),
                    passport: Trace.getPassport() || URL.getParam('passport') || (window.SohuAppUserData && window.SohuAppUserData.passport) || details.passport ||  '',
                    vid: vid||details.vid || '',
                    pid: plid || '',
                    channeled: channeled,
                    MTV_SRC: encodeURIComponent(Trace.getChannelSrc())
                };
                //该参数是统计后台过滤防刷数据用的
                params.mcode = videoData.mCode|| details.mcode || codec.md5(Cookie.get('MUID') + params.vid + 'sohu_tv_html5');


            } catch (e) {
                
                if (typeof console !== 'undefined' && typeof console.log === 'function') {
                    console.log('trace click exception ', e);
                }
            }
            //console.log('trace click  ',params);
            Util.pingback(vars.PROTOCOL + 'z.m.tv.sohu.com/h5_cc.gif?' + $.param(params), callback);
        }

    };

    var PCClickTrace = {
        /**
         * @memberof PCClickTrace
         * @summary 发送统计点信息
         * @type {function}
         * @param {object} el  RR.dom对象
         * @param {string} position (可选)统计字段名，如果为空会尝试从el的position属性获取
         * @param {object} details (可选)统计的附加数据
         * @param {function} callback (可选)回调函数
         */
        pingback: function (el, position, details, callback) {
            position = position || (el && el.attr('position')) || '';
            details = details || (el && el.attr('details')) || {};
            var columnid = URL.getParam('columnid');

            if (columnid !== null && columnid !== '') {
                details.columnId = columnid;
            }
            details.ext1 = 'foxplayer_' + window.location.host;

            var videoData = window.VideoData || window.videoData || {};
            var pageData = window.pageData || {};
            var channeled = Trace.getChanneled();
            var params = {};
            try {

                if (vars.IsWeixinBrowser) {
                    // if(channeled != '1211110100' && channeled != '1211110200'){
                    if (channeled.toString().substr(0, 6) !== '121111') {
                        channeled = '1211110001';
                    }
                }
                var others = $.extend(true, {}, details);
                params = {
                    type: 'click',                                          //报数类型 impress（模块展现）、click（点击）
                    fuid: Trace.getFUid(),                                  //播放器的唯一标识
                    refer: document.referrer || (vars.PROTOCOL+'m.tv.sohu.com/'),      //上一个页面的url，没有则为空，这里, 不用在编码了，jquery.param已经做了编码,
                    vid: Trace.getVideoData('vid')|| details.vid || '',
                    sid: Trace.getUid(),                                    //suv   uid
                    playListId: videoData.plid || videoData.aid || videoData.sid || '',    //专辑id
                    catcode: Trace.getVideoData('cateCode') || Trace.getVideoData('cate_code') || '100',
                    url: window.location.href,
                    ver: '',                                                //模板版本ID
                    cid: videoData.cid || '',                               //分类ID
                    txid: position,                                         //模块唯一标识
                    other: Util.JSONStringify(others)
                };
                //这是我附件的
                //该参数是统计后台过滤防刷数据用的
                params.mcode = pageData.mCode || codec.md5(Cookie.get('MUID') + (Trace.getVideoData('vid')|| details.vid || '') + 'sohu_tv_html5');
                params.channeled = channeled;

            } catch (e) {
                
                if (typeof console !== 'undefined' && typeof console.log === 'function') {
                    console.log('trace click exception ', e);
                }
            }

            Util.pingback(vars.PROTOCOL + 'pv.hd.sohu.com/mc.gif?' + $.param(params), callback);
        }
    };

    var TraceClick = {
        pingback: function (el, position, details, callback) {
            var destination = Trace.getTraceDestination();
            if (destination === 'pc') {
                PCClickTrace.pingback(el, position, details, callback);

            } else {
                H5ClickTrace.pingback(el, position, details, callback);
            }
        },
        pingbackMall: function (el, position, details, callback) {
            H5ClickTrace.pingbackMall(el, position, details, callback);
        }
    };

    svp.TraceClick = TraceClick;//建议用
    module.exports  = TraceClick;


});