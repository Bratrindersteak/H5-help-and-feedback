/**
 *   @description: h5防盗链
 *   @version    : 1.0.2
 *   @update-log :
 *      1.0.1 - 20150626 周国庆 h5防盗链业务
 *      1.0.2 - 2016-11-03 王宏光 fix https
 *
 */

define('trace/sugar',function(require, exports, module) {
    var $=svp.$,
        global = window,
        vars = require('base/vars'),
        Util = require('base/util'),
        URL = require('base/url'),
        Trace = require('trace'),
        Cookie = require('base/cookie'),
        pp = require('base/passport');

    var TraceSugar = {
        pv: function(more) {
            var params = {};
            more = more || {};
            var videoData = window.VideoData || window.videoData || {};
            var channeled =  Trace.getChanneled() ;
            if (more && 'undefined' !== typeof more['channeled']) {
                channeled = more['channeled'];
            } 
            var vid = videoData['vid'] || '';
            var _href = location.href || vars.PROTOCOL + 'm.tv.sohu.com/';
            var plid = videoData['plid'] || videoData['aid'] || videoData['sid'] || '';

            try {
                params = {
                    'url': encodeURIComponent(_href),
                    'refer': encodeURIComponent(document.referrer || vars.PROTOCOL + 'm.tv.sohu.com/'),
                    'uid': Trace.getUid(),
                    'webtype': Trace.getConnectionType(),
                    'screen': Trace.getScreenSize(),
                    'catecode': Trace.getVideoData('cateCode') || Trace.getVideoData('cate_code') || '',
                    'pid': plid,
                    'vid': Trace.getVideoData('vid') || '',
                    'os': Trace.getOS(),
                    'platform': Trace.getPlatform(),
                    'passport': Trace.getPassport(),
                    'pt': Util.getUserPt(),
                    't': +new Date(),
                    'channeled': channeled,
                    'MTV_SRC': encodeURIComponent(Trace.getChannelSrc())
                };

            } catch (e) {
                typeof console !== 'undefined' && typeof console.log === 'function' && console.log('trace sugar pv exception ', e);
            }

            if (vars.ENABLE_DEBUG) {
                typeof console !== 'undefined' && typeof console.log === 'function' && console.log('trace sugar pv ', params);
            }
            Util.pingback(vars.PROTOCOL + 'z2.m.tv.sohu.com/pv.gif?' + $.param(params));
        }
    };

    svp.TraceSugar  = TraceSugar;
    module.exports  = TraceSugar;
});