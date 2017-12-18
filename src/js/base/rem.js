/*
 *   @description: 设置rem字体
 *   @version    : 1.0.1
 *   @update-log :
 *                 1.0.1 - 20160510 周国庆 设置rem字体
 *                         20160519 陈  龙 加入了执行rem操作的判断条件(判断html标签中data-rem属性)
 *                1.0.2    20160926 周国庆 设置ipad rem字体 2048
 */
;(function () {
    window.svp = window.svp || {};
    var doc = window.document;
    var win = window;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    var dpr = 0;// 物理像素与逻辑像素的对应关系
    var scale = 1;// css 像素缩放比率
    var maxRem = 100;
    var isResize = false;
    var tid = null;
    //是否对rem进行处理(在html上设置font-size),默认设置false
    var isRem = docEl.getAttribute('data-rem') || 'false'; //svp.IsRem ||
    isRem = (isRem == '1' || isRem === 'true') ? true : false;

    // 初始化数据
    var psdWidth = docEl.getAttribute('data-design') || 750; // psd设计稿宽度psdWidth
    if (win.devicePixelRatio >= 3) {
        dpr = 3;
    } else if (win.devicePixelRatio === 2) {
        dpr = 2;
    }else{
        dpr = 1;
    }
    scale =(1/dpr).toFixed(1);

    var nowCh,nowCw,pageWidth,isIpad=/ipad/i.test(window.navigator.userAgent),
        ch =   document.documentElement.clientHeight  || document.body.clientHeight,
        cw =  document.documentElement.clientWidth|| document.body.clientWidth,
        padLandscape=false,
        ipadLandscape=!!(isIpad&&cw/ch>=1);
    if((cw>=1024&&cw/ch>1)||ipadLandscape){
        psdWidth=2048;
        padLandscape=true;
        if(ipadLandscape&&cw<1024){
            cw=1024;
        }
    }

    function setViewport() {
        if (metaEl) {
            metaEl.setAttribute('content', 'width=device-width, initial-scale=' + scale + ', minimum-scale=' + scale
                + ', maximum-scale=' + scale + ', user-scalable=no');
        }
    }

    // //设置rem字体的基准像素
    function setRem(evt) {
        var e= evt||window.event,isResize=!!(evt && evt.type==='resize');
        if(e){
            nowCh = document.documentElement.clientHeight || document.body.clientHeight;
            nowCw = document.documentElement.clientWidth || document.body.clientWidth;
            psdWidth=nowCw>=1024&&nowCw/nowCh>1?2048:750;
        }
        if ((window.orientation && (window.orientation == 90 || window.orientation == -90))
            ||(!e && padLandscape)||(isResize && nowCw / nowCh>1)) {
            if(isResize){
                pageWidth = Math.max(nowCh,nowCw);
            }else{
                pageWidth = Math.max(ch, cw);
            }
            if(padLandscape){
                padLandscape=false;
            }
        } else {
            if(isResize){
                pageWidth = Math.min(nowCh, nowCw);
            }else{
                pageWidth = Math.min(ch, cw);
            }
        }
        var rem = (pageWidth / psdWidth * 100).toFixed(2);
        rem = Math.min(rem, maxRem);
        docEl.style.fontSize = rem + 'px';
        svp.rem = rem;
    }
    var remEventOn =function(el,type,fn,capture){
        if(el.addEventListener){
            el.addEventListener(type,fn,!!capture);
        }else if(el.attachEvent){
            el.attachEvent('on'+type,fn);
        }else{
            el['on'+type]=fn;
        }
    };
    if(isRem) {
        setRem();
        var self =this;
        var tid,tid2;
        var _evt = 'onorientationchange' in window ? 'orientationchange' : 'resize';
        remEventOn(window,_evt,function (evt) {
            clearTimeout(tid);
            var bindRem = (function () {
                setRem(evt);
            }).bind(self);
            tid = setTimeout(bindRem, 300);
        });

        //ios
        window.addEventListener('pageshow', function(evt) {
            if (evt.persisted) {
                clearTimeout(tid2);
                var bindRem = (function () {
                    setRem(evt);
                }).bind(self);
                tid2 = setTimeout(bindRem, 300);
            }
        }, false);
    }

    svp.setRem = setRem;
    svp.setViewport = setViewport;
    svp.scale = scale;
    svp.dpr = dpr;
    svp.rem = svp.rem || maxRem;

    docEl.setAttribute('data-dpr', dpr);
    docEl.setAttribute('data-scale', scale);
    docEl.setAttribute('data-design',psdWidth);
    docEl.setAttribute('data-rem',isRem);

    svp.rem2px = function(d) {
        var val = parseFloat(d) * svp.rem;

        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    };

    svp.px2rem = function(d) {
        var val = parseFloat(d) / svp.rem;

        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    };

    if (typeof define === "function") {
        define('base/rem',function(require, exports, module) {
            module.exports  = {
                setRem: svp.setRem,
                setViewport:setViewport,
                scale : scale,
                rem : svp.rem || maxRem,
                dpr : dpr
            };
        });
    }

}(window));