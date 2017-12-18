// Define and export
//支持设计模式：MVC，MVP，MVVM.

window.Bone  = window.Bone || {};
if(typeof _ == 'undefined '){
    if(window.seajs){
       require('underscore');
    }
    throw new Error('Bone Dependency underscore >=1.8.3');
}
var slice = Array.prototype.slice;

Bone.$ = $;
// Throw an error when a URL is needed, and none is supplied.
var urlError = function() {
    throw new Error('A "url" property or function must be specified');
};
var boneError = function(errorMsg) {
    if (_.isFunction(errorMsg)) {
        errorMsg();
    }else  if (_.isObject(errorMsg) ) {
        throw new Error(JSON.stringify(errorMsg));
    }else{
        throw new Error(''+errorMsg);
    }
};
// Wrap an optional error callback with a fallback error event.
var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
        if (error) error.call(options.context, model, resp, options);
        model.trigger('error', model, resp, options);
    };
};

var addMethod = Bone.addMethod = function(length, method, attribute) {
    switch (length) {
        case 1: return function() {
            return _[method](this[attribute]);
        };
        case 2: return function(value) {
            return _[method](this[attribute], value);
        };
        case 3: return function(iteratee, context) {
            return _[method](this[attribute], cb(iteratee, this), context);
        };
        case 4: return function(iteratee, defaultVal, context) {
            return _[method](this[attribute], cb(iteratee, this), defaultVal, context);
        };
        default: return function() {
            var args = slice.call(arguments);
            args.unshift(this[attribute]);
            return _[method].apply(_, args);
        };
    }
};

var addUnderscoreMethods = Bone.addUnderscoreMethods = function(Class, methods, attribute) {
    _.each(methods, function(length, method) {
        if (_[method]) Class.prototype[method] = Bone.addMethod(length, method, attribute);
    });
};

// Support `collection.sortBy('attr')` and `collection.findWhere({id: 1})`.
var cb = Bone.cb = function(iteratee, instance) {
    if (_.isFunction(iteratee)) return iteratee;
    if (_.isObject(iteratee) && !instance._isModel(iteratee)) return Bone.modelMatcher(iteratee);
    if (_.isString(iteratee)) return function(model) { return model.get(iteratee); };
    return iteratee;
};

var modelMatcher = Bone.modelMatcher = function(attrs) {
    var matcher = _.matches(attrs);
    return function(model) {
        return matcher(model.attributes);
    };
};

var attempt = Bone.attempt = function(obj, property, args) {
    // Return undefined unless obj
    // is not null or undefined
    if (obj == null) { return void 0; }
    var prop = obj[property];

    if (_.isFunction(prop)) {
        var length;
        if (_.isArray(args)) {
            length = args.length;
        } else {
            length = (args == null) ? 0 : -1;
        }
        switch (length) {
            case -1:
                return obj[property](args);
            case 0:
                return obj[property]();
            case 1:
                return obj[property](args[0]);
            case 2:
                return obj[property](args[0], args[1]);
            case 3:
                return obj[property](args[0], args[1], args[2]);
        }
        return prop.apply(obj, args);
    }
    return prop;
};

Bone.Computed = function() {
    var dependencies = _.initial(arguments);
    var fn = _.last(arguments);

    if (!_.every(dependencies, _.isString)) {
        throw new TypeError('Bone.Computed must be called with dependent keys.');
    }
    if (!_.isFunction(fn)) {
        throw new TypeError('Bone.Computed must be with a computing function as last parameter.');
    }

    fn._dependentKeys = dependencies;
    return fn;
};
 
function bindFromStrings(target, entity, evt, methods, actionName) {
    var methodNames = methods.split(/\s+/);

    _.each(methodNames, function (methodName) {
        var method = target[methodName];
        if (!method) {
            throw new Error('Method "' + methodName + '" was configured as an event handler, but does not exist.');
        } 
        target[actionName](entity, evt, method);
    });
}

// generic looping function
function iterateEvents(target, entity, bindings, actionName) {
    if (!entity || !bindings) {
        return;
    }
    if (!_.isObject(bindings)) {
        throw new Error( 'Bindings must be an object' );
    }
    _.each(bindings, function (method, evt) {
        if (_.isString(method)) {
            bindFromStrings(target, entity, evt, method, actionName);
            return;
        }
        target[actionName](entity, evt, method);
    });
}


function iterateReplies(target, channel, bindings, actionName) {
    if (!channel || !bindings) {
        return;
    }
    if (!_.isObject(bindings)) {
        throw new Error( 'Bindings must be an object.');
    }
    var normalizedRadioRequests = Bone.normalizeMethods.call(target, bindings);

    channel[actionName](normalizedRadioRequests, target);
};

Bone.normalizeMethods = function normalizeMethods(hash) {
    var _this = this;
    return _.reduce(hash, function (normalizedHash, method, name) {
        if (!_.isFunction(method)) {
            method = _this[method];
        }
        if (method) {
            normalizedHash[name] = method;
        }
        return normalizedHash;
    }, {});
};

Bone.bindEvents = function(entity, bindings) {
    iterateEvents(this, entity, bindings, 'listenTo');
    return this;
};

Bone.unbindEvents=function(entity, bindings) {
    iterateEvents(this, entity, bindings, 'stopListening');
    return this;
};


Bone.bindRequests=function(channel, bindings) {
    iterateReplies(this, channel, bindings, 'reply');
    return this;
};

Bone.unbindRequests=function(channel, bindings) {
    iterateReplies(this, channel, bindings, 'stopReplying');
    return this;
};

// Merge `keys` from `options` onto `this`
Bone.mergeOptions = function(options, keys) {
    if (!options) { return; }
    _.extend(this, _.pick(options, keys));
};

Bone.setOptions = function setOptions() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }
    this.options = _.extend.apply(_, [{}, _.result(this, 'options')].concat(args));
};

Bone.getOption = function(target, optionName) {
    if (!target || !optionName) { return; }
    if (target.options && (target.options[optionName] !== undefined)) {
        return target.options[optionName];
    } else {
        return target[optionName];
    }
};

Bone.proxyGetOption = function(optionName) {
    return Bone.getOption(this, optionName);
};

Bone._getValue = function(value, context, params) {
    if (_.isFunction(value)) {
        value = params ? value.apply(context, params) : value.call(context);
    }
    return value;
};
Bone._triggerMethod = (function() {
    // split the event name on the ":"
    var splitter = /(^|:)(\w)/gi;
    // take the event section ("section1:section2:section3")
    // and turn it in to uppercase name
    function getEventName(match, prefix, eventName) {
        return eventName.toUpperCase();
    }
    return function(context, event, args) {
        var noEventArg = arguments.length < 3;
        if (noEventArg) {
            args = event;
            event = args[0];
        }
        // get the method name from the event name
        var methodName = 'on' + event.replace(splitter, getEventName);
        var method = context[methodName];
        var result;
        // call the onMethodName if it exists
        if (_.isFunction(method)) {
            // pass all args, except the event name
            result = method.apply(context, noEventArg ? _.rest(args) : args);
        }

        // trigger the event, if a trigger method exists
        if (_.isFunction(context.trigger)) {
            if (noEventArg + args.length > 1) {
                context.trigger.apply(context, noEventArg ? args : [event].concat(_.drop(args, 0)));
            } else {
                context.trigger(event);
            }
        }
        return result;
    };
})();
 
Bone.triggerMethod = function(event) {
    return Bone._triggerMethod(this, arguments);
}; 

Bone.triggerMethodOn = function(context) {
    var fnc = _.isFunction(context.triggerMethod) ?
        context.triggerMethod :
        Bone.triggerMethod;
    return fnc.apply(context, _.rest(arguments));
};
Bone._setOptions= Bone.setOptions;
Bone.CommonMixin = {
    iterateEvents:iterateEvents,
    normalizeMethods: Bone.normalizeMethods,
    setOptions: Bone.setOptions,
    _setOptions: Bone.setOptions,
    mergeOptions: Bone.mergeOptions,
    getOption: Bone.getOption,
    proxyGetOption:Bone.proxyGetOption,
    bindEvents: Bone.bindEvents,
    unbindEvents: Bone.unbindEvents,
    triggerMethod: Bone.triggerMethod,
    triggerMethodOn: Bone.triggerMethodOn
};

Bone.RadioMixin = {
    _initRadio: function _initRadio() {
        var channelName = _.result(this, 'channelName');
        if (!channelName) {
            return;
        }
        /* istanbul ignore next */
        if (!Bone.Radio) {
            throw new Error('Bone Radio Missing');
        }
        var channel = this._channel = Bone.Radio.channel(channelName);
        var radioEvents = _.result(this, 'radioEvents');
        this.bindEvents(channel, radioEvents);
        var radioRequests = _.result(this, 'radioRequests');
        this.bindRequests(channel, radioRequests);
        this.on('destroy', this._destroyRadio);
    },
    _destroyRadio: function _destroyRadio() {
        this._channel.stopReplying(null, null, this);
    },
    getChannel: function getChannel() {
        return this._channel;
    },
    // Proxy `bindEvents`
    bindEvents: Bone.bindEvents,
    // Proxy `unbindEvents`
    unbindEvents: Bone.unbindEvents,
    // Proxy `bindRequests`
    bindRequests: Bone.bindRequests,
    // Proxy `unbindRequests`
    unbindRequests: Bone.unbindRequests
};


var extend = Bone.extend = function(protoProps, staticProps) {
    var parent = this;
    var child;
    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
    } else {
        child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent` constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;
    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);
    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;
    return child;
};
