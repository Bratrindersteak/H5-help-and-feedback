/**
 * http://tv.sohu.com/upload/touch/js/svp.baselib.min.20150214.js
 * http://tv.sohu.com/upload/touch/js/PassportSC.min.20150214.js
 * old ppjs,http://tv.sohu.com/upload/jq_plugin/passport.js
 */
/**
 *   @description: passport操作类
 *   @version    : 1.0.3
 *   @update-log :
 *                 1.0.1 - 20150325 陈  龙 passport操作类
 *                 1.0.2 - 20160304 陈  龙 将codec中方法base64decode更名为decodeUtf8to16Data64
 *                 1.0.3 - 20160519 陈  龙 将url中的http://转换为vars.PROTOCOL
 *
 */
define('base/passport',
    ['base/util','base/cookie','base/vars','base/codec'],
    function(require, exports, module) {


        'use strict';

        /**
         * @module base.passport
         * @namespace Passport
         * @property {function}  initPassport             - 初始化passport业务
         * @property {function}  getPassport              - 获取userid
         * @property {function}  getUid                   - 获取uid
         * @property {function}  getUUID                  - 获取uuid
         * @property {function}  getQname                 - 获取uniqname
         *
         * @example
         *   var Passport = require('base.passport');
         *   Passport.getUid();
         */

        var $= svp.$ || window.Zepto,

            Util = require('base/util'),
            Cookie = require('base/cookie'),
            vars = require('base/vars'),
            codec = require('base/codec');
        var PROTOCOL = ('https:' === document.location.protocol) ? 'https://' : 'http://';
        var ppjs = PROTOCOL+'m.tv.sohu.com/upload/touch/js/PassportSC.min.20150214.js';


        /**
         * 从Cookie中获取用户Passport相关参数，Cookie中的参数是编码过的，所以此文件主要是做解码操作
         * modify 20140426
         */
        var Passport = (function () {

            var cookieData = {},
                lastPassportCookie,
                getPassportCookie = function () {
                    var cookies = ['ppinf', 'ppinfo', 'passport'],
                        i,
                        l,
                        passportCookie;

                    for (i = 0, l = cookies.length; i < l; i++) {
                        passportCookie = (new RegExp("\\b" + cookies[i] + "\\b=(.*?)(?:$|;)")).exec(document.cookie);

                        if (passportCookie && passportCookie.length) {
                            passportCookie = passportCookie[1];

                            break;
                        }
                    }

                    return passportCookie;
                },

                decodeData = function (str) {
                    var result = '';

                    try {
                        var pparr = decodeURIComponent(str).split('|')||[];

                        if (pparr[0] === '1' || pparr[0] === '2') {
                            result = codec.ppDecode(pparr[3]);
                        }else{
                            result =  codec.decodeUtf8to16Data64(str);
                        }

                    } catch (e) {}

                    return result;
                },

                getKeyValueData = function (str) {
                    var result = {},
                        i,
                        l,
                        item;

                    str = (str || '').split('|');
                    for (i = 0, l = str.length; i < l; i++) {
                        item = str[i].split(':');
                        if (item.length > 1) {
                            result[item[0]] = item[2];
                        }
                    }
                    return result;
                },

                getData = function () {
                    var passportCookie = getPassportCookie(),
                        data = cookieData;

                    if (lastPassportCookie !== passportCookie) {
                        lastPassportCookie = passportCookie;
                        data = getKeyValueData(decodeData(passportCookie));
                        cookieData = data;
                    }else{
                        if( data.userid == 'undefined' ){
                            data = getKeyValueData(decodeData(passportCookie));
                            cookieData = data;
                        }
                    }

                    return data;
                };

            var initPassport = function (s) {
                s = s || ppjs;

                if ('undefined' === typeof PassportSC) {
                    Util.loadScript(s);
                }
            };

            return {
                /**
                 * @memberof Passport
                 * @summary 初始化passport业务
                 * @type {function}
                 * @param {string} url                        - (可选参数)导入指定的url,不传，去默认地址
                 */
                initPassport: initPassport,
                getPassportCookie:getPassportCookie,
                decodeData:decodeData,
                getKeyValueData:getKeyValueData,
                getData:getData,
                /**
                 * @memberof Passport
                 * @summary 获取userid
                 * @type {function}
                 * @return {string}                           - 拿到的userid
                 */
                getPassport: function () {
                    return getData()['userid']||decodeURIComponent(Cookie.get('ppuserid')) || '';
                },

                /**
                 * @memberof Passport
                 * @summary 获取uid
                 * @type {function}
                 * @return {string}                           - 拿到的uid
                 */
                getUid: function () {

                    return getData()['uid'] || '';
                },

                /**
                 * @memberof Passport
                 * @summary 获取uuid
                 * @type {function}
                 * @return {string}                           - 拿到的uuid
                 */
                getUUID: function () {

                    return getData()['uuid'] || Cookie.get('SUV') || '';
                },

                /**
                 * @memberof Passport
                 * @summary 获取uniqname
                 * @type {function}
                 * @return {string}                           - 拿到的uniqname
                 */
                getQname: function () {

                    return getData()['uniqname'] || '';
                }
            };
        })();


        svp.Passport = Passport;
        module.exports = Passport;



    });