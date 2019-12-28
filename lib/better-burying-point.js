/*!
  * better-burying-point v1.0.1
  * (c) 2019 huxing
  * @license MIT
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.BetterBuryingPoint = {}));
}(this, (function (exports) { 'use strict';

    var module = {};
    var separator = '.';
    var _ = {
        type: function type(val) {
            return Object.prototype.toString.call(val).replace(/\[object\s|\]/g, '');
        },
        isString: function isString(val) {
            return this.type(val) === 'String';
        },
        isFunction: function isFunction(val) {
            return this.type(val) === 'Function';
        },
        isObject: function isObject(val) {
            return this.type(val) === 'Object';
        }
    };
    var getObjectFunction = function(obj, key) {
        var arr = key.split(separator);
        var count = 0;
        var next = function (obj) {
            if (!_.isObject(obj)) {
                console.warn('请使用setModule方法设置对象模块');
                return false;
            }
            if (!arr[count]) {
                return false;
            }
            var val = obj[arr[count]];
            count++;
            if (_.isFunction(val)) {
                return val;
            }
            return next(val);
        };
        return next(obj);
    };
    var AopBefore = function(fn) {
        var self = this;
        return function() {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            fn.apply(this, args);
            return self.apply(this, args);
        };
    };
    var AopAfter = function(fn) {
        var self = this;
        return function() {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            var ret = self.apply(this, args);
            fn.apply(this, args);
            return ret;
        };
    };
    var callback = function(rest, args) {
        if (_.isString(rest[0])) {
            var result = getObjectFunction(module, rest[0]);
            if (result) {
                rest[0] = result;
            }
        }
        if (_.isFunction(rest[0])) {
            var arr = rest.slice(1);
            rest[0].apply(this, arr.concat(args));
            return;
        }
        console.warn('没有找到模块');
    };
    var before = function() {
        var rest = [], len = arguments.length;
        while ( len-- ) rest[ len ] = arguments[ len ];

        return function(target, key, descriptor) {
            descriptor.value = AopBefore.call(descriptor.value, function() {
                var args = [], len = arguments.length;
                while ( len-- ) args[ len ] = arguments[ len ];

                callback.call(this, rest, args);
            });
            return descriptor;
        };
    };
    var after = function() {
        var rest = [], len = arguments.length;
        while ( len-- ) rest[ len ] = arguments[ len ];

        return function(target, key, descriptor) {
            descriptor.value = AopAfter.call(descriptor.value, function() {
                var args = [], len = arguments.length;
                while ( len-- ) args[ len ] = arguments[ len ];

                callback.call(this, rest, args);
            });
            return descriptor;
        };
    };
    var setModule = function(val) {
        module = val;
    };
    var setSeparator = function(val) {
        separator = val;
    };
    var version = '1.0.1';

    exports.after = after;
    exports.before = before;
    exports.setModule = setModule;
    exports.setSeparator = setSeparator;
    exports.version = version;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
