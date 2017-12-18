/**
 *   @description: trace.rate
 *   @version    : 1.0.3
 *   @update-log :
 *      1.0.1 - 20150205 周国庆 视频速度测试脚本
 *      1.0.2 - 20150611 周国庆 将api_key来自于vars 
 *      废弃20150611
 */

define('trace/rate',function(require, exports, module) {
    'use strict';
    var $ = svp.$ || window.Zepto;
    var global = window;
    
    var Cookie = require('base/cookie'),
        Util = require('base/util'),
        vars = require('base/vars'),
        URL = require('base/url');

    /**
     * @module trace.rate
     * @namespace Trace
     * @property {string}   mode                测试触发方式 用户触发: man 自动触发: auto
     * @property {string}   apiURL              api地址
     * @property {string}   hotURL              热点地址
     * @property {Array}    disURLQueue         m3u8文件中的调度文件加载队列，一个个加载
     * @property {number}   videoTsCount        ts文件片段的总数
     * @property {object}   urlTimeoutTimers    判断超时的Timer
     * @property {object}   urlTimeoutURLs      已经超时的URL放在这里面
     * @property {number}   id                  测速的URL唯一标识
     * @property {*|{}}     videoData           video数据对象
     * @property {function} init                初始化
     */
    var RateTest = {

        /* 测试触发方式 用户触发: man 自动触发: auto */
        mode: 'man',

        apiURL: '',
        hotURL: '',

        /* m3u8文件中的调度文件加载队列，一个个加载 */
        disURLQueue:[],

        /* ts文件片段的总数 */
        videoTsCount: 0,

        /* 判断超时的Timer */
        urlTimeoutTimers:{},

        /* 已经超时的URL放在这里面 */
        urlTimeoutURLs:{},

        /* 测速的URL唯一标识 */
        id: 0,

        videoData : window['VideoData'] || window['videoData'] || {},
        /**
         * @memberof Trace
         * @summary 获取本地数据
         * @type {function}
         */
        init: function() {

            if (typeof player !== 'undefined' && player.videoData) {
                this.videoData = player.videoData;
            }

            if (null !== URL.getQueryString('r') && this.videoData) {
                $('.main_container').prepend('<div class="rate_test"><span class="button">速度测试</span><span class="tip">UID: ' +(Cookie.get('SUV') || '-') +'</span><div></div></div>');
                $('.rate_test .button').on('click', function() {
                    var el = $(this),
                        cls = 'disabled';
                    if (el.hasClass(cls)) {
                        return;
                    }
                    el.addClass(cls);
                    RateTest.startTest('man');
                });
            }
        },

        startTest: function(mode) {
            RateTest.mode = mode;
            $('.rate_test div').html('');

            if (window['VideoData']) {
                this.videoData = window['VideoData'];

            } else if (player && player.videoData) {
                this.videoData = player.videoData;

            } else {
                this.videoData = {};
            }
            window['callback_test'] = function(){

            };
            //OpenAPI
            RateTest.addTitle('OpenAPI');
            RateTest.apiURL = vars.PROTOCOL + 'api.tv.sohu.com/video/playinfo/' + this.videoData['vid'] + '.json?api_key=' + vars.API_KEY + '&plat=6&sver=2.8&partner=999&c=1&sid=0&&callback=callback_test';
            RateTest.addURLItem(RateTest.apiURL);

            //Hot VRS
            var id = RateTest.id++,
                hotURLs,
                hotURL,
                startTime = new Date,
                i = 0;

            try {
                var m3u8Arr = this.videoData['urls']['m3u8'];
                hotURLs = m3u8Arr.hig || m3u8Arr.nor || m3u8Arr.sup || [];

            } catch (e) {
                hotURLs = [];
            }

            var l = hotURLs.length;

            for (; i < l; i++) {
                if (hotURLs[i]) {
                    hotURL = hotURLs[i];
                    break;
                }
            }

            if (!hotURL) {
                return;
            }
            RateTest.hotURL = hotURL;

            RateTest.addTitle('Hot VRS');

            $('.rate_test div').append(RateTest.getItemHTML(id, hotURL));

            if (hotURL.match(/\.m3u8/i)) {
                hotURL = hotURL.replace(/http:\/\/[^\/]+/i, '/hot_vrs');
            }

            $.ajax({
                url:hotURL,
                type:'get',
                dataType: 'text',
                success: function(contents) {
                    // var contents = ajaxObj.responseText;
                    if (!!contents) {
                        // var contents=JSON.stringify(ajaxObj['data']);
                        var urls = contents.match(/(http:\/\/[^\s]+)/ig) || [];

                        var i = 0,
                            l = urls.length,
                            url,
                            callbackName;

                        RateTest.videoTsCount = l;

                        if (l > 0) {
                            RateTest.URLLoaded(id, startTime, RateTest.hotURL);

                            RateTest.addTitle('m3u8 (' + l +')', 'rate_test_video');

                            for (i = 0, l = urls.length; i < l; i++) {
                                callbackName = 'm3u8callback_' + i;

                                // url = urls[i].replace(/http:\/\/[^\/]+/i, 'http://61.135.183.62') + '&prot=2&callback=' + callbackName + '&id=' + (RateTest.id++);
                                url = urls[i].replace(/http:\/\/[^\/]+/i, vars.PROTOCOL + 'data.vod.itc.cn') + '&prot=2&callback=' + callbackName + '&id=' + (RateTest.id++);

                                //调度URL加载完成后的回调
                                window[callbackName] = function(data) {
                                    var videoUrl = data['url'],
                                        url = this['url'],
                                        itemId = (url.match(/&id=([0-9]+)/i) || [])[1];

                                    if (videoUrl) {
                                        /*
                                         * 3. 一个调度URL加载完成后，获取返回的ts文件URL，
                                         * 在ts文件加载完成的回调中获请求下一个调度URL（从RateTest.disURLQueue中获取下一个调度URL）
                                         */
                                        var videoStartTime = new Date,
                                            id = RateTest.addURLItem(videoUrl, itemId, RateTest.requestNextDisURL);

                                        /* 记录一个超时指针 */
                                        RateTest.urlTimeoutTimers[videoUrl] = setTimeout(function() {
                                            RateTest.URLLoaded(id, videoStartTime, videoUrl, itemId, null, true);
                                            RateTest.requestNextDisURL();
                                        }, 30000);
                                    }
                                }.bind({'url':url});

                                /* 1. 把调度URL放入队列数组 */
                                RateTest.disURLQueue.push(url);
                            }

                            /* 2. 开始请求第一个调度URL */
                            RateTest.addURLItem(RateTest.disURLQueue.shift());
                        } else {
                            var elItem = $('.rate_test .item_' + id).addClass('error');
                            $('time', elItem).html('!');
                        }

                    }
                }
            });
        },

        requestNextDisURL: function() {
            var nextDisURL = RateTest.disURLQueue.shift(),
                titleId = '#rate_test_video',
                loadedCount = $('.rate_test .item .loaded').length;
            if (nextDisURL) {
                RateTest.addURLItem(nextDisURL, null, null, titleId);
            }
            $(titleId).html('m3u8 (' + loadedCount + '/' + RateTest.videoTsCount +')');
            if (loadedCount == RateTest.videoTsCount) {
                $('.rate_test .button').removeClass('disabled');
            }
        },

        /* 添加测试URL行 */
        addURLItem: function(url, parentId, callbackFn, afterTitleId) {
            var id = (url.match(/&id=([0-9]+)/i) || [])[1];
            if (!id) {
                id = RateTest.id++;
            }
            if (parentId) {
                $('.rate_test .item_' + parentId).append(RateTest.getItemHTML(id, url, parentId));
            } else {
                if (afterTitleId) {
                    $(afterTitleId).after(RateTest.getItemHTML(id, url));
                } else {
                    $('.rate_test div').append(RateTest.getItemHTML(id, url));
                }
            }

            Util.loadScript(url, RateTest.URLLoaded, [id, (new Date), url, parentId, callbackFn]);
            return id;
        },

        /* 获取URL行的HTML */
        getItemHTML: function(id, url) {
            return '<p class="item item_' + id + '"><time>...</time><span>' + url + '</span></p>';
        },

        /*
         * 某个URL加载完成后，更新显示这个URL加载所耗时间
         * 此方法在RateTest.addURLItem()内部调用
         */
        URLLoaded: function(id, startTime, url, parentId, callbackFn, isTimeout) {
            var timer = RateTest.urlTimeoutTimers[url];
            if (timer) {
                clearTimeout(timer);
                delete RateTest.urlTimeoutTimers[url];
            }

            /* 已经定为超时的URL，不再发送成功的统计 */
            if (url in RateTest.urlTimeoutURLs) {
                return;
            }

            /* 已经定为超时的URL */
            if (isTimeout) {
                RateTest.urlTimeoutURLs[url] = 1;
            }

            var elItem = $('.rate_test .item_' + id).addClass(isTimeout ? 'error' : 'loaded'),
                hotVRS = '',
                clientIP = '',
                CDNIP = '',
                time = (((new Date) - startTime) / 1000).toFixed(2);

            $('time', elItem).eq(0).html(isTimeout ? '!' : time + ' s');

            if (parentId) {
                hotVRS = $('.rate_test .item_' + parentId + ' span').html().replace(/&amp;/g, '&');
            }
            if (clientIP = url.match(/cip=([0-9\.]+)/i)) {
                clientIP = clientIP[1];
                CDNIP = url.match(/http:\/\/([^\/]+)/i)[1];
            }

            var url = [vars.PROTOCOL + 'sptjs1.hd.sohu.com.cn/h5/tttst.html',
                '?mode=', RateTest.mode,
                '&uid=', Cookie.get('SUV') || '',
                '&api=', encodeURIComponent(RateTest.apiURL),
                '&hotvrs=', encodeURIComponent(RateTest.hotURL),
                '&disp=', encodeURIComponent(hotVRS),
                '&url=', encodeURIComponent(url),
                '&clientip=', clientIP,
                '&cdnip=', CDNIP,
                '&speed=', time,
                (isTimeout ? '&timeout' : '')].join('');

            Util.pingback(url);

            /* 执行回调 */
            callbackFn && callbackFn();
        },

        /* 添加测试标题行 */
        addTitle: function(title, id) {
            $('.rate_test div').append('<p class="title" id="' + id +'">' + title + '</p>');
        }
    };


    svp.TraceRate = RateTest;
    module.exports  = RateTest;


});