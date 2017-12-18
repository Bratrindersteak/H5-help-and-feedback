import { default as vars } from './vars';
import { default as util } from './util';

    var encode = encodeURIComponent, decode = decodeURIComponent;
    var Cookie = {
        isEnabled: false,
        /**
         * @memberof Cookie
         * @summary 设置Cookie
         * @type {function}
         * @param {String} name 要设置的Cookie名称
         * @param {String} value 要设置的Cookie值
         * @param {Number} expire 过期时间，单位是小时
         * @param {String} domain 域，默认为本域
         */
        set: function (name, value, expire, domain) {
            var expires = '';

            if (0 !== expire) {
                var t = new Date();
                t.setTime(t.getTime() + (expire || 24) * 3600000);
                expires = ';expires=' + t.toGMTString();
            }
            var s = name + '=' + encode(value) + expires + ';path=/'
                + (domain ? (';domain=' + domain) : '');
            document.cookie = s;

            return true;
        },

        /**
         * @memberof Cookie
         * @summary 读取指定的Cookie
         * @type {function}
         * @param {String} name 要获取的Cookie名称
         * @return {String} 对应的Cookie值，如果不存在，返回{null}
         */
        get: function (name) {
            var arrCookie = document.cookie.split(';');
            for (var i = 0; i < arrCookie.length; i++) {
                var item = arrCookie[i];
                var index = item.indexOf('=');
                var cName = item.substr(0, index);
                var cValue = item.substr(index + 1);
                if (cName.trim() === name) {
                    if (name === 'SOHUSVP' || name === 'sohusvp') {
                        return cValue; //base64 value
                    } else {
                        return decode(cValue);
                    }
                }
            }

            return '';
        },

        /**
         * @memberof Cookie
         * @summary 删除指定的Cookie
         * @type {function}
         * @param {String} name 要获取的Cookie名称
         * @param {String} domain 域，默认为本域
         * @param {String} path 路径
         */
        del: function (name, domain, path) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1000 );
            document.cookie = name + '=; expires=' + exp.toGMTString() + ';' + (path ? ('path=' + path + '; ') : 'path=/; ')
                + (domain ? ('domain=' + domain + ';') : ('domain=;'));
        },
        test: function () {
            var testKey = '_c_t_';
            this.set(testKey, '1');
            this.isEnabled = ('1' === this.get(testKey));
            this.del(testKey);
            return this.isEnabled;
        },
        serialize: function (value) {
            return JSON.stringify(value);
        },
        deserialize: function (value) {
            if (typeof value !== 'string') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value || {};
            }
        },
        setSession: function (name, value) {
            try {
                if (!!window.sessionStorage) {
                    window.sessionStorage.setItem(name, this.serialize(value));
                }
            } catch (e) {
                this.set(name, this.serialize(value), 24);
            }
        },
        getSession: function (name) {
            var sRet = '';
            try {
                if (!!window.sessionStorage) {
                    sRet = this.deserialize(window.sessionStorage.getItem(name));
                }
            } catch (e) {
                sRet = this.deserialize(this.get(name));
            }
            return sRet;
        },

        _init : function () {
            var domain = document.domain || '127.0.0.1';
            var getUrlParam = function (p, u) {
                u = u || document.location.toString();
                var r,reg = new RegExp("(^|&|\\\\?)" + p + "=([^&]*)(&|$|#)");
                if (r = u.match(reg)) return r[2];
                return "";
            };
            var _mtvsrc = getUrlParam('src') || getUrlParam('SRC') || '';
            if (_mtvsrc) {
                Cookie.set('MTV_SRC', _mtvsrc, 86400, '.sohu.com');
                Cookie.set('MTV_SRC', _mtvsrc, 86400, domain);
            }
            /*  统计用的用户唯一ID */
            var cookieSUV   = Cookie.get('SUV') || '',
                cookieIPLOC = Cookie.get('IPLOC') || '';
            if (!cookieSUV || !cookieIPLOC) {
                var _suv = util.createUUID();

                //set IPLOC CN1100
                var _url =  vars.PROTOCOL +'pv.sohu.com/suv/' + _suv;
                util.loadScript(_url,function () {
                    console.log("suv:"+_suv+"ck suv:"+Cookie.get('SUV')+" | IPLOC :" +Cookie.get('IPLOC'));
                    Cookie.set('SUV', _suv, 500000, '.sohu.com');  //覆盖suv
                    var H5UID = Cookie.get('H5UID') || '';
                    if (!H5UID) {
                        Cookie.set('H5UID', _suv, 500000, domain);
                    }
                    cookieSUV = Cookie.get('SUV') || '';
                });

            }
            return cookieSUV;
        }
    };

export default Cookie;