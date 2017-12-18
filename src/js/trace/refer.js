/**
 *   @description: 手机适配映射业务
 *   @version    : 1.0.3
 *   @update-log :
 *      1.0.1 - 20150205 周国庆 手机适配映射业务
 *                              前端跳转时补充一个参数src;
 *                              url里有参数src时用src,没用通过document.referer的dommain来正则匹配,再没有用window.location.href
 *                              如果匹配种上相应的mtv_src,
 *                              非sohu的src还需要种_channeled=1212130001
 *                              cookie里的时间设置为2个小时
 *      1.0.2 - 20151123 陈  龙 做了jshint校验
 *                              优化了逻辑
 *                              新增设置MUID逻辑(统计防刷参数)
 *      1.0.3 - 2016-11-03 王宏光 fix https
 */
define('trace/refer',function(require, exports, module) {

  'use strict';
  
  var $=svp.$,
      global=window,
      vars = require('base/vars'),
      URL = require('base/url'),
      util = require('base/util'),
      Cookie = require('base/cookie');


  var traceRefer = {
    //是否初始化标志位
    initFlag: false
  };
  //按top100排名.src渠道值对应域名正则
  traceRefer.SrcSettings = {
    '1104': /^wx\.m\.tv\.sohu\.com$/i,
    '1106': /^tv\.sohu\.com$|^pad\.tv\.sohu\.com$/i,
    '1107': /^my\.tv\.sohu\.com$/i,
    '1108': /^sports\.sohu\.com$/i,
    '1105': /^(m|wap|s|3g)\.(tv|s)\.sohu\.com$|^(t|t1|t2)\.m\.tv\.sohu\.com$|^sohutv\.hao3608\.com$/i,
    '1109': /^(news|auto|media|www|yule|mil)\.sohu\.com$/i,
    '1001': /^m\.sohu\.com$|^(3g|zhibo|wap)\.sohu\.com$|^(.*)m\.sohu\.com$|^m\.club\.sohu\.com$|^api\.k\.sohu\.com$/i,
    '1110': /^(.*)\.baidu\.com$|^(.*)baidu\.mobi$|^webapp\.cbs\.baidu\.com$/i,
    '1112': /^(.*)hao123\.com$/i,
    '1113': /^v\.m\.liebao\.cn$|^v\.duba\.com$/i,
    '1114': /^(.*)2345\.com$/i,
    '1115': /^v\.sogou\.com$|^m\.kan\.sogou\.com$|^tv\.sogou\.com$/i,
    '1068': /^sogou\.com$|^(.*)\.sogou\.com$/i,
    '1116': /^(.*)sm\.cn$|^(.*)uodoo\.com$/i,
    '1006': /^tv\.uc\.cn$/i,
    '1007': /^hao\.uc\.cn$/i,
    '1117': /^(news|inews)\.uc\.cn$/i,
    '1033': /^m\.video\.so\.com$/i,
    '1075': /^(.*)(so|haosou)\.com$/i,
    '1118': /^(.*)weibo\.com$|^(.*)weibo\.cn$/i,
    '1119': /^(.*)qzone\.qq\.com$/i,
    '1120': /^(.*)10086\.cn$/i,
    '1123': /^(.*)(google|g).(.*)$/i,
    '1121': /^(.*)wapreach\.com$|^(.*)\.app111\.com$|^(.*)homeinns\.cc$|^(hao|hao123|m)\.xiaomi\.com$/i,
    '1122': /^video\.wapreach\.com$|^video\.browser\.miui\.com$|^v\.html5\.qq\.com$|^kanpian\.easou\.com$|^video\.nearme\.com\.cn$/i,
    '1124': /^(.*)soso\.com$|^(.*)easou\.com$|^(.*)bing\.com$/i
  };

  traceRefer.getUrlHost = function (url) {
    var refer = url || '';
    var hostReg = /.*:\/\/([^\/]*).*/i;
    var match = refer.match(hostReg);
    var referHost = '';
    
    if (match) {
      referHost = match[1];
    }

    return referHost;
  };

  traceRefer.getReferHost = function (referrer) {
    var refer = referrer || document.referrer;
    var hostReg = /.*:\/\/([^\/]*).*/i;
    var match = refer.match(hostReg);
    var referHost = '';

    if (match) {
      referHost = match[1];
    }
    var isip = /(\d+).(\d+).(\d+).(\d+)/i.test(referHost);

    if (isip || !referHost) {
      referHost = '';
    }

    return referHost;
  };

  traceRefer.getRefer = function () {
    var refer = document.referrer;
    
    if ('undefined' === typeof refer) {
      refer = '';
    }

    return refer;
  };

  traceRefer.matchRefer = function (referhost, settings) {
    var _src = '';
    
    try {
      referhost = referhost.replace(/^http:\/\//, '');
      var obj = settings;
      
      if ('undefined' === typeof obj) {
        obj = traceRefer.SrcSettings;
      }

      for (var key in obj) {
        var v = obj[key];
        
        if (v && referhost && v.test(referhost)) {
          _src = key;
          typeof console !== 'undefined' && typeof console.log === 'function' && console.log('matchRefer ' + referhost + ' , ' + key + ' ' + v);
          
          break;
        }
      }

    } catch (e) {
      typeof console !== 'undefined' && typeof console.log === 'function' && console.log(e);
    }

    return _src;
  };

  traceRefer.setSrcChanneled = function () {
    var obj = {
      MTV_SRC: '',
      channeled: ''
    };
    var h5Src = vars.h5Src;
    var _mtvsrc = URL.getQueryString('src') || URL.getQueryString('SRC') || '';
    h5Src =  _mtvsrc; //url not have src
    
    if (h5Src) {
      Cookie.set('MTV_SRC', h5Src, 86400, '.sohu.com');
    }
    var _channeled = URL.getQueryString('channeled') || '';
    var refer = traceRefer.getRefer() || '';
    //refer='http://m.sohu.com'; //test
    var referhost = traceRefer.getReferHost(refer) || traceRefer.getUrlHost(window.location.href) || '';
    typeof console !== 'undefined' && typeof console.log === 'function' && console.log('get referhost ' + referhost + '   ' + _channeled);
    
    //channeld
    if (!_channeled) {
      //渠道来源的_channeled = 1212130001
      if (_mtvsrc) {
        _channeled = '1212130001'; //渠道来源
      
      } else {
        
        if (referhost.indexOf('m.sohu.com') > -1) {
          _channeled = '1200110001';
        
        } else {
          _channeled = '1212120001';
        }
      }

    } else {
      //sohu _channeld
      _channeled = _channeled || '1212120001'; //未知
    }

    //src
    if (h5Src) {
      _mtvsrc = h5Src;
    
    } else {

      if (referhost) {
        _mtvsrc = traceRefer.matchRefer(referhost, traceRefer.SrcSettings);
        
        if (_mtvsrc.length < 8 && _mtvsrc >= 4) {
          //补齐8位
          _mtvsrc = _mtvsrc = (_mtvsrc.substring(0, 4) + '0001');
        }
      }

      if (!_mtvsrc) {
        _mtvsrc = '11050001'; //自有流量
      }
    }

     //isweixin
    if (/^wx\.m\.tv\.sohu\.com$/i.test(document.domain) && vars.IsWeixinBrowser) {
      _mtvsrc = '11040001';
      _channeled = '1211110001';
      obj.MTV_SRC = _mtvsrc;
      obj.channeled = _channeled;
      Cookie.set('MTV_SRC', _mtvsrc, 86400, '.sohu.com');
      Cookie.set('_channeled', _channeled, 86400, '.sohu.com');
      typeof console !== 'undefined' && typeof console.log === 'function' && console.log('is weixin ' + _mtvsrc + '   ' + _channeled);
    }

    var oldsrc = Cookie.get('MTV_SRC') || ''; //mtvsrc不存在就按refer/域名自动绑定src
    
    if (!oldsrc && _mtvsrc) {
      obj.MTV_SRC = _mtvsrc;
      Cookie.set('MTV_SRC', _mtvsrc, 86400, '.sohu.com');
    }

    if (_channeled) {
      obj.channeled = _channeled;
      Cookie.set('_channeled', _channeled, 86400, '.sohu.com');
    }
    //need refer.js
    h5Src = Cookie.get('MTV_SRC') || _mtvsrc;
    obj.MTV_SRC = h5Src;
    typeof console !== 'undefined' && typeof console.log === 'function' && console.log('traceRefer.js MTV_SRC:' + h5Src + ',_channeled:' + _channeled);

    //muid初始化
    if (!Cookie.get('MUID')) {
      Cookie.set('MUID', util.createUUID(), 86400);
    }

    return obj;
  };

  traceRefer.init = function () {

    if (!this.initFlag) {
      this.initFlag = true;
      var obj = {};
      
      try {
        obj = traceRefer.setSrcChanneled();
      
      } catch (e) {
        typeof console !== 'undefined' && typeof console.log === 'function' && console.log(e);
      }
      typeof console !== 'undefined' && typeof console.log === 'function' && console.log('traceRefer matchRefer ' + JSON.stringify(obj));
    }
  };

   svp.TraceRefer = traceRefer;//不建议用
   module.exports  = traceRefer;


});