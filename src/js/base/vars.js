var VARS = {};

  /**
   * @summary 对外接口，用户设置和获取播放记录，具体属性由播放器添加
   * @namespace SohutvJSBridge
   * @global
   */
  window.SohutvJSBridge = window.SohutvJSBridge || {};
   //别相互循环嵌套
  let __getQueryString = function (p, u) {
    u = u || document.location.toString();
    var reg = new RegExp("(^|&|\\\\?)" + p + "=([^&]*)(&|$|#)"),
        r = null;
    if (r = u.match(reg)) return r[2];
    return "";
  };


  /**
   * @memberof VARS
   * @summary 是否启用全局调试
   * @type {boolean}
   */
  VARS.ENABLE_DEBUG = __getQueryString('debug') || __getQueryString('DEBUG') || false;

  /**
   * @memberof VARS
   * @summary 是否支持h5，不刷新页面，修改页面访问历史链接
   * @type {boolean}
   */
  VARS.IS_HISTORY_SUPPORT = ('pushState' in history);

  /**
   * @memberof VARS
   * @summary 网络协议
   * @type {boolean}
   */
  VARS.PROTOCOL = ('https:' === document.location.protocol) ? 'https://' : 'http://';

  /**
   * @memberof VARS
   * @summary 是否启外部player
   * @type {boolean}
   */
  VARS.IS_EXTERNAL_PLAYER = location.href.match(/player=1/i) 
  || (location.host.indexOf('m.sohu.com') > -1) ||false;

  /**
   * @memberof VARS
   * @summary api_key编码
   * @type {string}
   */
  VARS.API_KEY = 'f351515304020cad28c92f70f002261c';

  /**
   * @memberof VARS
   * @summary 下载API的默认相对地址
   * @type {string}
   */
  VARS.API_URL = VARS.PROTOCOL + 'api.tv.sohu.com/';
  VARS.TEST_API_URL = VARS.PROTOCOL +'testapi.hd.sohu.com/'; 



  /**
   * @memberof VARS
   * @summary h5后台接口host
   * @type {string}
   */
  VARS.SVP_URL = VARS.PROTOCOL + 'm.tv.sohu.com/';

  /**
   * @memberOf VARS
   * @summary 直播数据地址
   * @type {String}
   */
  VARS.API_LIVE_URL = VARS.PROTOCOL + 'live.m.tv.sohu.com/api/';

  /**
   * @memberOf VARS
   * @summary 接口get请求地址
   * @type {String}
   */
  VARS.VSTAR_API_URL = VARS.PROTOCOL + 'api.tv.sohu.com/';

  /**
   * @memberOf VARS
   * @summary 接口post请求地址(走代理)
   * @type {String}
   */
  VARS.VSTAR_PXY_URL = VARS.PROTOCOL + 'fans.tv.sohu.com/api/';

  /**
   * @memberOf VARS
   * @summary 测试代理地址
   * @type {String}
   */
  VARS.VSTAR_PXY_TEST_URL = VARS.PROTOCOL + 't.m.tv.sohu.com/pxy1/';

  /**
   * @memberof VARS
   * @summary 下载API的代理地址
   * @type {string}
   */
  VARS.API_PROXY_URL = VARS.PROTOCOL + 'm.tv.sohu.com/api/';

  /**
   * @memberof VARS
   * @summary window加载完后是否自动发送trace类数据
   * @type {boolean}
   */
  VARS.IsAutoTrace = false;

  /**
   * @memberof VARS
   * @summary 粉丝团页面主路径
   * @type {boolean}
   */
  VARS.VSTAR_MAIN_PATH = VARS.PROTOCOL + 'fans.tv.sohu.com/h5/vstar/';

  /**
   * @memberof VARS
   * @summary h5首页地址
   * @type {string}
   */
  VARS.H5_URL = VARS.PROTOCOL + 'm.tv.sohu.com/';

  /**
   * @memberof VARS
   * @summary h5测试首页地址
   * @type {string}
   */
  VARS.H5_TEST_URL = VARS.PROTOCOL + 't.m.tv.sohu.com/';

  /**
   * @memberof VARS
   * @summary 浏览器userAgent
   * @type {boolean}
   */
  VARS.UA = window.navigator.userAgent;

  
  //获取设备密度
  var getDevicePixelRatio = function () {
    var ratio = 1;
    
    try {
      
      if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI) {
        ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
      
      } else if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
      
      } else {
        ratio = window.devicePixelRatio;
      }
      ratio = parseFloat(ratio) || 1;

    } catch (e) {}
    
    return ratio;
  };
  /**
   * @memberof VARS
   * @summary 设备屏幕象素密度
   * @type {number}
   */
  VARS.PixelRatio = getDevicePixelRatio();

  /**
   * @memberof VARS
   * @summary 是否是androd设备
   * @type {boolean}
   */
  // HTC Flyer平板的UA字符串中不包含Android关键词
  // 极速模式下视频不显示 UCWEB/2.0 (Linux; U; Adr 4.0.3; zh-CN; LG-E612) U2/1.0.0 UCBrowser/9.6.0.378 U2/1.0.0 Mobile
  VARS.IsAndroid = !!(/Android|HTC|Adr/i.test(VARS.UA)  || !!(window.navigator.platform + '').match(/Linux/i));
  
  /**
   * @memberof VARS
   * @summary 是否是ios pad
   * @type {boolean}
   */
  VARS.IsIpad = !VARS.IsAndroid && /iPad/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是ios pod
   * @type {boolean}
   */
  VARS.IsIpod = !VARS.IsAndroid && /iPod/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是是否是ios phone
   * @type {boolean}
   */
  VARS.IsIphone = !VARS.IsAndroid && /iPod|iPhone/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是ios设备
   * @type {boolean}
   */
  VARS.IsIOS = VARS.IsIpad || VARS.IsIphone;

 
  VARS.getIosVer =function () {
    var ver = 0;
    try {
      if (!/iPad|iPhone|iPod/i.test(navigator.userAgent)) {
        return ver;
      }
      if(/OS \d+_.*like Mac OS X/i.test(navigator.userAgent) ){
        var mc = navigator.userAgent.match(/OS (\d+)_(\d+)(_\d+)? like Mac OS X/i);
        if(mc.length>3){
          ver= parseFloat(mc[1]+'.'+mc[2]);
        }
      }
    }catch (e){ console.log(e) }
    return ver;
  };

  VARS.getAdrVer =function () {
    var ver = 0;
    try {
      if (!VARS.IsAndroid) {
        return ver;
      }
      if(/Android\s\d/i.test(navigator.userAgent) ) {
        var mc = /Android\s([\d\.]+)/g.exec(navigator.appVersion);
        if (mc && mc.length > 1) {
           ver = parseFloat(mc[1]);
        }
      }
    }catch (e){ console.log(e) }
    return ver;
  };

  VARS.getIEVer = function() {
    var isIE = !!document.all && (navigator.appVersion.indexOf("MSIE") != -1)
        && ( (navigator.platform === 'Win32')
            || (navigator.platform === 'Win64')
            || (navigator.platform === 'Windows')
            || (navigator.appVersion.toLowerCase().indexOf("win") != -1 )
        );
    var ver = 0;
    var sVer = navigator.userAgent;
    if (isIE) {
      if (!!window.atob) return 10;
      if (!!document.addEventListener) return 9;
      if (!!document.querySelector) return 8;
      if (!!window.XMLHttpRequest) return 7;
      if (sVer.indexOf("MSIE") > -1) {
        var sVerNo = sVer.split(";")[1];
        sVerNo = sVerNo.replace("MSIE", "");
        ver = parseFloat(sVerNo);
      }
    }
    return ver;
  };


  /**
   * @memberof VARS
   * @summary 是否是windows phone
   * @type {boolean}
   */
  VARS.IsWindowsPhone = /Windows Phone/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是老版本windows phone(8.1之前算) winphone 8.1之前算old(采用全屏播放),8.1(含)之后，采用的是标准播放(小窗+假全屏)
   * @type {boolean}
   */
  VARS.IsOldWindowsPhone = /Windows\sPhone\s([1234567]\.|8\.0)/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是新版本windows phone(8.1之前算) winphone 8.1之前算old(采用全屏播放),8.1(含)之后，采用的是标准播放(小窗+假全屏)
   * @type {boolean}
   */
  VARS.IsNewWindowsPhone = VARS.IsWindowsPhone && !VARS.IsOldWindowsPhone;

  /**
   * @memberof VARS
   * @summary 是否是windows pad
   * @type {boolean}
   */
  VARS.IsWindowsPad = /Windows\sPad/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是windows系统
   * @type {boolean}
   */
  VARS.IsWindows = /Windows/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是vivo手机
   * @type {boolean}
   */
  VARS.IsVivoPhone = /vivo/i.test(VARS.UA);

  VARS.ScreenSizeCorrect = 1;
  
  if (VARS.IsAndroid) {
    
    if ((window['screen']['width'] / window['innerWidth']).toFixed(2) ===  VARS.PixelRatio.toFixed(2)) {
      VARS.ScreenSizeCorrect = 1 / VARS.PixelRatio;
    }
  }
  VARS.AdrPadRegex = /pad|XiaoMi\/MiPad|lepad|YOGA|MediaPad|GT-P|SM-T|GT-N5100|sch-i800|HUAWEI\s?[MTS]\d+-\w+|Nexus\s7|Nexus\s8|Nexus\s11|Kindle Fire HD|Tablet|tab/i;
  VARS.ScreenSize = Math.floor(window.screen['width'] * VARS.ScreenSizeCorrect) + 'x' + Math.floor(window.screen['height'] * VARS.ScreenSizeCorrect);
  //根据这些值就可以反向算出屏幕的物理尺寸 ,屏幕尺寸=屏幕对角线的像素值/（密度*160）
  //屏幕尺寸=Math.sqrt(Math.pow(width, 2)+Math.pow(height, 2))/ (密度*160)
  //判断是否为平板
  VARS.gpadJSON ={};
  var isGpad = function () {
    //安卓pad正则
    var padScreen = 1;
    var _IsAndroidPad = false;
    var _ratio = VARS.ScreenSizeCorrect || 1;
    //像素
    var sw = Math.floor(window.screen.width * _ratio);
    var sh = Math.floor(window.screen.height * _ratio);
    var inch = 1;

    try {
      //对角线长度大于
      padScreen = parseFloat(Math.sqrt(sw * sw + sh * sh));
      //尺寸
      inch = parseFloat(padScreen / (160 * VARS.PixelRatio));

    } catch (e) {}
    // 对角线长度大于1280 则为Pad
    if (!!('ontouchstart' in window) && VARS.IsAndroid) {
        var adrPad = !!(VARS.AdrPadRegex.test(VARS.UA));

        if (/mobile/i.test(VARS.UA) && !adrPad ) {
            _IsAndroidPad = false;

        } else {

            if (adrPad &&  !/coolpad/i.test(VARS.UA) ) {
              _IsAndroidPad = true;
            } else {
               // 对角线长度大于 2500 ,inch > 7.0  则为Pad
               if (!_IsAndroidPad && (padScreen >= 2500 || inch > 7.0)) {
                   _IsAndroidPad = true;
               }
            }
      }
    }
    VARS.gpadJSON ={'width':sw,'height':sh,'PixelRatio':VARS.PixelRatio,' padScreen':padScreen,'inch':inch,'isGpad':_IsAndroidPad,'UA':VARS.UA};
    //alert(JSON.stringify(VARS.gpadJSON));
    var isGpad2 = (/AndroidPad/i.test(window.location.href)) ? true : false;
    if(isGpad2){return isGpad2;}
    return _IsAndroidPad;
  };


  /**
   * @memberof VARS
   * @summary 是否是androd pad
   * @type {boolean}
   */
  VARS.IsAndroidPad = isGpad();


  /**
   * @memberof VARS
   * @summary 是否是ie browser
   * @type {boolean}
   */
  VARS.IsIEBrowser = !!document.all && (navigator.appVersion.indexOf("MSIE") != -1)
      && ( (navigator.platform === 'Win32')
      || (navigator.platform === 'Win64')
      || (navigator.platform === 'Windows')
      || (navigator.appVersion.toLowerCase().indexOf("win") != -1 )
      );

  /**
   * @memberof VARS
   * @summary 是否是safari browser
   * @type {boolean}
   */
  VARS.IsSafariBrowser = !! (VARS.UA.match(/Safari/i) && !VARS.IsAndroid);

  /**
   * @memberof VARS
   * @summary 是否是chrome browser
   * @type {boolean}
   */
  VARS.IsChromeBrowser = !! (VARS.UA.match(/Chrome/i) && !VARS.IsAndroid);

  /**
   * @memberof VARS
   * @summary 是否是微信 webview
   * @type {boolean}
   */
  VARS.IsWeixinBrowser = !! (window['WeixinJSBridge'] || /MicroMessenger/i.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 微信应用宝下载url
   * @type {boolean}
   */
  VARS.WeiXinAppBoxURL = VARS.PROTOCOL + 'a.app.qq.com/o/simple.jsp?pkgname=com.sohu.sohuvideo';
  /**
   * @memberof VARS
   * @summary 是否是qq browser
   * @type {boolean}
   */
  VARS.IsQQBrowser = !!(/MQQBrowser/i.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 是否是uc browser
   * @type {boolean}
   */
  VARS.IsUCBrowser = !!(/UCBrowser/i.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 是否是老版本uc browser(10.2之前版本为老版本，认为不支持m3u8)
   * @type {boolean}
   */
  VARS.IsOldUCBrowser = !!(/UCBrowser\/([1-9]\..*|10\.[01].*)/i.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 是否是老版本uc browser(10.2之前版本为老版本，认为不支持m3u8)
   * @type {boolean}
   */
  VARS.IsNewUCBrowser = VARS.IsUCBrowser && !VARS.IsOldUCBrowser;

  /**
   * @memberof VARS
   * @summary 是否是搜狗 browser
   * @type {boolean}
   */
  VARS.IsSoGouBrowser = !!(/SogouMobileBrowser/i.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 是否是小米 browser
   * @type {boolean}
   */
  VARS.IsMiBrowser = !!(/MiuiBrowser/i.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 是否是baidu browser
   * @type {boolean}
   */
  VARS.IsBaiduBrowser = !!(/baidubrowser/i.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 是否是手机baidu
   * @type {boolean}
   */
  VARS.IsBaiduBoxApp = !!(/baiduboxapp/i.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 是否是老baidu browser 5.7.3.0之前为老版本百度播放器
   * @type {boolean}
   */
  VARS.IsOldBaiduBrowser = !!(/baidubrowser\/([01234]\..*|5\.[0123456]\..*|5\.7\.[012])/i.test(VARS.UA));

  /**
   * @memberof VARS
   * @summary 是否是新baidu browser 5.7.3.0之后为新百度播放器，新版本播放器能够正常触发timeupdate事件和允许小窗播放(小窗video标签能遮盖导航栏)
   * @type {boolean}
   */
  VARS.IsNewBaiduBrowser = VARS.IsBaiduBrowser && !VARS.IsOldBaiduBrowser;

  /**
   * @memberof VARS
   * @summary 是否支持触屏
   * @type {boolean}
   */
  VARS.IsTouch = 'ontouchstart' in window;

  //获取浏览器版本
  var getBrowserVer = function () {
    var ua = VARS.UA;
    var MQQBrowser = ua.match(/MQQBrowser\/(\d+\.\d+)/i),
        MQQClient = ua.match(/QQ\/(\d+\.(\d+)\.(\d+)\.(\d+))/i),
        WeChat = ua.match(/MicroMessenger\/((\d+)\.(\d+))\.(\d+)/) || ua.match(/MicroMessenger\/((\d+)\.(\d+))/),
        MiuiBrowser = ua.match(/MiuiBrowser\/(\d+\.\d+)/i),
        UC = ua.match(/UCBrowser\/(\d+\.\d+(\.\d+\.\d+)?)/) || ua.match(/\sUC\s/),
        IEMobile = ua.match(/IEMobile(\/|\s+)(\d+\.\d+)/),
        //HTC = ua.indexOf('HTC') > -1,
        ipod = ua.match(/(ipod\sOS)\s([\d_]+)/);
    var ver = NaN;

    if (window.ActiveXObject) {
      ver = 6;
      
      if (window.XMLHttpRequest || (ua.indexOf('MSIE 7.0') > -1)) {
        ver = 7;
      }

      if (window.XDomainRequest || (ua.indexOf('Trident/4.0') > -1)) {
        ver = 8;
      }
      
      if (ua.indexOf('Trident/5.0') > -1) {
        ver = 9;
      }

      if (ua.indexOf('Trident/6.0') > -1) {
        ver = 10;
      }
      
    } else if (ua.indexOf('Trident/7.0') > -1) {
      ver = 11;
    }

    if (ipod) {
      ver = ipod[2].replace(/_/g, '.');
    }

    if (MQQBrowser) {
      ver = MQQBrowser[1];
    }

    if (MQQClient) {
      ver = MQQClient[1];
    }

    if (WeChat) {
      ver = WeChat[1]; //weixin
    }

    if (MiuiBrowser) {
      ver = MiuiBrowser[1];
    }

    if (UC) {
      ver = UC[1] || NaN;
    }

    if (MQQBrowser && (!window.mtt || !window.mtt.getBrowserParam) && VARS.IsAndroid) {
      ver = '9.6.0' || NaN;
    }

    if (IEMobile) {
      ver = IEMobile[2];
    }

    return ver;
  };
  /**
   * @memberof VARS
   * @summary 浏览器版本
   * @type {string}
   */
  VARS.BrowserVersion = getBrowserVer();

  var getOsVer = function () {
    var ua = VARS.UA;
    var ver = NaN;

    if ($.os && $.os.version) {
      ver = $.os.version;
    
    } else {
      var webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
          android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
          ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
          ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
          iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
          webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
          kindle = ua.match(/Kindle\/([\d.]+)/),
          blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
          bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
          rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/);

      if (webkit) {
        ver = webkit[1];
      }

      if (android) {
        ver = android[2];
      }

      if (iphone && !ipod) {
        ver = iphone[2].replace(/_/g, '.');
      }

      if (ipad) {
        ver = ipad[2].replace(/_/g, '.');
      }

      if (ipod) {
        ver = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
      }

      if (webos) {
        ver = webos[2];
      }

      if (blackberry) {
        ver = blackberry[2];
      }

      if (bb10) {
        ver = bb10[2];
      }

      if (rimtabletos) {
        ver = rimtabletos[2];
      }

      if (kindle) {
        ver = kindle[1];
      }
    }

    return ver;
  };
  /**
   * @memberof VARS
   * @summary 获取系统版本
   * @type {boolean}
   */
  VARS.OsVersion = getOsVer();

  /**
   * @memberof VARS
   * @summary 是否是小米1
   * @type {boolean}
   */
  VARS.IsMIOne = /MI-ONE/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是小米
   * @type {boolean}
   */
  VARS.IsXiaoMI = /MI/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否vivo手机
   * @type {boolean}
   */
  VARS.IsVivoPhone = /vivo/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是索尼手机
   * @type {boolean}
   */
  VARS.IsSonyPhone = /Sony/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是三星设备
   * @type {boolean}
   */
  VARS.IsSAMSUNG = /SAMSUNG/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是三星note3
   * @type {boolean}
   */
  VARS.IsSAMSUNGNote3 = /SAMSUNG SM-N90/i.test(VARS.UA);



  /**
   * @memberof VARS
   * @summary 是否是PC设备
   * @type {boolean}
   */
  VARS.IsPC = !VARS.IsIOS && !VARS.IsAndroid && !VARS.IsWindowsPhone && !VARS.IsWindowsPad && !/Mobile/i.test(VARS.UA);
  

  /**
   * @memberof VARS
   * @summary 动作起始事件
   * @type {boolean}
   */
  VARS.START_EVENT = VARS.IsTouch ? 'touchstart' : 'mousedown';

  /**
   * @memberof VARS
   * @summary 动作移动事件
   * @type {boolean}
   */
  VARS.MOVE_EVENT = VARS.IsTouch ? 'touchmove' : 'mousemove';

  /**
   * @memberof VARS
   * @summary 动作结束事件
   * @type {boolean}
   */
  VARS.END_EVENT = VARS.IsTouch ? 'touchend' : 'mouseup';

  /**
   * @memberof VARS
   * @summary 动作取消事件
   * @type {boolean}
   */
  VARS.CANCEL_EVENT = VARS.IsTouch ? 'touchcancel' : 'mouseup';

  /**
   * @memberof VARS
   * @summary 屏幕横竖屏切换事件
   * @type {boolean}
   */
  VARS.RESIZE_EVENT = 'onorientationchange' in window ? 'orientationchange' : 'resize';

  /**
   * @memberof VARS
   * @summary 是否是首搜页面
   * @type {boolean}
   */
  VARS.IsShouSou = location.host.indexOf('m.sohu.com') > -1;

  /**
   * @memberof VARS
   * @summary 是否站外页面内嵌播放器
   * @type {boolean}
   */
  VARS.IS_EXTERNAL_PLAYER = location.href.match(/player=1/i) || window.IS_EXTERNAL_PLAYER || VARS.IsShouSou  ;

  /**
   * @memberof VARS
   * @summary h5视频页面的域名
   * @type {string}
   */
  VARS.WebRoot = '';
  // 这个变量的存在是因为体育频道是独立域名m.s.sohu.com，
  // 在体育频道点击视频推荐需要返回到m.tv.sohu.com
  if ('m.s.sohu.com' === location.host) {
    VARS.WebRoot = VARS.PROTOCOL + 'm.tv.sohu.com';
  }

  /**
   * @memberof VARS
   * @summary 空方法
   * @type {function}
   */
  VARS.BlankFn = function () {};

  /**
   * @memberof VARS
   * @summary h5 channeled
   * @property {string}
   */
  VARS.H5Channeled = VARS.IsWeixinBrowser ? '1200230001' : '1211010100';

  /**
   * @memberof VARS
   * @summary 是否支持history
   * @type {boolean}
   */
  VARS.IsHistorySupport = ('pushState' in history);

  /**
   * @memberof VARS
   * @summary 统计技术调试参数
   * @type {number}
   */
  VARS.ADPingbackCount = 0;

  /**
   * @memberof VARS
   * @summary 是否是搜狐视频手机客户端
   * @type {number}
   */
  VARS.IsSohuVideoMobileClient = /SohuVideoMobile/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否是搜狐视频pad客户端
   * @type {number}
   */
  VARS.IsSohuVideoPadClient = /SohuVideoPad/i.test(VARS.UA);

  /**
   * @memberof VARS
   * @summary 是否搜狐视频客户端
   * @type {boolean}
   */
  VARS.IsClient = (VARS.IsSohuVideoMobileClient || VARS.IsSohuVideoPadClient || __getQueryString('clientType') && __getQueryString('clientVer')) ? true : false;

  /**
   * @memberof VARS
   * @summary 是否搜狐视频客户端
   * @type {boolean}
   */
  VARS.IsSohuVideoClient = VARS.IsClient;

  /**
   * @memberof VARS
   * @summary 渠道号
   * @type {string}
   */

  VARS.H5Src = __getQueryString('src') || __getQueryString('SRC') || '';

  //测试初始化
  VARS.testEnvInit = function () {
    //post和get接口地址统一采用测试机代理
    if (/t\.tv\.sohu\.com|t1\.tv\.sohu\.com/.test(window.location.host)) {
      VARS.VSTAR_API_URL = VARS.VSTAR_PXY_URL = VARS.VSTAR_PXY_TEST_URL;
      VARS.VSTAR_MAIN_PATH = location.href.substring(0, location.href.lastIndexOf('/')) + '/';

    }
  };
export default VARS;