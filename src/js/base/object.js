
// Object
// ------

// A Base Class that other Classes should descend from.
// Object borrows many conventions and utilities from bone.
(function (root) {
    var BoneObject = Bone.Object = function (options) {
        this.options = _.extend({}, _.result(this, 'options'), options);
        this._cid = _.uniqueId(this.cidPrefix);
        if (this._initRadio) this._initRadio();
        this.initialize.apply(this, arguments);
    };

    Bone.Object.extend = Bone.extend;

// Object Methods
// -------------- 
// Ensure it can trigger events with Bone.Events
    _.extend(Bone.Object.prototype, Bone.CommonMixin, Bone.RadioMixin, Bone.Events, {
        cidPrefix: '',
        //this is a noop method intended to be overridden by classes that extend from this base
        initialize: function () {
        },
        _isDestroyed: false,
        isDestroyed: function isDestroyed() {
            return this._isDestroyed;
        },
        destroy: function () {
            if (this._isDestroyed) {
                return this;
            }
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }
            this.triggerMethod.apply(this, ['before:destroy', this].concat(args));
            this._isDestroyed = true;
            this.triggerMethod.apply(this, ['destroy', this].concat(args));
            this.stopListening();
            return this;
        }

    }); 
     

}(window));

