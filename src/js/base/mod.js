/*
 * 没有引用seajs时，实现模块定义和加载，遵循CMD标准，精简版seajs,适合所有js都是合并一块时候用。
 * 解决问题：
 * 1、模块定义不立即执行;
 * 2、模块化开发,整体打包；
 * 使用 require加载会预执行
 * 模块名前加-号，表示预执行，如：define("-base/vars", function(vars)
 * 唯一全局模块定义方法：
 *  define("base/vars", ["modules1", "modules2"], function(require, exports, module) {
 *  var x1 = require('base/x1'); var VARS={}; //you xyz code;  module.exports = VARS;//导出对象
 *  });
 *有三个参数组成：
 *第1参数：模块名称，必选，建议使用文件路径的结构命名都小写；
 *第2参数：依赖模块，选填；
 *第3参数：模块实例；
 其中模块实例中有三个参数，都是非必填，实际exports和module.exports相同，三个参数使用举例：
 var event = require("core.event"); //require加载模块
 exports.show = function(){}; // 导出一个function
 module.exports = {'value':'hello', 'name':'google'} //导出object
 return {'name':'google'} //返回object
 seajs.require预执行方式引入模块；
 seajs.use整个项目中，最好只调用一次，项目入口；
 */
window.svp =window.svp||{};
(function(global) {
    if (global.seajs) { return; }
    if (global.define && global.require && typeof global.define === 'function') return;
    var mod = {version: "2.2.0-lite"};

    var _cid = 0;
    function cid() {
        return _cid++
    }
    var mods = mod.mods = {};
    var data = mod.data = {};

    function isType(type) {
        return function(obj) {
            return {}.toString.call(obj) === "[object " + type + "]";
        };
    }

    var isArray = Array.isArray || isType("Array");
    var isFunction = isType("Function");
    var isString = isType("String");
    var isObject = isType("Object");

    var SLASH_RE = /\\\\/g,
        IDEXEC_RE = /^\-([\w\.\/\-]*)$/;

    var DOT_RE = /\w+\.\//g;
    var DOUBLE_DOT_RE = /\w+\.\w+\.\.\//;

    function parsePaths(id, path) {
        if (!/^\./.test(id)) return id;
        path = (path+id).replace(DOT_RE, "");
        while (path.match(DOUBLE_DOT_RE)) {
            path = path.replace(DOUBLE_DOT_RE, "");
        }
        return path;
    }

    function parseAlias(id) {
        var alias = data.alias;
        return alias && isString(alias[id]) ? alias[id] : id;
    }

    function parseId(id, path) {
        if (!id) return "";
        id = parseAlias(id);
        id = parsePaths(id, path);
        return id;
    }

    function exec(meta) {
        if(meta === undefined) return {};
        if (meta.exports !== null) return meta.exports;
        for(var key in meta.deps){
            exec(mods[meta.deps[key].id]);
        }
        function require(id) {
            id = parseId(id, meta.id);
            if (!mods[id]) throw new Error(id +' mod not found.');
            return exec(mods[id]);
        }
        require.async = require;
        var factory = meta.factory;
        var exports = isFunction(factory) ? factory(require, meta.exports = {}, meta) :factory;

        if (exports === undefined) {
            exports = meta.exports;
        }
        meta.exports = exports;
        delete meta.factory;
        return exports;
    }

    mod.define = function(id, deps, factory) {
        var argsLen = arguments.length;
        // define(factory)
        if (argsLen === 1) {
            factory = id;
            id = undefined;
        }
        else if (argsLen === 2) {
            factory = deps;
            // define(deps, factory)
            if (isArray(id)) {
                deps = id;
                id = undefined
            }
            // define(id, factory)
            else {
                deps = []
            }
        }
        if (IDEXEC_RE.test(id)) id = RegExp.$1;

        var meta = {
            id: id,
            deps: deps,
            factory: factory,
            exports: null
        };
        mods[id] = meta; 
        RegExp.$1 == id && mod.exec(id, true); //模块名前加-号，表示预执行
    };
     
    mod.exec = function(id) {
        var ept = exec(mods[id]);
        return ept;
    };

    mod.use = function(ids, callback) {
        if (!isArray(ids)) ids = [ids];
        var exports = [];
        for (var i = 0; i < ids.length; i++) {
            exports[i] = mod.exec(ids[i]);
        }
        if (callback) { callback.apply(global, exports); }
    };

    mod.config = function(configData) {
        for (var key in configData) {
            var curr = configData[key];
            var prev = data[key];

            if (prev && isObject(prev)) {
                for (var k in curr) {
                    prev[k] = curr[k];
                }
            }  else {
                if (isArray(prev)) {
                    curr = prev.concat(curr);
                }
                data[key] = curr;
            }
        }
        return mod;
    };

    mod.require = function(id) {
        return mod.exec(id);
    };

    // public API

    global.define    = mod.define;   // 定义一个模块
    global.require   = mod.require;  // 加载依赖模块
    global.use       = mod.use;      // 使用模块入口
    global.mod       = mod;

})(window);