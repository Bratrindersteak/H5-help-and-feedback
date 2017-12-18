svp.define(function(require, exports, module) {
    var conf = require('public').conf;
    var getRemoteData = require('public').getRemoteData;
    var vars = require('base/vars');
    var URL = require("base/url");
    var Cookie = require("base/cookie");
    var ClickTrace = require('trace/click');
    var uid = URL.getQueryString('uid') || Cookie.get('SUV') || '';
    var PROTOCOL = ('https:' === document.location.protocol) ? 'https://' : 'http://';
    var _fillZero = function(num) {
        return num < 10 ? '0' + num : num;
    }
    
    var _getTime = function() {
        var now = new Date();
        return now.getFullYear() + _fillZero(now.getMonth() + 1) + _fillZero(now.getDate()) + _fillZero(now.getHours()) + _fillZero(now.getMinutes()) + _fillZero(now.getSeconds());
    }
    var index = {
        replaceHttps: function (url) {
            if(url) {
                url = $.trim(url);
                url = url.replace(/^http(s)*:\/\//i, PROTOCOL);
                url = url.replace(/^\/\//i, PROTOCOL);
            }
            return url;
        },
        getData: function() {
            var _this = this;
            getRemoteData(conf.root1 + _this.partner + '&page_index=0&plat=' + conf.plat + '&sver=' + conf.clientVer + '&callback=?', function(data) {
                if (!data) return;
                if (data.length) {
                    _this.getHotQuesData(data[0].id);
                    data.splice(0, 1);
                    _this.createSortBtnsDom(data);
                } else {
                    _this.showEmptyTip();
                }
            });
        },
        getHotQuesData: function(parentId) {
            var _this = this;
            getRemoteData(conf.root2 + _this.partner + '&cursor=0&page_index=0&plat=' + conf.plat + '&sver=' + conf.clientVer + '&parentId=' + parentId + '&page_size=5&callback=?', function(data, hasNext) {
                if (!data) return;
                if (data.length) {
                    _this.createHotQuesDom(data, parentId);
                } else {
                    _this.showEmptyTip();
                }
                $('#hot_more_link').attr('href', './feedback/list.html?id=' + parentId + '&sver=' + conf.clientVer + '&plat=' + conf.plat);
                if (hasNext) {
                    $('#hot_more_link').show();
                    $('#hot_more_link').on('click', function() {
                        var el = $(this);
                        ClickTrace.pingback(el);
                        setTimeout(function() {
                            location.href = el.attr('href');
                        }, 100);
                        return false;
                    });
                }
            });
        },
        showEmptyTip: function() {
            $('.empty').show();
        },
        createHotQuesDom: function(data, parentId) {
            var str = '';
            $.each(data, function(i, item) {
                str += '<li class="content_item">' +
                    '<a class="link" position="help_hot_ques" href="./feedback/detail.html?id=' + item.id + '&sver=' + conf.clientVer + '&parentId=' + parentId + '&plat=' + conf.plat + '"><div class="content">' + (item.name || '') + '</div><div class="arrow"></div></a>' +
                    '</li>';
            });
            $('#hot_ques_list').append(str);
            $('#hot_ques_list a').on('click', function() {
                var el = $(this);
                ClickTrace.pingback(el);
                setTimeout(function() {
                    location.href = el.attr('href');
                }, 100);
                return false;
            });
        },
        createSortBtnsDom: function(data) {
            var str = '';
            $.each(data, function(i, item) {
                var actionUrl = item.action_url || './feedback/list.html?id=' + item.id + '&sver=' + conf.clientVer + '&plat=' + conf.plat+'&clientVer=' + conf.clientVer;
                str += '<li class="content_item">' +
                    '<a class="link" position="help_sort" href="' + actionUrl + '">' +
                    '<div class="photo" style="background-image: url(' + index.replaceHttps(item.icon) + ')"></div>' +
                    '<div class="desc">' + item.name + '</div>' +
                    '</a>' +
                    '</li>';
            });
            $('#help_list').append(str);
            $('#help_list a').on('click',function(){
                var el = $(this);
                ClickTrace.pingback(el);
                setTimeout(function() {
                    location.href = el.attr('href');
                }, 100);
                return false;
            });
        },
        reportBtn: function() {
            $('#btn_report').on('click', function() {
                ClickTrace.pingback($(this));
                
                if (vars.IsSohuVideoClient) {
                    window.location.href = './feedback/im.html';
                    return;
                }
                
                // setTimeout(function() {
                    // var suburl= './feedback/submit.html' + location.search + (location.search.indexOf('?') == -1 ? '?' : '&') + 'plat=' + conf.plat +'&clientVer=' + conf.clientVer;
                    // location.href =suburl;
                

                    window.location.href = './feedback/submit.html' + location.search + (location.search.indexOf('?') == -1 ? '?' : '&') + 'plat=' + conf.plat +'&clientVer=' + conf.clientVer;
                // }, 100);
                return false;
            });
        },
        showUid: function() {
            $('#qrCode').attr('src', PROTOCOL+'h5.tv.sohu.com/h5/mobile/qrCode?keycode=http://eye.hd.sohu.com/importUser.do?uid=' + uid + '&time=' + _getTime() + '&username=');
            $('#showUid span').text(uid);
            $('#showUid')[0].style.display = 'block';
        },
        closeUid: function() {
            $('.close_uid_btn').on('click', function() {
                $('#showUid')[0].style.display = 'none';
            });
        },
        init: function() {
            var self = this;
            
            self.partner = ''; // 识别IPC项目所加参数.
            
            if (navigator.onLine != undefined && !navigator.onLine) {
                alert('请检查网络连接！');
            }

            // 为IPC项目添加partner参数.
            if (/SohuIPC/.test(vars.UA) && vars.IsIOS) {
                self.partner = '&partner=971&poid=35'
            } else if (/SohuIPC/.test(vars.UA) && vars.IsAndroid) {
                self.partner = '&partner=981&poid=35'
            } else if(/isJuka/.test(location.href)) {
                self.partner = '&poid=38'
            }
            
            this.getData();
            this.reportBtn();
            this.closeUid();
            
            ClickTrace.pingback(null, "help_feedback_pv");
            
            $('#hotQuesTit').on('doubleTap', this.showUid);
            
            window.initSohuVideoPage = function(cData) {
                if (!cData) return;
                cData = JSON.parse(cData);
                uid = cData.uid;
            };
        }
    }
    index.init();
});