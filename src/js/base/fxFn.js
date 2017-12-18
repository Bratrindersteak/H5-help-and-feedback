//     Zepto|jQuery.Extend.js 实现了通用fn方法。 

;(function ($, undefined) {
	 /**
	  *  highlight
	  *  @file 实现了通用fn方法。
	  *  @name Highlight
	  *  @desc 点击高亮效果
	  *  @import zepto|jquery.js
	  */ 
    var $doc = $( document ),
        $el,    // 当前按下的元素
        timer;    // 考虑到滚动操作时不能高亮，所以用到了100ms延时
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    // 负责移除className.
    function dismiss() {
        var cls = $el.attr( 'hl-cls' );
        clearTimeout( timer );
        $el.removeClass( cls ).removeAttr( 'hl-cls' );
        $el = null;
        $doc.off( 'touchend touchmove touchcancel', dismiss );
    }

    /**
     * @name highlight
     * @desc 禁用掉系统的高亮，当手指移动到元素上时添加指定class，手指移开时，移除该class.
     * 当不传入className是，此操作将解除事件绑定。
     *
     * 此方法支持传入selector, 此方式将用到事件代理，允许dom后加载。
     * @grammar  highlight(className, selector )   ⇒ self
     * @grammar  highlight(className )   ⇒ self
     * @grammar  highlight()   ⇒ self
     * @example var div = $('div');
     * div.highlight('div-hover');
     *
     * $('a').highlight();// 把所有a的自带的高亮效果去掉。
     */
    $.fn.highlight = function( className, selector ) {
        return this.each(function() {
            var $this = $( this );
            $this.css( '-webkit-tap-highlight-color', 'rgba(255,255,255,0)' )
                .off( 'touchstart.hl' );

            className && $this.on( 'touchstart.hl', function( e ) {
                var match;

                $el = selector ? (match = $( e.target ).closest( selector,
                    this )) && match.length && match : $this;

                // selctor可能找不到元素。
                if ( $el ) {
                    $el.attr( 'hl-cls', className );
                    timer = setTimeout( function() {
                        $el.addClass( className );
                    }, 100 );
                    $doc.on( 'touchend touchmove touchcancel', dismiss );
                }
            } );
        });
    };

    /**
	 * @file 减少对方法、事件的执行频率，多次调用，在指定的时间内只会执行一次
     * @method $.fn.throttle
     * @grammar $.fn.throttle(delay, fn) ⇒ function
     * @param {Number} [delay=250] 延时时间
     * @param {Function} fn 被稀释的方法
     * @param {Boolean} [debounce_mode=false] 是否开启防震动模式, true:start, false:end
     * @example var touchmoveHander = function(){
     *     //....
     * }
     * //绑定事件
     * $(document).bind('touchmove', $.fn.throttle(250, touchmoveHander)); //频繁滚动，每250ms，执行一次touchmoveHandler
     *
     * //解绑事件
     * $(document).unbind('touchmove', touchmoveHander);//注意这里面unbind还是touchmoveHander,而不是$.fn.throttle返回的function, 当然unbind那个也是一样的效果
     *
     */
    $.fn.throttle = function(delay, fn, debounce_mode) {
        var last = 0,
            timeId; 
        if (typeof fn !== 'function') {
            debounce_mode = fn;
            fn = delay;
            delay = 250;
        }

        function wrapper() {
            var that = this,
                period = new Date().getTime() - last,
                args = arguments;

            function exec() {
                last = new Date().getTime();
                fn.apply(that, args);
            };

            function clear() {
                timeId = undefined;
            };

            if (debounce_mode && !timeId) {
                // debounce模式 && 第一次调用
                exec();
            }

            timeId && clearTimeout(timeId);
            if (debounce_mode === undefined && period > delay) {
                // throttle, 执行到了delay时间
                exec();
            } else {
                // debounce, 如果是start就clearTimeout
                timeId = setTimeout(debounce_mode ? clear : exec, debounce_mode === undefined ? delay - period : delay);
            }
        }
        // for event bind | unbind
        wrapper._zid = fn._zid = fn._zid || $.proxy(fn)._zid;
        return wrapper;
     };

    /**
     * @desc 减少执行频率, 在指定的时间内, 多次调用，只会执行一次。
     * **options:**
     * - ***delay***: 延时时间
     * - ***fn***: 被稀释的方法
     * - ***t***: 指定是在开始处执行，还是结束是执行, true:start, false:end
 
     * @grammar $.fn.debounce(delay, fn[, at_begin]) ⇒ function
     * @name $.fn.debounce
     * @example var touchmoveHander = function(){
     *     //....
     * }
     * //绑定事件
     * $(document).bind('touchmove', $.fn.debounce(250, touchmoveHander));//频繁滚动，只要间隔时间不大于250ms, 在一系列移动后，只会执行一次
     *
     * //解绑事件
     * $(document).unbind('touchmove', touchmoveHander);//注意这里面unbind还是touchmoveHander,而不是$.fn.debounce返回的function, 当然unbind那个也是一样的效果
     */
    $.fn.debounce=function(delay, fn, t) {
        return fn === undefined ? $.fn.throttle(250, delay, false) :
            $.fn.throttle(delay, fn, t === undefined ? false : t !== false);
    };

     /**
     * 解析模版str。当data未传入时返回编译结果函数；当需要多次解析时，建议保存编译结果函数，然后调用此函数来得到结果。
     * 
     * @method $.fn.parseTpl 
     * @param {String} tplstr 模板
     * @param {Object} data 数据
     * @example var str = "<p><%=name%></p>",
     * obj = {name: 'ajean'};
     * console.log($.tpl(tplstr, data)); // => <p>ajean</p>
     */

    // 解析模版2. $.tpl(tpl,data)
    $.tpl = $.fn.parseTpl = function (str, data, env) {
        // 判断str参数，如str为script标签的id，则取该标签的innerHTML，再递归调用自身
        // 如str为HTML文本，则分析文本并构造渲染函数
        var fn = !/[^\w\-\.:]/.test(str)
            ? _private.cache[str] = _private.cache[str] || this.get(document.getElementById(str).innerHTML)
            : function (data, env) {
            var i, variable = [], value = []; // variable数组存放变量名，对应data结构的成员变量；value数组存放各变量的值
            for (i in data) {
                variable.push(i);
                value.push(data[i]);
            }
            return (new Function(variable, fn.code))
                .apply(env || data, value); // 此处的new Function是由下面fn.code产生的渲染函数；执行后即返回渲染结果HTML
        };
        fn.code = fn.code || "var $parts=[]; $parts.push('"
            + str
                .replace(/\\/g, '\\\\') // 处理模板中的\转义
                .replace(/[\r\t\n]/g, " ") // 去掉换行符和tab符，将模板合并为一行
                .split("<%").join("\t") // 将模板左标签<%替换为tab，起到分割作用
                .replace(/(^|%>)[^\t]*/g, function(str) { return str.replace(/'/g, "\\'"); }) // 将模板中文本部分的单引号替换为\'
                .replace(/\t=(.*?)%>/g, "',$1,'") // 将模板中<%= %>的直接数据引用（无逻辑代码）与两侧的文本用'和,隔开，同时去掉了左标签产生的tab符
                .split("\t").join("');") // 将tab符（上面替换左标签产生）替换为'); 由于上一步已经把<%=产生的tab符去掉，因此这里实际替换的只有逻辑代码的左标签
                .split("%>").join("$parts.push('") // 把剩下的右标签%>（逻辑代码的）替换为"$parts.push('"
            + "'); return $parts.join('');"; // 最后得到的就是一段JS代码，保留模板中的逻辑，并依次把模板中的常量和变量压入$parts数组

        return data ? fn(data, env) : fn; // 如果传入了数据，则直接返回渲染结果HTML文本，否则返回一个渲染函数
    };

        /**
         * @namespace $
         * @property {function} oriHide                   - 显示dom元素
         * @desc zepto|jquery中的show hide已被重写，这里还原原先的show hide方法
         */
        $.fn.oriShow = $.oriShow = function() {
            this.css({display: 'block'});
            return this;
        };

        /**
         * @namespace $
         * @property {function} oriHide                   - 隐藏dom元素
         * @desc zepto|jquery中的show hide已被重写，这里还原原先的show hide方法
         */
        $.fn.oriHide = $.oriHide = function() {
            this.css({display: 'none'});
            return this;
        };

        $.htmlLog= function (param1, param2) {
            if ($('#js_htmlLog').length === 0) {
                $('body').append($('<div id="js_htmlLog" style="height: 200px;overflow: scroll;"></div>'));
            }
            var arr = [];
            if (!$.isUndefined(param1)) {
                arr.push('<span>' + param1 + '</span>');
            }

            if (!$.isUndefined(param2)) {
                arr.push('<span>' + param2 + '</span>');
            }
            $('#js_htmlLog').prepend(arr.join(' ') + '<br>');
        };


        $.blankFun= function () {};
          

        $.isString = function (val) {
            return $.type(val) === 'string';
        }
        $.isUndefined= function (val) {
            return typeof val === 'undefined';
        };

        $.isNumber= function (val) {
            return $.type(val) === 'number';
        };
        $.isEmpty=function (obj){
            if (obj == null) return true; 
            if (obj.length > 0)    return false;
            if (obj.length === 0)  return true;
            for (var key in obj) {
              if (hasOwnProperty.call(obj, key) || obj[key] !== null)  return false; 
            }  
            return true; 
        };

          
        $.isScript = function ( filename ) {
            filename = filename || '';
            return !!/\.js(?=[\?#]|$)/i.exec( filename );
        };

        $.isCss  = function ( filename ) {
            filename = filename || '';
            return !!/\.css(?=[\?#]|$)/i.exec( filename );
        };
        $.isRegExp = function ( o ) {
            return o &&  Object.prototype.toString.call( o ) === '[object RegExp]';
        },
        $.now= function () { return new Date().getTime(); };
        $.nowDataString = function() {
            var dt = new Date();
            var dm = String((dt.getMonth() + 1) >= 12 ? 12 : (dt.getMonth() + 1));
            if (dm.length < 2) {
                dm = '0' + dm;
            }
            var dd = String(dt.getDate());
            if (dd.length < 2) {
                dd = '0' + dd;
            }
            var dh = String(dt.getHours());
            if (dh.length < 2) {
                dh = '0' + dh;
            }
            var dmi = String(dt.getMinutes());
            if (dmi.length < 2) {
                dmi = '0' + dmi;
            }
            var dse = String(dt.getSeconds());
            if (dse.length < 2) {
                dse = '0' + dse;
            }
            var dtstr = " " + dt.getFullYear() + '' + dm + '' + dd + ' ' + dh + ':' + dmi + ':' + dse;
            return dtstr;
        };
        $.getISOTimeFormat= function () {
            var date = new Date(),
              y = date.getFullYear(),
              m = date.getMonth() + 1,
              d = date.getDate(),
              h = date.getHours(),
              M = date.getMinutes(),
              s = date.getSeconds();
            
            return [[y, m < 10 ? "0" + m : m, d < 10 ? "0" + d : d].join("-"), [h < 10 ? "0" + h : h, M < 10 ? "0" + M : M, s < 10 ? "0" + s : s].join(":")].join(" ");
        };
        
        $.formatSeconds= function (seconds) {
            seconds = parseInt(seconds);
            var M = parseInt(seconds / 60),
                h = M >= 60 ? parseInt(M / 60) : 0,
                s = seconds % 60,
                str = "";
            M >= 60 && (M = M % 60);
            if (h > 0) {
                str += h < 10 ? "0" + h : h;
                str += ":";
            }
            str += M < 10 ? "0" + M : M;
            str += ":";
            str += s < 10 ? "0" + s : s;
            return str;
        };
        $.getHost= function () {
            var _host = window.location.hostname || window.location.host,
                _sarray = location.host.split(".");
            if (_sarray.length > 1) {
                _host = _sarray.slice(_sarray.length - 2).join(".");
            }
            return _host;
        };
        $.getUrlParam=function (p, u) {
            u = u || document.location.toString();
            var reg = new RegExp("(^|&|\\\\?)" + p + "=([^&]*)(&|$|#)"),
                r = null;
            if (r = u.match(reg)) return r[2];
            return "";
        };

        $._SPECIAL_HTML_CHARS = /[&<>"'`]/g;
        $.strReplace  = function (s, regexp, callback) {
            return s === undefined ? 'undefined'
                : s === null ? 'null'
                : s.toString().replace(regexp, callback);
        };
        $.filterXSS=function (str) {
            if (!$.isString(str)) return str;
            return $.strReplace(str, $._SPECIAL_HTML_CHARS, function (m) {
                return m === '&'? '&amp;'
                    : m === '<' ? '&lt;'
                    : m === '>' ? '&gt;'
                    : m === '"' ? '&quot;'
                    : m === "'" ? '&apos;'
                    : /*m === '`'*/ '&#96;';
            });
        };
        //32 guid
        $.createGUID = function (len) {
            len = len || 32;
            var guid = "";
            for (var i = 1; i <= len; i++) {
                var n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
            }
            return guid; 
        };

        $.formatSize= function (size) {
            var s = "" + size;
            if (s.indexOf("%") > 0) return s;
            if (s.indexOf("px") > 0) return s;
            if (/^\d+$/.test(s)) return s + "px";
            return s;
        };

        $.isTrue=function (v) {
           return (!!v);
        };


        $.getScript = function(url, callback,cbOpts) {
            var head = document.getElementsByTagName('head')[0] || document.body,
                script = document.createElement('script'),
                done = false;
            script.src = url;
            script.onload = script.onreadystatechange = function() {
                if (!done && (!this.readyState || this.readyState !== 'loading')) {
                    done = true;
                    if (callback) callback.apply(null, cbOpts || []);
                    script.onload = script.onreadystatechange = null;
                    head.removeChild(script);
                }
            };
            head.appendChild(script);
        };

        //配合 ui/anima.less
       $.animShow = function(el) {
            var wrapper = ( typeof el == 'string' ? $(el)[0] : el ) ||'body';
            //添加动画属性
            $(wrapper).find('[data-animation]').each(function (index, element) {
                var $element = $(element),
                    $animation = $element.attr('data-animation') || '';
                if (!$element.hasClass('animated')) {
                    $element.addClass('animated')
                }
                if (!$element.hasClass($animation)) {
                    $element.addClass($animation)
                }

                $element.show();
            });
         };

        $.animHide  = function(el) {
            var wrapper = ( typeof el == 'string' ? $(el)[0] : el ) ||'body';
            $(wrapper).find('[data-animation]').each(function(index, element){
                var $element    = $(element),
                    $animation  = $element.attr('data-animation')||'' ;
                if($element.hasClass($animation)){
                    $element.removeClass($animation)
                }
                $element.hide();
            });
        }

})(window.Zepto || window.jQuery);
