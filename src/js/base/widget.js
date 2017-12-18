 /**
 *  UI组件基本类, $.widget
 */ 
(function(root, factory ) {
    var widget = factory(root, root._, root.$ ,root.Bone); 
}(this,function(root, _, $,Bone) {
    root.ui = $.ui =  {};
    if(typeof $ == 'undefined'){
        throw new Error( 'widget ui need jquery or zepto' );
    }
    if(typeof _ == 'undefined'){
        throw new Error( 'widget ui need underscore' );
    }
    $.error = function( msg ) {
        throw new Error( msg );
    };
    $.noop = $.noop||function() {};
    $.data = $.data||$.fn.data;

    $.ui._ = _; //underscore
    $.ui.Events = Bone.Events; //underscore

    var slice = Array.prototype.slice;
    var eventSplitter = /\s+/;
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;

    $.extend( $.expr[ ":" ], {
        data: $.expr.createPseudo ?
            $.expr.createPseudo( function( dataName ) {
                return function( elem ) {
                    return !!$.data( elem, dataName );
                };
            } ) :
            function( elem, i, match ) {
                return !!$.data( elem, match[ 3 ] );
            }
    } ); 
    $.cleanData = ( function( orig ) {
        return function( elems ) {
            var events, elem, i;
            for ( i = 0; ( elem = elems[ i ] ) != null; i++ ) {
                try {
                    events = $._data( elem, "events" );
                    if ( events && events.remove ) {
                        $( elem ).triggerHandler( "remove" );
                    }
                } catch ( e ) {}
            }
            orig( elems );
        };
    } )( $.cleanData );

    $.widget = function( name, base, prototype ) {
        var existingConstructor, constructor, basePrototype;
        var proxiedPrototype = {};
        var namespace = name.split( "." )[ 0 ];
        name = name.split( "." )[ 1 ];
        var fullName = namespace + "-" + name;
        if ( !prototype ) {
            prototype = base;
            base = $.Widget;
        }
        if ( $.isArray( prototype ) ) {
            prototype = $.extend.apply( null, [ {} ].concat( prototype ) );
        }
        // Create selector for plugin
        $.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
            return !!$.data( elem, fullName );
        };
        $[ namespace ] = $[ namespace ] || {};
        existingConstructor = $[ namespace ][ name ];
        constructor = $[ namespace ][ name ] = function( options, element ) {
            // Allow instantiation without "new" keyword
            if ( !this._createWidget ) {
                return new constructor( options, element );
            }
            if ( arguments.length ) {
                this._createWidget( options, element );
            }
        };
        // Extend with the existing constructor to carry over any static properties
        $.extend( constructor, existingConstructor, {
            version: prototype.version,
            _proto: $.extend( {}, prototype ),
            _childConstructors: []
        } );
        basePrototype = new base();
        basePrototype.options = $.widget.extend( {}, basePrototype.options );
        $.each( prototype, function( prop, value ) {
            if ( !$.isFunction( value ) ) {
                proxiedPrototype[ prop ] = value;
                return;
            }
            proxiedPrototype[ prop ] = ( function() {
                function _super() {
                    return base.prototype[ prop ].apply( this, arguments );
                }
                function _superApply( args ) {
                    return base.prototype[ prop ].apply( this, args );
                }
                return function() {
                    var __super = this._super;
                    var __superApply = this._superApply;
                    var returnValue;

                    this._super = _super;
                    this._superApply = _superApply;

                    returnValue = value.apply( this, arguments );

                    this._super = __super;
                    this._superApply = __superApply;

                    return returnValue;
                };
            } )();
        } );
        constructor.prototype = $.widget.extend( basePrototype, {
            widgetEventPrefix: existingConstructor ? ( basePrototype.widgetEventPrefix || name ) : name
        }, proxiedPrototype, {
            constructor: constructor,
            namespace: namespace,
            widgetName: name,
            widgetFullName: fullName
        } );
        if ( existingConstructor ) {
            $.each( existingConstructor._childConstructors, function( i, child ) {
                var childPrototype = child.prototype;
                $.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor,
                    child._proto );
            } );
            delete existingConstructor._childConstructors;
        } else {
            base._childConstructors.push( constructor );
        }
        $.widget.bridge( name, constructor );
        return constructor;
    };

    $.widget.extend = function( target ) {
        var input = slice.call( arguments, 1 );
        var inputIndex = 0;
        var inputLength = input.length;
        var key;
        var value;
        for ( ; inputIndex < inputLength; inputIndex++ ) {
            for ( key in input[ inputIndex ] ) {
                value = input[ inputIndex ][ key ];
                if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {

                    // Clone objects
                    if ( $.isPlainObject( value ) ) {
                        target[ key ] = $.isPlainObject( target[ key ] ) ?
                            $.widget.extend( {}, target[ key ], value ) :
                            $.widget.extend( {}, value );
                    } else {
                        target[ key ] = value;
                    }
                }
            }
        }
        return target;
    };

    $.widget.bridge = function( name, object ) {
        var fullName = object.prototype.widgetFullName || name;
        $.fn[ name ] = function( options ) {
            var isMethodCall = typeof options === "string";
            var args = slice.call( arguments, 1 );
            var returnValue = this;
            if ( isMethodCall ) {
                this.each( function() {
                    var methodValue;
                    var instance = $.data( this, fullName );
                    if ( options === "instance" ) {
                        returnValue = instance;
                        return false;
                    }
                    if ( !instance ) {
                        return $.error( "cannot call methods on " + name +
                            " prior to initialization; " +
                            "attempted to call method '" + options + "'" );
                    }
                    if ( !$.isFunction( instance[ options ] ) || options.charAt( 0 ) === "_" ) {
                        return $.error( "no such method '" + options + "' for " + name +
                            " widget instance" );
                    }
                    methodValue = instance[ options ].apply( instance, args );
                    if ( methodValue !== instance && methodValue !== undefined ) {
                        returnValue = methodValue && methodValue.jquery ?
                            returnValue.pushStack( methodValue.get() ) :
                            methodValue;
                        return false;
                    }
                } );
            } else {
                if ( args.length ) {
                    options = $.widget.extend.apply( null, [ options ].concat( args ) );
                }
                this.each(function() {
                    var instance = $.data(this, fullName) || null;
                    if (instance && instance.option ) {
                        //get instance
                        instance.option(options || {});
                        if (instance._init) {
                            instance._init();
                        }
                    } else {
                        $.data(this, fullName, new object(options, this)); //set and new
                    }
                });
            }
            return returnValue;
        };
    };

    //class Widget

    var viewOptions = [ 'element', 'id', 'attributes', 'className', 'tagName','defaultElement', 'events','template'];

    $.Widget = function( /* options, element */ ) {};
    $.Widget._childConstructors = [];
    //must use $.extend
    $.extend($.Widget.prototype,Bone.Events,{

        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        version: "0.0.1",
        options: {
            classes: {},
            disabled: false,
            // Callbacks
            create: null
        },
        _createWidget: function( options, element ) {
            element = $( element || this.defaultElement || this )[ 0 ];
            this.element = $( element );
            this.$el     =  this.element; //alias

            this.uuid = _.uniqueId('');
            _.extend(this, _.pick(options, viewOptions)); //取制定的key
            this.eventNamespace = "." + this.widgetName + this.uuid;

            this.bindings = $();
            this.hoverable = $();
            this.focusable = $();
            this.classesElementLookup = {};
            if ( element !== this ) {
                $.data( element, this.widgetFullName, this );
                this._on( true, this.element, {
                    remove: function( event ) {
                        if ( event.target === element ) {
                            this.destroy();
                        }
                    }
                } );
                this.document = $( element.style ?
                    // Element within the document
                    element.ownerDocument :
                    // Element is window or document
                element.document || element );
                this.window = $( this.document[ 0 ].defaultView || this.document[ 0 ].parentWindow );
            }

            this.options = $.widget.extend( {}, this.options, this._getCreateOptions(), options );

            this._create(); // ensureElement
            this._ensureElement(); // alias  this.$el  => this.element

            if ( this.options.disabled ) {
                this._setOptionDisabled( this.options.disabled );
            }

            this._trigger( "create", null, this._getCreateEventData());
            this._init.apply(this, arguments);
            this.trigger('widget:ready');
        },
        // Produces a DOM element to be assigned to your view.
        _createElement: function(tagName) {
            return document.createElement(tagName);
        },
        _getCreateOptions: function() {
            return {};
        },
        render: function() {
            return this;
        },
        _getCreateEventData: $.noop,
        _create: $.noop,
        _init: $.noop,
        //events:{},
        _ensureElement: function() {
            var attrs = _.extend({}, _.result(this, 'attributes'));
            if (this.id) attrs.id = _.result(this, 'id');
            this._setAttributes(attrs);
            this.setElement(_.result(this, 'element'));

        },
        setElement: function(element) {
            this.undelegateEvents();
            this._setElement(element);
            this.delegateEvents();
            return this;
        },
        _setElement: function(el) {
            this.element = el instanceof $ ? el : $(el); //jq dom
            this.$el = this.element; // alias
            this.el = this.element[0]; //dom
            return this;
        },

        delegateEvents: function(events) {
            events || (events = _.result(this, 'events'));
            if (!events) return this;
            this.undelegateEvents();
            for (var key in events) {
                var method = events[key];
                if (!_.isFunction(method)) method = this[method];
                if (!method) continue;
                var match = key.match(delegateEventSplitter);
                this.delegate(match[1], match[2], _.bind(method, this));
            }
            return this;
        },

        delegate: function(eventName, selector, listener) {
            this.element.on(eventName + '.delegateEvents' + this.eventNamespace, selector, listener);
            return this;
        },

        // Clears all callbacks
        undelegateEvents: function() {
            if (this.element) this.element.off('.delegateEvents' + this.eventNamespace);
            return this;
        },
        undelegate: function(eventName, selector, listener) {
            this.element.off(eventName + '.delegateEvents' + this.eventNamespace, selector, listener);
            return this;
        },
        destroy: function() {
            var that = this;
            this._destroy();
            $.each( this.classesElementLookup, function( key, value ) {
                that._removeClass( value, key );
            } );
            this.element.off( this.eventNamespace ) .removeData( this.widgetFullName );
            this.widget().off( this.eventNamespace ) .removeAttr( "aria-disabled" );
            this.bindings.off( this.eventNamespace );
            this._removeElement();
            this.stopListening();
            return this;
        },
        _destroy: $.noop,
        _removeElement: function() {
            this.element.remove();
        },
        widget: function() {
            return this.element;
        },
        find: function(selector) {
            return this.element.find(selector);
        },
        option: function( key, value ) {
            var options = key;
            var parts;
            var curOption;
            var i;
            if ( arguments.length === 0 ) {
                return $.widget.extend( {}, this.options );
            }
            if ( typeof key === "string" ) {
                // Handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
                options = {};
                parts = key.split( "." );
                key = parts.shift();
                if ( parts.length ) {
                    curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
                    for ( i = 0; i < parts.length - 1; i++ ) {
                        curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
                        curOption = curOption[ parts[ i ] ];
                    }
                    key = parts.pop();
                    if ( arguments.length === 1 ) {
                        return curOption[ key ] === undefined ? null : curOption[ key ];
                    }
                    curOption[ key ] = value;
                } else {
                    if ( arguments.length === 1 ) {
                        return this.options[ key ] === undefined ? null : this.options[ key ];
                    }
                    options[ key ] = value;
                }
            }
            this._setOptions( options );
            return this;
        },
        _setOptions: function( options ) {
            var key;
            for ( key in options ) {
                this._setOption( key, options[ key ] );
            }
            return this;
        },
        _setOption: function( key, value ) {
            if ( key === "classes" ) {
                this._setOptionClasses( value );
            }
            this.options[ key ] = value;
            if ( key === "disabled" ) {
                this._setOptionDisabled( value );
            }
            return this;
        },
        _setOptionClasses: function( value ) {
            var classKey, elements, currentElements;
            for ( classKey in value ) {
                currentElements = this.classesElementLookup[ classKey ];
                if ( value[ classKey ] === this.options.classes[ classKey ] ||
                    !currentElements ||
                    !currentElements.length ) {
                    continue;
                }
                elements = $( currentElements.get() );
                this._removeClass( currentElements, classKey );
                elements.addClass( this._classes( {
                    element: elements,
                    keys: classKey,
                    classes: value,
                    add: true
                } ) );
            }
        },
        _setOptionDisabled: function( value ) {
            this._toggleClass( this.widget(), this.widgetFullName + "-disabled", null, !!value );
            // If the widget is becoming disabled, then nothing is interactive
            if ( value ) {
                this._removeClass( this.hoverable, null, "ui-state-hover" );
                this._removeClass( this.focusable, null, "ui-state-focus" );
            }
        },
        enable: function() {
            return this._setOptions( { disabled: false } );
        },
        disable: function() {
            return this._setOptions( { disabled: true } );
        },
        _setAttributes: function(attributes) {
            this.element.attr(attributes);
        },
        _classes: function( options ) {
            var full = [];
            var that = this;
            options = $.extend( {
                element: this.element,
                classes: this.options.classes || {}
            }, options );

            function processClassString( classes, checkOption ) {
                var current, i;
                for ( i = 0; i < classes.length; i++ ) {
                    current = that.classesElementLookup[ classes[ i ] ] || $();
                    if ( options.add ) {
                        current = $( _.uniq( current.get().concat( options.element.get() ) ) );
                    } else {
                        current = $( current.not( options.element ).get() );
                    }
                    that.classesElementLookup[ classes[ i ] ] = current;
                    full.push( classes[ i ] );
                    if ( checkOption && options.classes[ classes[ i ] ] ) {
                        full.push( options.classes[ classes[ i ] ] );
                    }
                }
            }
            if ( options.keys ) {
                processClassString( options.keys.match( /\S+/g ) || [], true );
            }
            if ( options.extra ) {
                processClassString( options.extra.match( /\S+/g ) || [] );
            }
            return full.join( " " );
        },

        _removeClass: function( element, keys, extra ) {
            return this._toggleClass( element, keys, extra, false );
        },
        _addClass: function( element, keys, extra ) {
            return this._toggleClass( element, keys, extra, true );
        },
        _toggleClass: function( element, keys, extra, add ) {
            add = ( typeof add === "boolean" ) ? add : extra;
            var shift = ( typeof element === "string" || element === null ),
                options = {
                    extra: shift ? keys : extra,
                    keys: shift ? element : keys,
                    element: shift ? this.element : element,
                    add: add
                };
            options.element.toggleClass( this._classes( options ), add );
            return this;
        },
        _on: function( suppressDisabledCheck, element, handlers ) {
            var delegateElement;
            var instance = this;
            if ( typeof suppressDisabledCheck !== "boolean" ) {
                handlers = element;
                element = suppressDisabledCheck;
                suppressDisabledCheck = false;
            }
            // No element argument, shuffle and use this.element
            if ( !handlers ) {
                handlers = element;
                element = this.element;
                delegateElement = this.widget();
            } else {
                element = delegateElement = $( element );
                this.bindings = this.bindings.add( element );
            }
            $.each( handlers, function( event, handler ) {
                function handlerProxy() {
                    if ( !suppressDisabledCheck &&
                        ( instance.options.disabled === true ||
                        $( this ).hasClass( "ui-state-disabled" ) ) )
                    {  return; }
                    return ( typeof handler === "string" ? instance[ handler ] : handler )
                        .apply( instance, arguments );
                }
                // Copy the guid so direct unbinding works
                if ( typeof handler !== "string" ) {
                    handlerProxy.guid = handler.guid =
                        handler.guid || handlerProxy.guid || $.guid++;
                }
                var match = event.match( /^([\w:-]*)\s*(.*)$/ );
                var eventName = match[ 1 ] + instance.eventNamespace;
                var selector = match[ 2 ];
                if ( selector ) {
                    delegateElement.on( eventName, selector, handlerProxy );
                } else {
                    element.on( eventName, handlerProxy );
                }
            } );
        },

        _off: function( element, eventName ) {
            eventName = ( eventName || "" ).split( " " ).join( this.eventNamespace + " " ) +
                this.eventNamespace;
            element.off( eventName ).off( eventName );
            this.bindings = $( this.bindings.not( element ).get() );
            this.focusable = $( this.focusable.not( element ).get() );
            this.hoverable = $( this.hoverable.not( element ).get() );
        },
        _delay: function( handler, delay ) {
            function handlerProxy() {
                return ( typeof handler === "string" ? instance[ handler ] : handler )
                    .apply( instance, arguments );
            }
            var instance = this;
            return setTimeout( handlerProxy, delay || 0 );
        },
        _hoverable: function( element ) {
            this.hoverable = this.hoverable.add( element );
            this._on( element, {
                mouseenter: function( event ) {
                    this._addClass( $( event.currentTarget ), null, "ui-state-hover" );
                },
                mouseleave: function( event ) {
                    this._removeClass( $( event.currentTarget ), null, "ui-state-hover" );
                }
            } );
        },
        _focusable: function( element ) {
            this.focusable = this.focusable.add( element );
            this._on( element, {
                focusin: function( event ) {
                    this._addClass( $( event.currentTarget ), null, "ui-state-focus" );
                },
                focusout: function( event ) {
                    this._removeClass( $( event.currentTarget ), null, "ui-state-focus" );
                }
            } );
        },
        _trigger: function( type, event, data ) {
            var prop, orig;
            var callback = this.options[ type ];
            if(!event){
                return this;
            }
            data = data || {};
            if(event) event = $.Event( event );
            event.type = ( type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type ).toLowerCase();
            event.target = this.element[ 0 ];
            // Copy original event properties over to the new event
            orig = event.originalEvent;
            if ( orig ) {
                for ( prop in orig ) {
                    if ( !( prop in event ) ) {
                        event[ prop ] = orig[ prop ];
                    }
                }
            }
            this.element.trigger( event, data ); //$trigger
            return !( $.isFunction( callback ) &&
            callback.apply( this.element[ 0 ], [ event ].concat( data ) ) === false ||
            event.isDefaultPrevented() );
        }
    });
    $.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
        $.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
            if ( typeof options === "string" ) {
                options = { effect: options };
            }
            var hasOptions;
            var effectName = !options ? method :
                options === true || typeof options === "number" ?
                    defaultEffect :
                options.effect || defaultEffect;
            options = options || {};
            if ( typeof options === "number" ) {
                options = { duration: options };
            }
            hasOptions = !$.isEmptyObject( options );
            options.complete = callback;
            if ( options.delay ) {
                element.delay( options.delay );
            }
            if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
                element[ method ]( options );
            } else if ( effectName !== method && element[ effectName ] ) {
                element[ effectName ]( options.duration, options.easing, callback );
            } else {
                element.queue( function( next ) {
                    $( this )[ method ]();
                    if ( callback ) {
                        callback.call( element[ 0 ] );
                    }
                    next();
                } );
            }
        };
    });
    $.ui.widget = $.widget;
    return $.widget;
}));
