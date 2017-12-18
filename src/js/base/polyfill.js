(function (global) {

// es5 class polyfill
if (typeof Object.create != 'function') {
    //Object.create(prototype, descriptors)
    Object.create = (function() {
        function Temp() {}
        var hasOwn = Object.prototype.hasOwnProperty;
        return function (O) {
            if (typeof O != 'object') {
                throw TypeError('Object prototype may only be an Object or null');
            }
            Temp.prototype = O;
            var obj = new Temp();
            Temp.prototype = null;
            if (arguments.length > 1) {
                var Properties = Object(arguments[1]);
                for (var prop in Properties) {
                    if (hasOwn.call(Properties, prop)) {
                        obj[prop] = Properties[prop];
                    }
                }
            }
            return obj;
        };
    })();
}
if (typeof Object.assign != 'function') {
    Object.assign = Bone.extend;
}
function proxySuper(superFn, fn) {
    return function() {
        var tmp = this._super;
        this._super = superFn;
        var ret = fn.apply(this, arguments);
        this._super = tmp;

        return ret;
    }
}
if (typeof Class != 'function') {
    window.Class = function Class(){ };
    Class.extend = function (protoProps) {
        var parent = this, _super = parent.prototype, child;
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = proxySuper(parent, protoProps.constructor);
            delete protoProps.constructor; // remove constructor
        } else {
            child = function () {
                parent.apply(this, arguments);
            };
        }

        var prototype = Object.create(parent.prototype, {
            constructor: {
                value: child,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });

        for (var name in protoProps) {
            prototype[name] = _.isFunction(protoProps[name]) && _.isFunction(_super[name]) && /\b_super\b/.test(protoProps[name])
                ? proxySuper(_super[name], protoProps[name]) : protoProps[name];
        }
        child.prototype = prototype;
        child.extend = Class.extend;
        return child;
    };
}

//如果浏览器不支持String原生trim的方法，模拟一个
if (!String.prototype.hasOwnProperty('trim')) {
    String.prototype.trim = function () {
        return this.replace(/^(\s|\r|\n|\r\n)*|(\s|\r|\n|\r\n)*$/g, '');
    };
}
//如果浏览器不支持Function原生bind的方法，模拟一个
if (!Function.prototype.hasOwnProperty('bind')) {
    Function.prototype.bind = function (context) {
        var fn = this,
            args = arguments.length > 1 ? Array.slice(arguments, 1) : null;
        return function () {
            return fn.apply(context || this, args);
        };
    };
}
}(window));