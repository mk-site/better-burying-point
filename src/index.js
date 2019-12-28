let module = {};
let separator = '.';
const _ = {
    type(val) {
        return Object.prototype.toString.call(val).replace(/\[object\s|\]/g, '');
    },
    isString(val) {
        return this.type(val) === 'String';
    },
    isFunction(val) {
        return this.type(val) === 'Function';
    },
    isObject(val) {
        return this.type(val) === 'Object';
    }
};
const getObjectFunction = function(obj, key) {
    let arr = key.split(separator);
    let count = 0;
    const next = (obj) => {
        if (!_.isObject(obj)) {
            console.warn('请使用setModule方法设置对象模块');
            return false;
        }
        if (!arr[count]) {
            return false;
        }
        let val = obj[arr[count]];
        count++;
        if (_.isFunction(val)) {
            return val;
        }
        return next(val);
    };
    return next(obj);
};
const AopBefore = function(fn) {
    let self = this;
    return function(...args) {
        fn.apply(this, args);
        return self.apply(this, args);
    };
};
const AopAfter = function(fn) {
    let self = this;
    return function(...args) {
        let ret = self.apply(this, args);
        fn.apply(this, args);
        return ret;
    };
};
const callback = function(rest, args) {
    if (_.isString(rest[0])) {
        let result = getObjectFunction(module, rest[0]);
        if (result) {
            rest[0] = result;
        }
    }
    if (_.isFunction(rest[0])) {
        let arr = rest.slice(1);
        rest[0].apply(this, arr.concat(args));
        return;
    }
    console.warn('没有找到模块');
};
const before = function(...rest) {
    return function(target, key, descriptor) {
        descriptor.value = AopBefore.call(descriptor.value, function(...args) {
            callback.call(this, rest, args);
        });
        return descriptor;
    };
};
const after = function(...rest) {
    return function(target, key, descriptor) {
        descriptor.value = AopAfter.call(descriptor.value, function(...args) {
            callback.call(this, rest, args);
        });
        return descriptor;
    };
};
const setModule = function(val) {
    module = val;
};
const setSeparator = function(val) {
    separator = val;
};
const version = '__VERSION__';
export {
    version,
    setModule,
    setSeparator,
    before,
    after
};
