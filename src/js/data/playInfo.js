/**
 * @description : 该文件用视频videoData
 *
 */ 
define('data/playInfo', function (require, exports, module) {
    'use strict';
    var $ = svp.$;
    var vars = require('base/vars');
    var URL = require('base/url');
    var Cookie = require('base/cookie');
    var Util = require('base/util');
    var sugarUrl = vars.PROTOCOL+'m.tv.sohu.com/svp/mysugar';
    var sugarDebugUrl =vars.PROTOCOL + 't1.m.tv.sohu.com/svp/mysugar';

    var getSugar = function (param, callback) {
        var getDomain = function () {
            var domain = param.domain || document.domain;
            if (domain.indexOf('.com') > -1) {
                try {
                    var arr = domain.split('.');
                    var len = arr.length;
                    domain = '.' + arr[len - 2] + '.' + arr[len - 1];
                } catch (e) {
                    domain = document.domain;
                }
            }
            return domain;
        };
        var param = $.extend({
            domain: getDomain(),
            vid: param.vid || window['videoData']['vid'] || window['videoData']['liveId'] || '',
            uid: param.uid || Cookie.get('SUV'),
            pt: param.pt || Util.getUserPt(),
            plat: '17',
            prod: 'h5',
            appid: param.appid || data.appid || 'tv'
        });
        //appid:prod=> tv:h5,news:news,msohu:msohu,dbdata:dbdata

        Cookie.del('SOHUSVP'); //remove old
        var url = param.appid === 'test' ? sugarDebugUrl : sugarUrl;
        param.t = new Date().getTime();
        callback = typeof callback === 'function' ? callback : function () {
        };
        var rst = {
            code: '401',
            sohuSVP: ''
        };
        $.ajax({
            data: param,
            url: url,
            type: 'get',
            dataType: 'jsonp',
            cache: false,
            success: function (cbData) {
                if (typeof cbData !== 'undefined' && cbData.status === 200) {
                    rst.code = '200';
                    rst.msg = '';
                    if (!$.isUndefined(cbData['SOHUSVP'])) {
                        Cookie.set('SOHUSVP', cbData['SOHUSVP']);
                    }
                    rst.sohuSVP = Cookie.get('SOHUSVP') || cbData['SOHUSVP'] || '';
                }
                console.log(rst);
                callback && callback(rst);
            },
            error: function () {
                console.log(rst);
                callback && callback(rst);
            }
        });
    };

    var getPlayInfo = function (opts, callback) {
        callback = typeof callback === 'function' ? callback : function () {
        };
        var channelSrc = URL.getParam('src') || URL.getParam('SRC') || Cookie.get('MTV_SRC') || '0';
        var channelNum = URL.getParam('num') || '680';
        channelSrc = channelSrc.replace('|', '').replace('%7C', '');
        if ((channelSrc + '').length > 4) {
            channelSrc = channelSrc.substr(0, 4);
        }
        var param = $.extend({}, opts);
        param.vid = opts.vid || '';
        param.site = param.site || '';
        param.site = param.site == 2 ? 2 : 1;
        param.cateCode = param.cateCode.substr(0, 3);
        param.uid = Cookie.get('SUV') || '';
        param.muid = Cookie.get('MUID') || '';
        param._c = Cookie.isEnabled ? 1 : 0;
        param.pt = Util.getUserPt() || '5';
        param.qd = channelNum || '680';
        param.src = channelSrc || '11050001';
        param.SOHUSVP = Cookie.get('SOHUSVP');
        param.aid = opts.aid || '';
        param.plat = '17';
        param.prod = 'h5';
        param.appid = opts.appid || 'tv';  //tv  msohu  news
        var url = vars.PROTOCOL+ 'm.tv.sohu.com/phone_playinfo?plat=17&sver=1.0&partner=78&api_key=' + vars.API_KEY
            + "&" + $.param(param);
        var rtData = {
            vid: '',
            durations: '',
            urls: ''
        };
        $.ajax({
            data: {t: new Date().getTime()},
            url: url,
            dataType: 'jsonp',
            success: function (rt) {
                if (rt && rt.data && rt.status == 200) {
                    rtData = rt.data;
                }
                callback && callback(rt.data);
            }, error: function () {
                callback && callback(rtData);
            }
        });
    };

    var getChlInfo = function (param, callback) {
        var _this = this;
        var channelSrc = param.src || URL.getParam('src') || URL.getParam('SRC') || Cookie.get('MTV_SRC') || '0';
        callback = (typeof callback === 'function') ? callback : function () {
        };
        if ((channelSrc + '').length > 4) {
            channelSrc = channelSrc.substr(0, 4);
        }
        channelSrc = parseInt(channelSrc, 10);
        var ajaxUrl = vars.PROTOCOL + 'm.tv.sohu.com/h5/cooperation/' + channelSrc + '.json?pos=1&platform=' + Util.getUserPt() + '&callback=?';
        typeof console !== 'undefined' && typeof console.log === 'function' && console.log('获取下载链接ajax:', ajaxUrl);
        var date = new Date();
        var cbData = {};
        $.ajax({
            data: {t: date.getTime()},
            url: ajaxUrl,
            type: 'get',
            dataType: 'jsonp',
            cache: true,
            success: function (data) {
                if (typeof data !== 'undefined' && data.records && data.records.length > 0) {
                  cbData = data.records[0];
                }
                callback(cbData);
            },
            error: function () {
                //返回默认参数
                callback(cbData);
            }
        });

    };


    svp.getSugar = getSugar;
    svp.getPlayInfo = getPlayInfo;
    svp.getChlInfo =getChlInfo;

    module.exports = {
        getSugar: getSugar,
        getPlayInfo: getPlayInfo,
        getChlInfo:getChlInfo
    }
});