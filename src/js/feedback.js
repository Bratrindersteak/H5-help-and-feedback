/**
 *	帮助与反馈H5页面改版 吴鹏 2017-07-10
 *
 *	依赖: Sea.js Bone.js Zepto.js fox工具库 pgc工具库
 *
 *	功能:
 *
 *		1. 页面初始化加载私信列表.
 *
 *			多贴 (点击跳转);
 *			单贴 (点击跳转);
 *			文字 (完全展示不折行);
 *			图片 (点击查看大图);
 *			视频 (点击拉起客户端播放视频).
 *
 *		2. 页面上拉加载最新十条数据:
 *
 *			多贴 (点击跳转);
 *			单贴 (点击跳转);
 *			文字 (完全展示不折行);
 *			图片 (点击查看大图);
 *			视频 (点击拉起客户端播放视频).
 *
 *		3. 实时交互.
 *
 *			实时消息，过滤无关消息后展示（文字、图片）.
 *			自动回复消息（帖子、文字、图片、视频）.
 *
 *		4. 发送私信:
 *
 *			文字 (完全展示不折行);
 *			图片 (调起系统相册并显示上传进度).
 *
 *		5. 兼容旧帖子接口数据格式.
 *
 *		6. 页面统计.
 *
 *			PV.
 *			发送图片按钮点击.
 *
**/

define('feedback', function(require, exports, module) {

	// 依赖引入====================================================================================================
	var vars = require('base/vars');
    var util = require('base/util');
    var url = require('base/url');
    var action = require('base/action');
    var scroll = require('base/scroll');
	var tracePv = require('trace/pv');
	var traceClick = require('trace/click');
	var upload = require('upload');
	var tip = require('tip');
	var env = require('env');
	var message = require('message');
    var iscrollZoom = require('iscroll/iscroll-zoom');

	// 常量声明====================================================================================================
	var UA = vars.UA.toLowerCase();	// 获取浏览器信息(小写).
	var WINDOW_HEIGHT = vars.ScreenSize.split('x')[1]; // 设备可视高度.
    var URL = window.location.href; // URL.
    var URL_HOST = window.location.host; // URL host.
    var LOCATION_PROTOCOL = document.location.protocol; // URL协议.

	// 变量声明====================================================================================================
    var $feedback = $('#feedback');
    var $hotList = $('#hotList');
    var $moduleTemplate = $('#moduleTemplate');
    var $hotTemplate = $('#hotTemplate');

	// DOM声明====================================================================================================

	// 接口环境配置====================================================================================================
	var hosts = {
        apiHost: vars.API_URL
    };

    if (/my\.test\.56\.com|my\.test\.sohu\.com|127\.0\.0\.1|localhost/.test(URL_HOST) || LOCATION_PROTOCOL === 'file:') {
        hosts.apiHost = vars.PROTOCOL + 'dev.app.yule.sohu.com/';
    } else if (/t\.m\.tv\.sohu\.com|mobile\.m\.56\.com/i.test(URL_HOST)) {
        hosts.apiHost = vars.PROTOCOL + 'dev.app.yule.sohu.com/';
    }

    // 接口列表配置====================================================================================================
    var config = {
        apiUrls: {
         	feedback: hosts.apiHost + "/v6/mobile/h5/"
        },
        query: {
            api_key: vars.API_KEY,
            cursor: 0,
            page_index: 0,
            plat: 17,
            sver: '',
            parentId: 1203,
            page_size: 5
        },
        address: {
            helpList: 'helpList.json',
            helpContentList: 'helpContentList.json'
        }
    };

    var common = {
        checkDigit: function(value) { // 单个数字补零方法(用于时间日期等不足两位数时补0占位).
            if (value.toString().length === 1) {
                value = '0' + value;
            }

            return value;
        }
    };

    // models====================================================================================================
    var ModuleModel = Bone.Model.extend({ // 获取 '我的私信——详情列表' 接口数据.
        initialize: function(attr, options) {
            options = options || attr || {};

            this.url = options.apiUrls.feedback + options.address.helpList;
            this.urlData = _.pick(options.query, ['api_key', 'page_index', 'plat', 'sver']);
            this.fetch({
                success: function(model, response, options) {

                    if (response.status === 200) {
                        var listMsg = {
                            data: response.data,
                            self: response.self,
                            touser: response.touser
                        };

                        if (window.localStorage && !localStorage.getItem('feedback_module')) {
                            localStorage.setItem('feedback_module', util.JSONStringify(response.data));
                        }
                    } else {
                        tip.showTip('get mudule data fail', 1000);
                    }
                }
            });
        },
        parse: function(response, options) {
            var self = this;

            if (!response) {
                return;
            }

            if (response.status === 200) {
                self.attributes.data = response.data;
            }

            self.trigger('response', response.data);
        }
    });

    var HotModel = Bone.Model.extend({ // 获取 '我的私信——详情列表' 接口数据.
        initialize: function(attr, options) {
            options = options || attr || {};

            this.url = options.apiUrls.feedback + options.address.helpContentList;
            this.urlData = _.pick(options.query, ['api_key', 'cursor', 'page_index', 'plat', 'sver', 'parentId', 'page_size']);
            this.fetch({
                success: function(model, response, options) {

                    if (response.status === 200) {
                        var listMsg = {
                            data: response.data,
                            self: response.self,
                            touser: response.touser
                        };

                        if (window.localStorage && !localStorage.getItem('feedback_hot')) {
                            localStorage.setItem('feedback_hot', util.JSONStringify(response.data));
                        }
                    } else {
                        tip.showTip('get hot data fail', 1000);
                    }
                }
            });
        },
        parse: function(response, options) {
            var self = this;

            if (!response) {
                return;
            }

            if (response.status === 200) {
                self.attributes.data = response.data;
            }

            self.trigger('response', response.data);
        }
    });

    // views====================================================================================================
    var ModuleView = Bone.View.extend({ // 反馈模块视图.
        el: $feedback,
        events: {
            'touchstart .module-list li': 'touchstart',
            'touchend .module-list li': 'touchend'
        },
        template: Handlebars.compile($moduleTemplate.html()),
        initialize: function() {
            this.listenTo(this.model, 'response', this.render);
        },
        render: function(data) {
            var template = this.getTemplate();
            var html = Bone.Renderer.render(template, data);

            this.$el.prepend(html);
        },
        touchstart: function(event) {
            $(event.currentTarget).addClass('touch');
        },
        touchend: function(event) {
            $(event.currentTarget).removeClass('touch');
        }
    });

    var HotView = Bone.View.extend({ // 热点问题视图.
        template: Handlebars.compile($hotTemplate.html()),
        initialize: function() {
            this.listenTo(this.model, 'response', this.render);
        },
        render: function(data) {
            var template = this.getTemplate();
            var html = Bone.Renderer.render(template, data);

            $('body').append(html);
        }
    });

	var FeedbackView = Bone.View.extend({ // 反馈视图.
        events: {
            'touchstart .module-list li': 'touchstart',
            'touchend .module-list li': 'touchend'
        },
        initialize: function() {
            this.listenTo(this.model, 'response', this.render);
            this.scrollList();

            if (window.localStorage && localStorage.getItem('primsg-to_uid:' + TO_UID)) {
                var data = util.JSONParse(localStorage.getItem('primsg-to_uid:' + TO_UID));

                this.render(data);
                page = 2;

                return;
            }

            this.model.urlData.page = page;
            this.model.fetch({
                success: function(model, response, options) {

                    if (response.status === 200 && response.data.length === SIZE) {
                        page = page + 1;

                        var listMsg = {
                            data: response.data,
                            self: response.self,
                            touser: response.touser
                        };

                        if (window.localStorage && !localStorage.getItem('primsg-to_uid:' + response.touser.toUid)) {
                            localStorage.setItem('primsg-to_uid:' + response.touser.toUid, util.JSONStringify(listMsg));
                        }
                    } else {
                        haveMoreData = false;
                    }
                }
            });
        },
        render: function(data) {
		    var self = this;

            self.listTemplateView = new ListTemplateView({
                model: data
            });
            self.$el.prepend(self.listTemplateView.render());
            self.checkPic(data.data);

            if (isFirstLoad) {
                self.firstLoad();

                if (self.$el.find('.picture')) {
                    var number = self.$el.find('.picture').length;
                    var timeTimer = setTimeout(function() {
                        self.$el.removeClass('list-loading');
                        isFirstLoad = false;
                    }, number * TIME_DELAY);

                    return;
                }

                self.$el.removeClass('list-loading');
                isFirstLoad = false;

                return;
            }

            self.onceAgainLoad(data.data);
            self.loadingFinish();
        },
        touchstart: function(event) {
            $(event.currentTarget).addClass('touch');
        },
        touchend: function(event) {
            $(event.currentTarget).removeClass('touch');
        }
    });

    // presents====================================================================================================
    var Presents = Bone.Object.extend({
        initialize: function (config) {
            this.moduleModel = new ModuleModel(config);
            this.moduleView = new ModuleView({
                model: this.moduleModel
            });

            this.hotModel = new HotModel(config);
            this.hotView = new HotView({
                model: this.hotModel
            });

            this.feedbackView = new FeedbackView();

            // alert( util.JSONStringify(window.localStorage) );
            // alert( util.JSONStringify(window.sessionStorage) );
            // window.localStorage.removeItem('primsg-to_uid:297839464');
        }
    });

// application====================================================================================================
    var WebApp = Bone.Application.extend({
        initialize: function(options) {
            this.render(options); // 页面初始化获取客户端提供的用户信息.
            this.sendPV(); // 发送PV统计.
        },
        render: function(options) {
            $.extend(config, options || {});
            this.presents = new Presents(config);
        },
        sendPV: function() {
            tracePv.pv();
        }
    });

	// exports====================================================================================================
    module.exports = {
        init: function (params) {
            var app = new WebApp(params);
            app.start(params);
        }
    };

    // helper====================================================================================================
    Handlebars.registerHelper('hotTitle', function (value) { // 判断私信发送方.
        return value[0].name;
    });

    Handlebars.registerHelper('moreHotUrl', function (value) { // 判断私信发送方.
        return value[0].action_url;
    });

    Handlebars.registerHelper('sender', function (value) { // 判断私信发送方.
    	var sender = '';

        if (value != url.getParam('otherUid')) {
            sender = ' mein';
        }

        return sender;
    });

    Handlebars.registerHelper('messageType', function (value) { // 判断私信消息类型.
    	var messageType;

        if (value == 1) {
            messageType = 'topic';
        } else if (value == 2) {
            messageType = 'text clear';
		} else if (value == 3) {
            messageType = 'picture clear';
        } else if (value == 4) {
            messageType = 'video clear';
        } else if (value == 5) {
            messageType = 'topic';
        }

        return messageType;
    });

    Handlebars.registerHelper('senderMessageType', function (value) { // 判断发送私信消息类型.
        var senderMessageType;

        if (/^<img/.test(value)) {
            senderMessageType = 'picture clear';
        } else {
            senderMessageType = 'text clear';
        }

        return senderMessageType;
    });

    Handlebars.registerHelper('hasPortrait', function (value, options) { // 私信头像展示.

    	if (value != 1 && value != 5) {
            return options.fn(this);
		}
    });

    Handlebars.registerHelper('messageContent', function (value) { // 私信消息内容.
        var messageContent = '';
        var contentType = value.contentType;
        var content = util.JSONParse(value.content);

        if (contentType == 1) {
            messageContent += '<a href="' + content.topic_url_h5 + '" class="link"><h6 class="title">' + content.title + '</h6>';

            if (content.coverUrl) {
                messageContent += '<div class="image"><img src="' + content.coverUrl + '" width="100%"></div>';
			}

            messageContent += '</a>';
        } else if (contentType == 2) {
            messageContent += '<div class="content"><p class="info">' + value.content.replace(/&lt;/g, '<').replace(/&gt;/g, '>') + '</p></div>';
        } else if (contentType == 3) {
            messageContent += '<div class="content"><div class="image">' + value.content + '</div></div>';
        } else if (contentType == 4) {
            messageContent += '<div class="content" data-url="' + content.video_url_h5 + '" data-cid="' + content.cid + '" data-vid="' + content.vid + '" data-cateCode="' + content.cate_code + '"><div class="info clear"><h6 class="title">' + content.video_name + '</h6>';

            if (content.cover) {
                messageContent += '<div class="thumbnail image"><img src="' + content.cover + '" width="100%" /></div>';
			}

            messageContent += '</div></div>';
        } else if (contentType == 5) {
            messageContent = '<a href="' + content[0].urlh5 + ( content[0].type == 1 ? '&star_name=' + nickname : '' ) + '" class="link">'
                + '<h6 class="title">' + ( content[0].type == 1 ? '#' + content[0].title + '#' : content[0].title ) + '</h6>'
            	+ '<div class="image"><img src="' + content[0].cover + '" width="100%"></div></a>';

            if (content.length > 1) {
            	var i;

                messageContent += '<ul class="multi-topic">';

                for (i = 1; i < content.length; i += 1) {
                    messageContent += '<li class="clean">'
                        + '<a href="' + content[i].urlh5 + ( content[i].type == 1 ? '&star_name=' + nickname : '' ) + '">'
                        + '<h6 class="title"><span class="span">' + ( content[i].type == 1 ? '#' + content[i].title + '#' : content[i].title ) + '</span></h6>'
                        + ( content[i].cover ? '<div class="image"><img src="' + content[i].cover + '" width="100%"></div>' : '' )
                        + '</a>'
                        + '</li>';
				}
                messageContent += '</ul>';
			}
        }
        return messageContent;
    });

    Handlebars.registerHelper('sendMessageContent', function (value) { // 发送私信消息内容.
        var senderMessageContent = '';

        if (/^<img/.test(value)) {
            senderMessageContent += '<div class="content"><div class="image">' + value + '</div></div>';
        } else {
            senderMessageContent += '<div class="content"><p class="info">' + value + '</p></div>';
        }
        return senderMessageContent;
    });

	Handlebars.registerHelper('day', function (value) { // date日期换算.
		var date = new Date(value);
		return date.getFullYear() + '-' + common.checkDigit(date.getMonth() + 1) + '-' + common.checkDigit(date.getDate());
	});

	Handlebars.registerHelper('time', function (value) { // time时间换算.
		var date = new Date(value);
		return common.checkDigit(date.getHours()) + ':' + common.checkDigit(date.getMinutes());
	});
});