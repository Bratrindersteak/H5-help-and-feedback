import URL from './url';
import { default as vars } from './vars';
import { default as cookie } from './cookie';
import { default as util } from './util';
import { Console } from './console';
import { default as download } from '../data/appDownload';

/**
 * @module base.action
 * @example
 *   var Action = require('base.action');
 *   //获取拉起客户端全屏播放参数
 *   var param = Action.parserAttributes();
 *   param.action = '1.1';
 *   param.type = 'click';
 *   //尝试拉起客户端
 *   Action.sendAction(param);
 */
var Action = {
    client:{
        protocol:'sohuvideo' + (vars.IsIpad ? 'hd' : ''),
        IsSohuVideo:false,
        IsSohuNews:false,
        IsFiveSixVideo:false,
        name:'SohuVideoMobile',
        plt:util.getUserPt()||'5',
        ver:'6.0'
    },
    protocol:function(){
        var self = this;
        var ua = navigator.userAgent;
        var cli =  self.client;
        function findVal(mt,cli) {
            try {
                if (mt.length >= 3) {
                    cli.name = mt[1];
                    cli.ver  = mt[2].match(/(\d+\.\d+)/)[1];
                }
            }catch (e){  }
            return cli;
        }
        if(/SohuVideo/i.test(ua)){
            cli.IsSohuVideo = true;
            cli.protocol= 'sohuvideo' + (vars.IsIpad ? 'hd' : '');
            if(/SohuVideoPad/i.test(ua)){
                var mt = ua.match(/(SohuVideoPad)\/([\d.]+)/i);
                cli=findVal(mt,cli);
            }else{
                var mt = ua.match(/(SohuVideoMobile)\/([\d.]+)/i);
                cli=findVal(mt,cli);
            }

        }else if(/FiveSixVideo/i.test(ua)){
            cli.IsFiveSixVideo = true;
            cli.protocol= 'fivesixapp' + (vars.IsIpad ? '' : '');
            var mt = ua.match(/(FiveSixVideo\S+)\/([\d.]+)/i);
            cli=findVal(mt,cli);

        }else if(/SohuNews/i.test(ua) && !/TVMiniSDK/i.test(ua)){
            cli.IsSohuNews = true;
            if(vars.IsIOS){
                cli.protocol = 'sohunewsvideosdk' + (vars.IsIpad ? '' : '');
            }else if(vars.IsAndroid){
                cli.protocol = 'svanewstabsdk';
            }
            var mt = ua.match(/(sohunews\S+)\/([\d.]+)/i);
            cli=findVal(mt,cli);
        }
        return cli;
    },
    /**
     * @memberof Action
     * @summary 通过UA区分协议,过时
     * @type {string}
     */
    URLProtocol: 'sohuvideo' + (vars.IsIpad ? 'hd' : '') ,
    /**
     * @memberof Action
     * @summary 延迟时间
     * @type {number}
     */
    openTime: vars.IsIOS ? 800 : 1000,
    /**
     * @memberof Action
     * @summary h5 channel
     * @type {number}
     */
    appChanneled: 1000120001,
    /**
     * @memberof Action
     * @summary 本地存储app信息有效时间
     * @type {number}
     */
    maxEffectiveTime: 1000 * 60 * 60 * 2,
    /**
     * @memberof Action
     * @summary appinfo请求端口列表
     * @type {string[]}
     */
    appPortArr: ['23456', '23457'],
    /**
     * @memberof Action
     * @summary 请求本地app信息次数
     * @type {number}
     */
    appInfoReqCounts: 0,
    /**
     * @memberof Action
     * @summary 全局变量参数
     * @type {object}
     */
    URLGlobalParams: {},

    /**
     * @memberof Action
     * @summary ios唤起客户端
     * 不同的浏览器app（包括webview），都有自己在后台的常驻时间, 在uc、chrome中，不会触发pagehide和pageshow的方法，而在safari中可以的。
     * 使用iframe调用schema URL, 使用定时器判断在一段时间内是否调起成功, 使用pageshow和pagehide来辅助定时器做更详细的判断
     * @type {function}
     * @param {string} url 唤起地址
     * @param {function} callback 回调函数
     */
    openIos: function (url, callback) {
        if (vars.IsSohuVideoClient ) {
            //客户端内
            setTimeout(function () {
                window.location.href = url;
            }, 200);

            setTimeout(function () {
                callback && callback();
            }, 260);

        } else {
            var osVer = util.getOSVersion();

           if(vars.IsIOS && osVer>9.2 && url.indexOf('sohuvideo')>-1 ){
               //通用协议拉起app
               setTimeout(function () {
                    window.location.href = 'https://s1.h5.itc.cn/app/index.html?download=1&action='+url;
               }, 200);
               setTimeout(function () {
                   callback && callback();
               }, 260);

            }else {

               //web浏览器,iframe发送拉起客户端请求
               var node = document.createElement('iframe');
               node.style.display = 'none';
               var body = document.body;
               var timer;
               var clear = function (evt, isTimeout) {
                   if (callback && typeof callback === 'function') {
                       callback(isTimeout);
                   }
                   window.removeEventListener('pagehide', hide, true);
                   window.removeEventListener('pageshow', hide, true);
                   if (!node) {
                       return;
                   }
                   node.onload = null;
                   body.removeChild(node);
                   node = null;
               };

               var hide = function (e) {
                   clearTimeout(timer);
                   clear(e, false);
               };
               //ios平台特有事件
               window.addEventListener('pagehide', hide, true);
               window.addEventListener('pageshow', hide, true);
               node.onload = clear;
               node.src = url;
               body.appendChild(node);
               var now = +new Date();
               //如果事件失败，则1秒设置为空
               timer = setTimeout(function () {
                   timer = setTimeout(function () {
                       var newTime = +new Date();

                       if (now - newTime > 1300) {
                           clear(null, false);

                       } else {
                           clear(null, true);
                       }
                   }, 1200);
               }, 60);
           }
        }

    },
    /**
     * @memberof Action
     * @summary 拉起安卓客户端
     * @type {function}
     * @param {string} url 唤起地址
     * @param {function} callback 回调函数
     */
    openAndroid: function (url, callback) {
        if (url) {
            var URLParms = URL.getQueryData(location.search.substring(1));
            if (URLParms.startClient && URLParms.startClient === '1') {
                window.location.href = url;
            } else {
                var iframe = document.createElement('iframe');
                iframe.id = "j_actionFrame";
                iframe.style.display = 'none';
                iframe.src = url; //sohuvideo拉起app

                var body = document.body;
                body.appendChild(iframe);
                setTimeout(function () {
                    body.removeChild(iframe);
                    iframe = null;
                }, 200);
            }
            if (callback && typeof callback === 'function') {
                callback();
            }
        }
    },
    /**
     * @memberof Action
     * @summary intent列表
     * @type {function}
     * @returns {boolean}
     */
    isIntentList: function () {
        var f = false;
        if (vars.IsAndroid && !vars.IsSohuVideoClient) {
            //三星note3和s5采用intent协议吊起客户端
            if (/(SAMSUNG[\s\\-_]+)?SM[\s\\-_]+(N90|G90|T|P6)+|Nexus/i.test(vars.UA)) {
                f = true;
            }
        }
        return f;
    },
    /**
     * @memberof Action
     * @summary 是否强制intent
     * @type {function}
     * @returns {boolean} 是否强制intent
     */
    isForceIntent: function () {
        var f = false;
        if (vars.IsAndroid && this.isIntentList() && !/UCBrowser/i.test(vars.UA) && !/QQBrowser/i.test(vars.UA)) {
            f = true;
        }
        return f;
    },
    /**
     * @memberof Action
     * @summary 获取channeled
     * @type {function}
     * @returns {*|string|undefined|string}
     */
    getAppChanneled: function () {
        var videoData = window['VideoData'] || window['videoData'] || {},
            channeled = URL.getQueryString('channeled') || videoData['channeled'] || Action.appChanneled,
            _href = window.location.href || vars.PROTOCOL + 'm.tv.sohu.com/';

        try {

            if (_href.indexOf("hots") > -1 || _href.indexOf("/x") > -1) {
                //热点流&短视频
                channeled = videoData['channeled'] || URL.getQueryString('channeled') || Action.appChanneled;
            }

        } catch (e) {
            channeled = Action.appChanneled;
            Console.log(e);
        }

        return channeled;
    },
    /**
     * @summary 生成拉起app参数
     * @param  params 传入参数
     */
    makeActionParam: function (params) {
        //拉起参数
        var scParam =  $.extend({},params);
        if (!scParam.action) {
            scParam.action = '1.1'
        }
        //h5和客户端的体育cid、cateCode有区别，需要特殊处理
        if ($(['71', '72', '73', '74', '75', '76']).indexOf(params.cid) !== -1) {
            params.cid = '28';
            params.cateCode = '9009';
        }

        //执行动作码为1.1时(小窗播放),有2个动作，其中专辑是不带vid, 单视频带vid, 这里需要区分对待
        if (scParam.action === '1.1') {
            //无vid的情况下，打开专辑播放页
            scParam.sid = params.sid||'';
            scParam.aid =  params.aid ||params.sid||'';
            scParam.cid = params.cid||'';
            scParam.vid = params.vid||'';
            scParam.cateCode = params.cateCode;
            scParam.enterid = params.enterid;
            scParam.site = params.site;
            scParam.dataType = params.dataType || '';
            scParam.ex1 = params.ex1 || '1';
            scParam.type = params.type || 6;
            //第三方app的名称（可选）
            if (params.appname && params.appname !== '' && params.appname !== 'none') {
                scParam.appname = params.appname;
                //不显示退出时的提示框
            } else {
                scParam.backpage = '0';
            }
            //附加字段(可选)
            if (params.more && !vars.IsIOS) {
                scParam.more = params.more;
            }
            // UGC, 置sid为空
            if (scParam['cid'] === 9001 || scParam['site'] === '2') {
                scParam.ex3 = 2;
                scParam.site = '2';
            }
            //winphone
            if (vars.IsWindowsPhone) {
                scParam.site = params.site ||1;
            }
        }

        //跳转到任意分类指定频道页
        if (scParam.action === '1.2' || scParam.action === '2.4') {
            //ios下的频道页跳转参数需要特殊处理
            if (vars.IsIOS) {
                scParam.action = '2.4';
                scParam.ex1 = params.ex1;

                if (window.location.href.indexOf('/hots') > -1) {
                    scParam.cid = params.cid;
                    scParam.ex2 = params.ex2;
                    //scParam.ex2 = params.cateCode; //此处不应该用cateCode覆盖原有ex2参数
                    //ios遗留问题!这里要做特殊处理 坑爹!!
                } else {
                    scParam.cid = params.cateCode;
                    scParam.ex2 = params.cid;
                }

            } else {
                scParam.action = '1.2';
                scParam.cid = params.cid;
                scParam.cateCode = params.cateCode;
            }
        }

        //全屏播放
        if (scParam.action === '1.17') {
            scParam.ex1 = params.ex1;
            scParam.site = params.site || '1';
            scParam.dataType = params.dataType || '';
            //客户端播放
            if (params.ex1 === '1') {
                scParam.vid = params.vid;
                scParam.cid = params.cid;
                //直播
            } else if (params.ex1 === '3') {
                //直播流id
                scParam.ex2 = params.ex2;
                //直播视频地址(UTF-8)
                scParam.ex3 = params.ex3;
            }
        }

        //打开独立h5页面
        if (scParam.action === '1.18') {
            scParam.urls = params.urls || location.href;

            if (params.share !== '') {
                scParam.share = typeof params.share !== 'undefined' ? params.share : 1;
            }
            //页面专题，目前之定义1为专题，ex1的优先级高于ex2
            if (params.ex1 !== '') {
                scParam.ex1 = params.ex1 || 2;
            }
            //configs(int)(可选) 文档上设这么写的...(不知道啥意思)
            if (params.ex2 !== '') {
                scParam.ex2 = params.ex2;
            }
            //界面标题(可选)
            if (params.ex3 !== '') {
                scParam.ex3 = params.ex3;
            }
            //是否显示地址栏(可选)
            if (params.bit0 !== '') {
                scParam.bit0 = params.bit0;
            }
            //是否显示导航工具栏,后退刷新按钮等(可选)
            if (params.bit1 !== '') {
                scParam.bit1 = params.bit1;
            }
        }


        //分享
        if (scParam.action === '1.21') {
            /*参数说明
             more: {
             title:名称,
             description:描述,
             imageurl:缩略图地址,
             url:内容链接地址,
             callbackurl:分享成功后的跳转页
             } */
            scParam.more = params.more;
            //分享类型,1:QQ, 2:SinaWeibo, 3:Mail, 4:SMS, 5:微信好友, 6:微信朋友圈, 目前只实现了6 (=.=)
            scParam.type = params.type;
        }

        scParam.more = params.more || {};
        scParam.more.sourcedata = params.more.sourcedata || {};
        var sourceData = scParam.more.sourcedata;
        var sourceKeys = Object.keys(sourceData);
        sourceData.enterid = params.enterid || '4';
        sourceData.params = params.params || 'uid&passport&token&plat&clientVer&clientType&gid&share&gid';
        sourceData.preid = sourceData.preid || window.location.href;
        sourceData.loginFrom = sourceData.loginFrom || 17;

        for (var index = 0, length = sourceKeys.length; index < length; index += 1) {
           var key = sourceKeys[index];
           sourceData[key] = sourceData[key];
        }
        scParam.more.sourcedata = sourceData;
        if (scParam.action === '2.10') {
            //添加提醒到系统日历
            scParam.more.urls  =  scParam.more.title|| params.urls || window.location.href;
            scParam.more.title =  scParam.more.title|| params.title || '';
            scParam.more.calendar =  scParam.more.calendar|| params.calendar || '';
            scParam.more.startdate =  scParam.more.startdate|| params.startdate || '';
            scParam.more.enddate =  scParam.more.enddate|| params.enddate || '';
        }
        //登录
        if (scParam.action === '2.6') {
            //more参数中增加字段(整个more参数需要urlencode)：{"sourcedata":{"callbackAction":"具体Action协议","closeWebView":"1",“loginFrom”:int型}}，
            // 登录成功后：closeWebView为1时，关闭当前H5页面，然后执行callbackAction；loginFrom参数，用作统计跳转登录页来源，为int类型。
            //若客户端在登录状态，则执行登出操作，并弹出登录弹窗。
            var loginCallback = sourceData.callbackAction || '';
            if(!sourceData.callbackAction || sourceData.callbackAction === '') {
                var aParam = {};//login action
                aParam.action = '1.18';
                aParam.urls  = params.urls || window.location.href;//打开跳转的页面
                aParam.channeled = params.channeled||'';
                aParam.share = params.share || '0';
                aParam.more = {
                    description: '',
                    getad: 0,
                    sourcedata: {
                        enterid: params.enterid || '4',
                        params: 'uid&passport&token&plat&clientVer&clientType&gid',
                        preid: window.location.href
                    }
                };
                loginCallback =  Action.makeActionUrl(aParam);
                sourceData.callbackAction = loginCallback;
            }
            sourceData.loginFrom = sourceData.loginFrom || 17;
            sourceData.callbackAction = loginCallback;
            sourceData.closeWebView = typeof sourceData.closeWebView !== 'undefined' ? sourceData.closeWebView : 1;//登录成功后关闭原页面

        }
        //补充参数
        params.gst = new Date().getTime(); //随机时间
        $.extend(true,scParam.more, params.more);
        scParam.more = JSON.stringify(scParam.more); //encode more
        typeof console !== 'undefined' && typeof console.log === 'function' && console.log("action makeActionParam:",scParam);
        return scParam;
    },
    /**
     * @memberof Action
     * @summary 格式化action url
     * @type {function}
     * @param {object} args 需要格式化的对象
     */
    formatArgs: function (args) {
        var params = $.extend({},args);
        var _src1=download.channelSrc||'0';
        var cateCode = args.cateCode || '',
            channeled = args.channeled || this.getAppChanneled();
        cateCode = cateCode.toString().split(',')[0] || '';
        cateCode = cateCode.split(';')[0] || '';
        params.action =args.action || '1.1';
        if (params.action === '1.1') {
            params.vid = args.vid || '';
            params.sid = args.sid || '';
            params.aid = params.aid || params.sid || '';
            params.cid = args.cid || '';
        }
        params.cateCode = cateCode || '';
        params.dataType=args.dataType || '';
        params.share= args.share || '0';
        params.open= args.open || '1';
        params.urls= args.urls || '';
        params.h5url= args.h5url || args.url || '';
        params.ex1= args.ex1 || '1';
        params.ex2=args.ex2 || '';
        params.ex3= args.ex3 || '';
        params.site=args.site || '';
        params.enterid= '4_' + channeled + '_' +_src1;//h5身份id
        params.bit0=args.bit0 || '';
        params.bit1= args.bit1 || '';
        params.type= args.type || 6;
        params.appname= 'h5';
        params.channeled= channeled||'';
        params.more = args.more || {} ;
        if ('1.1' === args.action) {
            // UGC, 置sid为空
            if (args['cid'] === 9001 || args['site'] === '2') {
                params.ex3 = 2;
                params.site = '2';
            }
        }
        return params;
    },
    makeSohuClientUrl: function (opt) {
        return makeActionUrl(opt); //过时
    },
    /**
     *
     * @memberof Action
     * @summary 生成拉起客户端的url
     * @type {function}
     * @param args 需要生成的定制化参数对象
     * @returns {string} 生成好的地址
     */
    makeActionUrl: function (args) {
       var option = this.formatArgs(args);
       //获取拉起客户端的参数对象
       var params = this.makeActionParam(option);
        var cli = Action.protocol();
        var clientUrl = '',
            URLParams = this.URLGlobalParams,
            sch = cli.protocol;
        //在浏览器内部(就是说startClient=1不一定就是在客户端里)
        if (!/SohuVideo|FiveSixVideo|SohuNews/i.test(vars.UA) && vars.IsAndroid
            && ('1' === URLParams.startClient || this.isForceIntent())) {
            //强制采用intent协议吊起客户端
            sch = 'intent';
        }

        if (sch.indexOf('intent') > -1) {
            clientUrl = 'intent://';
            clientUrl += '?' + URL.objToQueryString(params).replace(/index\.html%2C/, 'index.html');
            clientUrl += '#Intent;scheme=sohuvideo;package=com.sohu.sohuvideo;end';
            Console.log("android intent 1:", JSON.stringify(params));
        } else {
            clientUrl = sch+'://';
            clientUrl += 'action.cmd';
            clientUrl += '?' + URL.objToQueryString(params).replace(/index\.html%2C/, 'index.html');
            Console.log(""+cli, JSON.stringify(params));
        }
        if(vars.ENABLE_DEBUG) {
            alert("makeActionUrl获取拉起客户端:\n "+ clientUrl);
        }
        console.log("makeActionUrl---> : " + clientUrl);

        return clientUrl;
    },
    /**
     * @memberof Action
     * @summary 获取 iframe 没有就新建
     * @type {function}
     * @returns {*|HTMLElement}
     */
    getIframe: function () {
        var iframe = $('#j_redirectNativeFrame');

        if (iframe.length === 0) {
            iframe = $('<iframe id="j_redirectNativeFrame" style="display:none"></iframe>');
            $('body').append(iframe);
        }

        return iframe;
    },
    parserAttrs: function (el,data) {
        try{
            var $el =  $(el);
            var args ={};
            if($.isPlainObject(data) && data.vid ){
                args = data;
            }else{
                args = {
                    action: $el.attr('data-action') || '1.1',
                    vid:$el.attr('data-vid') || '',
                    sid: $el.attr('data-sid')  || $el.attr('data-aid') ||'',
                    cid: $el.attr('data-cid')  || '',
                    cateCode: $el.attr('data-catecode') || '',
                    dataType: $el.attr('data-datatype') || '1',
                    site: $el.attr('data-site') || '1',
                    share: $el.attr('data-share') || '',
                    urls: $el.attr('data-urls') || '',
                    h5url: $el.attr('data-h5url') || $el.attr('data-url') || '',
                    downUrl: $el.attr('data-downUrl') || '',
                    ex1: $el.attr('data-ex1') || '1',
                    ex2: $el.attr('data-ex2') || '',
                    ex3: $el.attr('data-ex3') || '',
                    enterid: '4_' + 1200120001 + '_0',
                    bit0: $el.attr('data-bit0') || '',
                    bit1: $el.attr('data-bit1') || '',
                    type: $el.attr('data-type') || 6,
                    appname: 'vstar',
                    channeled: 1200120001,
                    more:  {}
                };

            }
            args = this.formatArgs(args);  //格式化actionid,ex1,ex2,ex3,vid,sid
            typeof console !== 'undefined' && typeof console.log === 'function' && console.log("parserAttrs:", JSON.stringify(args));
            return args;
        }catch(e){ typeof console !== 'undefined' && typeof console.log === 'function' && console.log(e) }

    },
    /**
     * @memberof Action
     * @summary 通过协议调用客户端
     * @type {function}
     * @param {object} param
     * @param {function} callback
     */
    sendAction: function (param, callback) {
        try {
            //actionID=1.1 拉起客户端播放
            //actionID=1.18 拉起客户端打开h5
            //actionID=2.6 拉起客户端登录
            //actionID=3.1 拉起客户端vip兑换页
            //尝试拉起客户端
            var clientUrl = '';
            if (typeof param === 'object') {
                clientUrl = Action.makeActionUrl(param);
            } else if (typeof param === 'string') {
                clientUrl = param;
            }

            if (typeof clientUrl === 'string' && clientUrl.length > 0) {
                if (vars.IsAndroid) {
                    this.openAndroid(clientUrl, callback);
                } else if (vars.IsIOS) {
                    this.openIos(clientUrl, callback);
                } else {
                   // 在客户端内部，使用拉起，
                   var iframe = this.getIframe();
                   iframe.attr('src', clientUrl); //sohuvideo 拉起app
                }
            }
        }catch(e){
            typeof console !== 'undefined' && typeof console.log === 'function' && console.log(e);
        }
    },
    sendClientAction: function (param, callback) {
        var clientUrl = this.makeActionUrl(param);

        var URLParams = URL.getQueryData(location.search.substring(1));
        var h5Url = param['h5url'] || param['url'] || "";
        if(!vars.IsSohuVideoClient && h5Url){
            window.location.href = h5Url;
            return;
        }
        Console.log('发送行为统计点: app_channel_action');
        // clickTrace.pingback(null, 'app_channel_action');
        if (vars.IsAndroid) {
            if (typeof param.type !== 'undefined') {
                this.openAndroid(clientUrl, callback, param.type);

            } else {
                this.openAndroid(clientUrl, callback);
            }

        } else if (vars.IsIOS) {
            this.openIos(clientUrl, callback);

        } else {
            var iframe = this.getIframe();
            iframe.attr('src', clientUrl); //sohuvideo 拉起app
        }
    },
    /**
     * @memberof Action
     * @summary 把需要全站传递的参数注入到某个容器对象的子对象中去，在使用JS动态创建内容的之后一般需要使用这个方法把相关参数注入到动态生成的内容中去
     * @type {function}
     * @param {dom} wrap
     * @param {{}} data
     */
    updateGlobalParams: function (wrap, data) {

        var elLinks = $('a[href],form', wrap),
            i = elLinks.length,
            elLink;
        data = data || Action.URLGlobalParams;

        while (i--) {
            elLink = elLinks.get(i);
            // link = elLink.href;
            URL.setQueryString(elLink, data);
        }
    },
    /**
     * @memberof Action
     * @summary 通过src或MTV_SRC获取对应渠道包的逻辑
     * @type {function}
     */
    parserUrls: function () {
        // 判断是否客户端打开 actionVer判断是否老版本客户端
        if (!Action.URLGlobalParams['clientType'] && !Action.URLGlobalParams['actionVer']) {
            //Android老版本视频播放时添加视频地址参数: startClient = 1
            URL.setQueryString(Action, {'startClient': 1});
        }
        /* 处理需要URL传递的全局参数 */
        var URLGlobalParamsKeys = ['clientType', 'clientVer', 'actionVer', 'startClient', 'actionId', 'player',
                                   'vid', 'vids', 'site', 'srcUrl', 'poster', 'title'],
            l = URLGlobalParamsKeys.length,
            key,
            URLParms = URL.getQueryData(location.search.substring(1)),
            URLVals = {};

        while (l--) {
            key = URLGlobalParamsKeys[l];

            if (URLParms.hasOwnProperty(key) &&  URLParms[key]) {
                URLVals[key] = URLParms[key]; // set vals  k=v
            }
        }
        // /* 后续使用 */
        Action.URLGlobalParams = URLVals;
    },
    /**
     * @memberof Action
     * @summary 指定渠道号检查
     * @type {function}
     * @returns {string}
     */
    channelSrcInit: function () {
        try {
            //trace中的src在url中没有时候，还需要从cookie中取，而拉起时候就不需要走cookie中的src
            download.channelSrc = URL.getQueryString('src') || URL.getQueryString('SRC') || cookie.get('MTV_SRC') || '0';
            download.channelSrc = download.channelSrc.replace('|', '').replace('%7C', '');

            if (download.channelSrc.length > 4) {
                download.channelSrc = download.channelSrc.substr(0, 4);
            }
            //处理非数值的channelSrc
            download.channelSrc = parseInt(download.channelSrc,10);
            if(isNaN(download.channelSrc)){
              download.channelSrc = "0";
            }
            return download.channelSrc || '0';
        }catch(e){console.log(e)};
    },
    /**
     * @memberof Action
     * @summary 给所有的<A>标签增加的属性和方法
     * @type {function}
     */
    init: function () {
        /* <div id=test1 vid='1829930'  channeled="1211010100" data-params="[{cid:'76',sid:'6862794',cateCode:'169',ex1:'1',ex2:'',ex3:''}]"  data-actionId='1.17' data-scheme="intent"
         data-downUrl="http://upgrade.m.tv.sohu.com/channels/hdv/4.3.1/SohuTV_4.3.1_680_201407080857.apk?t=1"   class="actionLink">test  action Intent player</div> */
        this.parserUrls();
        //初始化渠道号
        this.channelSrcInit();
        Action.bindAction();
    },
    /**
     * @memberof Action
     * @summary 给所有的<A>标签增加的属性和方法
     * @type {function}
     */
    addIosMeta : function () {
        var meta = document.createElement("meta"),
            ms,
            pNode,
            content = '';

        if (vars.IsIOS) {
            // 在iOS中提供了两种在浏览器中打开APP的方法：Smart App Banner和schema协议
            /* <meta name="apple-itunes-app" content="app-id=458587755, app-argument=sohuvideo://action.cmd , affiliate-data=mt=8"> */
            if (vars.IsIphone) {
                content = 'app-id=458587755';
                content += ', app-argument=sohuvideo://action.cmd ';
                content += ', affiliate-data=mt=8';

                meta.setAttribute('content', content);
                meta.setAttribute('name', 'apple-itunes-app');

                ms = document.getElementsByTagName('meta');
                pNode = ms[0].parentNode;
                pNode.appendChild(meta);
            }

            if (vars.IsIpad) {
                content = 'app-id=414430589';
                content += ', app-argument=sohuvideo://action.cmd ';
                content += ', affiliate-data=mt=8';

                meta.setAttribute('content', content);
                meta.setAttribute('name', 'apple-itunes-app');

                ms = document.getElementsByTagName('meta');
                pNode = ms[0].parentNode;
                pNode.appendChild(meta);
            }
        }
    },
    /**
     * @memberof Action
     * @summary webSocket是否可用
     * @type {function}
     * @returns {boolean}
     */
    isEnableWebSocket: function () {
        var URLParms = URL.getQueryData(location.search.substring(1));
        var flag = true;
        var videoData = window['VideoData'] || window['videoData'];

        if (location.href.match(/player=1/i) ||              //如果默认是全屏播放(也是渠道来源)
            document.referrer.indexOf('m.sohu.com') > -1) {  //如果来自于手搜，默认不拉起app
            flag = false;

        } else if (typeof videoData !== 'undefined' && typeof videoData.hike !== 'undefined' && videoData.hike === '1') { //非渠道情况下,如果VideoData指定拉起app
            flag = true;
        }

        //如果有拉起需求
        if (typeof URLParms['startClient'] !== 'undefined') { //如果url中带有startClient参数

            if (URLParms['startClient'] === '2' && this.isIntentList()) {
                flag = false;

            } else {
                flag = true;
            }
        }

        if (typeof videoData === 'undefined' ||  //如果不是播放页
            (typeof videoData !== 'undefined' && videoData.mobileLimit === '1') ||     //如果只有h5才有播放权限
            !(/^(m|t\.m)\.tv\.sohu\.com$|^192\.168\.199\.186:85$/i.test(window.location.host)) ||         //非移动端h5播放页
            !cookie.test()) {                                                                        //如果不支持cookie
            flag = false;
        }

        return flag;
    },
    /**
     * @memberof Action
     * @summary 生成action参数
     * @type {function}
     * @param {object} data 参数videodata对象，如果不传的话默认使用需要全站传递的参数
     * @param {object} el
     * @returns {{}}
     */
    parserAttributes: function (data, el) {
        //create action data
        var videoParmsKeys = ['vid', 'cid', 'sid', 'plid', 'cateCode', 'site'],
            c = videoParmsKeys.length,
            URLParms = Action.URLGlobalParams,
            vd = data || window["VideoData"] || window["videoData"] || {},
            args = {};

        while (c--) {
            var key = videoParmsKeys[c];

            if (!!vd && vd[key]) {
                args[key] = vd[key];
            }

            if (!!URLParms && URLParms.hasOwnProperty(key) &&  URLParms[key]) {
                args[key] = URLParms[key];
            }
        }

        if (typeof args.site !== 'undefined') {
            args.site = args.site + '';
        }

        var channeled = URLParms['channeled'] || this.getAppChanneled();
        channeled = channeled.toString().replace('|', '').replace('%7C', '');
        var cli = Action.protocol();
        var vid = args['vid'] || '',
            sch = cli.protocol+'://',
            downUrl = args['downUrl'] || '',
            actionId = args['actionId'] || args['actionVer'] || '1.17';

        if (typeof el !== 'undefined') {
            el = $(el);
            channeled = el.attr("channeled") || channeled;
            vid = el.attr("vid") || vid;
            var _sch = el.attr("data-scheme");

            if (_sch) {
                sch = _sch.toLowerCase();
            }
            downUrl = el.attr("data-downUrl") || el.attr('data-downurl') || downUrl;
            actionId = el.attr('actionId') || el.attr('actionid') || '1.17';
            args['action'] = actionId;
            args['vid'] = vid;
            args['channeled'] = channeled;
            args['scheme'] = sch;
            args['downUrl'] = downUrl;
            args['enterid'] = '4_' + channeled; //h5身份id
            try {
                //必须用数组
                var _params = eval(el.attr("data-params")) || [];
                for (var i in _params) {
                    var jsonObj = _params[i] || {};
                    if (jsonObj) {
                        $.extend(true, args, jsonObj);
                    }
                }
            } catch (e) {
                Console.log(e);
            }
        }
        //ugc
        if (vd.site && vd.site === '2') {
            args['ex3'] = '2';

        } else {
            args['ex1'] = '1';
        }
        args['action'] = actionId;
        args = this.formatArgs(args);  //格式化actionid,ex1,ex2,ex3,vid,sid
        args['scheme'] = sch;
        args['downUrl'] = downUrl;
        Console.log("parserAttributes:", JSON.stringify(args));
        return args;
    },
    /**
     * @memberof Action
     * @summary 自动拉起客户端
     * @type {function}
     */
    autoStartClient: function () {
        var autoStartFlag = true;
        var videoData = window['VideoData'] || window['videoData'];

        if (!this.isEnableWebSocket()) {
            autoStartFlag = false;
        }
        //特殊机型不做拉起
        if (this.isIntentList()) {
            autoStartFlag = false;
        }
        //微信不自动拉起
        if (vars.IsWeixinBrowser) {
            autoStartFlag = false;
        }
        //如果VideoData中有tabCard为0或者site不为1时或者是直播时，则不拉起app
        if (typeof videoData !== 'undefined' &&
            (videoData.tabCard === '0' || videoData.site !== '1' || !$.isUndefined(videoData.liveId))) {
            autoStartFlag = false;
        }
        //如果链接中有player=1(全屏)
        if (window.location.href.match(/player=1/i)) {
            autoStartFlag = false;
        }
        //如果url中的startClient为0也不拉起
        if (this.URLGlobalParams.startClient === '0') {
            autoStartFlag = false;
        }

        var actionParam = Action.parserAttributes();
        actionParam.action = '1.1';
        actionParam.type = 'try';
        //util.getSohuDefaultApplink()
        download.getChannelInfo(null, function (cbData) {

            if (autoStartFlag && cbData.startapp === '0') {
                //发送拉起客户端请求
                Console.log('发送行为统计点: app_auto_start');
                // clickTrace.pingback(null, 'app_auto_start');
                Action.sendAction(actionParam);
            }
        });

    },
    /**
     * @memberof Action
     * @summary 获取app详情
     * @type {function}
     * @param {function} callback
     */
    getAppInfo: function (callback) {
        //获取本地app信息
        var localAppInfo = localStorage.get('localAppInfo');
        Console.log("localAppInfo ", localAppInfo);
        //如果本地存储信息有效
        if (localAppInfo && localAppInfo.time &&  Date.now() - localAppInfo.time < this.maxEffectiveTime) {

            if (typeof callback === 'function') {
                callback(localAppInfo);
            }
        }
    },
    download:function(){
        return download;
    },
    /**
     * @memberof Action
     * @summary 绑定自动拉起事件
     * @type {function}
     */
    bindAction: function (opts) {
        //根据不同需要，自动拉起app
        Action.autoStartClient();

        var endEvent = ('ontouchstart' in window) ? 'touchend' : 'mouseup';  //触摸结束的时候触发

        $('body').on(endEvent, '.actionLink', function () {
            var el = this;
            var vd = window["VideoData"] || window["videoData"] ||opts|| {};

            //获取拉起客户端全屏播放参数
            var param = Action.parserAttributes(vd, el);
            param.action = '1.1';

            //如果页面访问来自渠道直接下载
            if (download.channelSrc !== '0' && download.channelSrc !== '-2') {
                Action.sendAction(param);

            } else {

                //ios app大窗窗播放
                if (vars.IsIOS) {

                    Action.sendAction(param, function () {
                        //延迟跳appstore
                        setTimeout(function () {
                            download.gotoDownload();
                        }, 2000);
                    });
                    //android下载操作
                } else if (vars.IsAndroid) {

                    if (Action.isForceIntent()) {
                        Action.sendAction(param);

                    } else {
                        //获取客户端信息
                        Action.getAppInfo(function (cbData) {
                            //如果没有安装app或者是老本的app(不支持获取app信息的版本)，尝试拉起app，并下载最新app，已经安装，则不做操作
                            if (cbData === null) {
                                //延迟下载app
                                setTimeout(function () {
                                    download.gotoDownload();
                                }, 2000);

                                Action.sendAction(param);

                            } else {
                                Action.sendAction(param);
                            }
                        });
                    }
                    //win phone和其他
                } else {
                    Action.sendAction(param);
                }
            }
        });
    },

    /**
     * @memberof Action
     * @summary 修改客户端页面title
     * @type {function}
     * @param {string} 标题
     */
    setPageTitle: function (title) {
        var ifr, body, title = title || '';
        document.title = title;

        if (vars.IsSohuVideoClient && vars.IsIOS) {
            ifr = document.createElement('iframe');
            ifr.style.display = 'none';
            body = document.body;
            ifr.src = 'js://updateTitle?title=' + encodeURIComponent(title);
            body.appendChild(ifr);
            setTimeout(function () {
                body.removeChild(ifr);
            },2000);

        } else if (vars.IsSohuVideoClient && (vars.IsAndroid || vars.IsAndroidPad)) {

            try {
                handler.appCallback(4,1,'{"title":"'+title+'"}');

            } catch (e) {}

        }
    }
};

/**
 * 拉起login action登录,回调打开另外一个h5
 * opts={
 * urls:http:x,
 *
 * }
 */
Action.login = function (opts, callback) {
    //actionID=2.6 拉起客户端登录,close web,open new page
    var channeled = opts.channeled || 1200120001;
    if (vars.IsSohuVideoClient) {
        //登录app,跳转actionUrl ,用户没有登录，Action登录
        var actionUrl = Action.makeActionUrl({
            action: '1.18',
            urls: opts.urls || window.location.href,
            channeled:channeled,
            ex1: 2,
            share: 1,
            open: 1,
            more: {
                sourcedata: {
                    params: 'uid&passport&plat&token&clientVer&clientType&gid'
                }
            }
        });
        var option = {
            action: '2.6',
            channeled: channeled,
            more: {
                sourcedata: {
                    loginFrom: opts.loginFrom||17,
                    callbackAction: actionUrl,
                    closeWebView: 1
                }
            }
        };
        Action.sendAction(option, callback);
    }else{
        console.log('pls use sohu app!');
        if (opts && opts.download && callback && typeof callback === 'function') {
            callback && callback();
            //延迟下载app
            setTimeout(function () {
                download.gotoDownload();
            }, 2000);
        }
    }
};

export default Action;