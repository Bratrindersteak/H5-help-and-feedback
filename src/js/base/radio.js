// Radio
//----------------------
// 消息广播订阅,用来在应用模块和子模块间通信 ;pubsub
// so see https://github.com/marionettejs/backbone.radio
/*
* var userChannel = Bone.Radio.channel('user');
* 
*  userChannel.on('some:event', function() {
*  console.log('An event has happened!');
* });
* userChannel.trigger('some:event');
*
* userChannel.reply('some:request', 'food is good');
* userChannel.request('some:request');
*/
(function () {
  var Radio = Bone.Radio = {};
  'use strict';
  var babelHelpers = {};
  babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ?
      function (obj) {
        return typeof obj;
      } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  Radio.DEBUG = false;
  // Format debug text.
  Radio._debugText = function (warning, eventName, channelName) {
    return warning + (channelName ? ' on the ' + channelName + ' channel' : '') + ': "' + eventName + '"';
  };
  Radio.debugLog = function (warning, eventName, channelName) {
    if (Radio.DEBUG && console && console.warn) {
      console.warn(Radio._debugText(warning, eventName, channelName));
    }
  };
  var eventSplitter = /\s+/;

  // An internal method used to handle Radio's method overloading for Requests.
  // It's borrowed from Bone.Events. It differs from Bone's overload
  // API (which is used in Bone.Events) in that it doesn't support space-separated
  // event names.
  Radio._eventsApi = function (obj, action, name, rest) {
    if (!name) {
      return false;
    }
    var results = {};
    // Handle event maps.
    if ((typeof name === 'undefined' ? 'undefined' : babelHelpers.typeof(name)) === 'object') {
      for (var key in name) {
        var result = obj[action].apply(obj, [key, name[key]].concat(rest));
        eventSplitter.test(key) ? _.extend(results, result) : results[key] = result;
      }
      return results;
    }
    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        results[names[i]] = obj[action].apply(obj, [names[i]].concat(rest));
      }
      return results;
    }
    return false;
  };
  // An optimized way to execute callbacks.
  Radio._callHandler = function (callback, context, args) {
    var a1 = args[0],
        a2 = args[1],
        a3 = args[2];
    switch (args.length) {
      case 0:
        return callback.call(context);
      case 1:
        return callback.call(context, a1);
      case 2:
        return callback.call(context, a1, a2);
      case 3:
        return callback.call(context, a1, a2, a3);
      default:
        return callback.apply(context, args);
    }
  };
  // A helper used by `off` methods to the handler from the store
  function removeHandler(store, name, callback, context) {
    var event = store[name];
    if ((!callback || callback === event.callback || callback === event.callback._callback) && (!context || context === event.context)) {
      delete store[name];
      return true;
    }
  }
  function removeHandlers(store, name, callback, context) {
    store || (store = {});
    var names = name ? [name] : _.keys(store);
    var matched = false;

    for (var i = 0, length = names.length; i < length; i++) {
      name = names[i];

      // If there's no event by this name, log it and continue
      // with the loop
      if (!store[name]) {
        continue;
      }
      if (removeHandler(store, name, callback, context)) {
        matched = true;
      }
    }
    return matched;
  }

 
  var _logs = {};
  function _partial(channelName) {
    return _logs[channelName] || (_logs[channelName] = _.bind(Radio.log, Radio, channelName));
  }

  _.extend(Radio, {
    // Log information about the channel and event
    log: function log(channelName, eventName) {
      if (typeof console === 'undefined') {
        return;
      }
      var args = _.toArray(arguments).slice(2);
      console.log('[' + channelName + '] "' + eventName + '"', args);
    },

    // Logs all events on this channel to the console. It sets an
    // internal value on the channel telling it we're listening,
    // then sets a listener on the Bone.Events
    tuneIn: function tuneIn(channelName) {
      var channel = Radio.channel(channelName);
      channel._tunedIn = true;
      channel.on('all', _partial(channelName));
      return this;
    },

    // Stop logging all of the activities on this channel to the console
    tuneOut: function tuneOut(channelName) {
      var channel = Radio.channel(channelName);
      channel._tunedIn = false;
      channel.off('all', _partial(channelName));
      delete _logs[channelName];
      return this;
    }
  });
 
  function makeCallback(callback) {
    return _.isFunction(callback) ? callback : function () {
      return callback;
    };
  }

  Radio.Requests = {

    // Make a request
    request: function request(name) {
      var args = _.toArray(arguments).slice(1);
      var results = Radio._eventsApi(this, 'request', name, args);
      if (results) {
        return results;
      }
      var channelName = this.channelName;
      var requests = this._requests;

      // Check if we should log the request, and if so, do it
      if (channelName && this._tunedIn) {
        Radio.log.apply(this, [channelName, name].concat(args));
      }

      // If the request isn't handled, log it in DEBUG mode and exit
      if (requests && (requests[name] || requests['default'])) {
        var handler = requests[name] || requests['default'];
        args = requests[name] ? args : arguments;
        return Radio._callHandler(handler.callback, handler.context, args);
      } else {
        Radio.debugLog('An unhandled request was fired', name, channelName);
      }
    },

    // Set up a handler for a request
    reply: function reply(name, callback, context) {
      if (Radio._eventsApi(this, 'reply', name, [callback, context])) {
        return this;
      }

      this._requests || (this._requests = {});

      if (this._requests[name]) {
        Radio.debugLog('A request was overwritten', name, this.channelName);
      }

      this._requests[name] = {
        callback: makeCallback(callback),
        context: context || this
      };

      return this;
    },

    // Set up a handler that can only be requested once
    replyOnce: function replyOnce(name, callback, context) {
      if (Radio._eventsApi(this, 'replyOnce', name, [callback, context])) {
        return this;
      }

      var self = this;

      var once = _.once(function () {
        self.stopReplying(name);
        return makeCallback(callback).apply(this, arguments);
      });

      return this.reply(name, once, context);
    },

    // Remove handler(s)
    stopReplying: function stopReplying(name, callback, context) {
      if (Radio._eventsApi(this, 'stopReplying', name)) {
        return this;
      }

      // Remove everything if there are no arguments passed
      if (!name && !callback && !context) {
        delete this._requests;
      } else if (!removeHandlers(this._requests, name, callback, context)) {
        Radio.debugLog('Attempted to remove the unregistered request', name, this.channelName);
      }

      return this;
    }
  };
 
  Radio._channels = {};
  Radio._defaultChannelName = '_defaultName_';
  Radio.channel = function (channelName) {
    if (!channelName) {
      console.info("You must provide a name for the channel. is default channelName : "+Radio._defaultChannelName);
    }
    channelName=channelName||Radio._defaultChannelName; 
    if (Radio._channels[channelName]) {
      return Radio._channels[channelName];
    } else {
      return Radio._channels[channelName] = new Radio.Channel(channelName);
    }
  }; 
  
  Radio.Channel = function (channelName) {
    channelName=channelName||Radio._defaultChannelName;
    this.channelName = channelName;
  };

  _.extend(Radio.Channel.prototype, Bone.Events, Radio.Requests, { 
    reset: function reset() {
      this.off();
      this.stopListening();
      this.stopReplying();
      return this;
    }
  });
 
  var channel;
  var args;
  var systems = [Bone.Events, Radio.Requests];
  _.each(systems, function (system) {
    _.each(system, function (method, methodName) {
      Radio[methodName] = function (channelName) {
        args = _.toArray(arguments).slice(1);
        channel = this.channel(channelName);
        return channel[methodName].apply(channel, args);
      };
    });
  });

  Radio.reset = function (channelName) {
    var channels = !channelName ? this._channels : [this._channels[channelName]];
    _.each(channels, function (channel) {
      channel.reset();
    });
  };
  
}(this));
 
