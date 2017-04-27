/*global describe: false, assert: false, it: false, beforeEach: false */

describe('funcs', function () {
    'use strict';

    var createCounterFn = function (validateInput) {
        var counter = 0;

        var fn = function (arg1, arg2, arg3) {
            if (validateInput) {
                assert.strictEqual(arg1, 1);
                assert.strictEqual(arg2, 'test');
                assert.strictEqual(arg3, false);
            }
            
            counter++;
            
            if ((!validateInput) && arg1 && (typeof arg1 === 'function')) {
                arg1(counter);
            }

            return counter;
        };

        fn.getCounter = function () {
            return counter;
        };

        return fn;
    };

    describe('init', function () {
        it('window', function () {
            assert.isObject(window.funcs);
            assert.isFunction(window.funcs.initFuncsFromContext);
            assert.isFunction(window.funcs.async);
        });

        it('global', function () {
            var global = {};

            window.funcs.initFuncsFromContext(global);

            assert.isObject(global.funcs);
            assert.isFunction(global.funcs.async);
        });

        it('define', function () {
            var global = {};

            window.define = function (factory) {
                var funcs = factory();

                assert.isObject(funcs);
                assert.isFunction(funcs.async);

                delete window.define;
            };
            window.define.amd = true;

            window.funcs.initFuncsFromContext(global);
        });

        it('module', function () {
            var global = {};

            window.module = {
                exports: {}
            };

            window.funcs.initFuncsFromContext(global);

            assert.isFunction(window.module.exports.async);

            delete window.module;
        });
    });

    describe('noop', function () {
        it('simple', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.noop);

            assert.isUndefined(funcs.noop());
        });
    });

    describe('isFunction', function () {
        it('no input', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction());
        });

        it('null', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction(null));
        });

        it('string', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction('test'));
        });

        it('number', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction(5));
        });

        it('true', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction(true));
        });

        it('false', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction(false));
        });

        it('object', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction({}));
        });

        it('function', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.isFunction);

            assert.isTrue(funcs.isFunction(function () {
                return true;
            }));
        });
    });

    describe('ensure', function () {
        it('no input', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.ensure);

            var output = funcs.ensure();
            assert.isTrue(output === funcs.noop);
        });

        it('null', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.ensure);

            var output = funcs.ensure(null);
            assert.isTrue(output === funcs.noop);
        });

        it('string', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.ensure);

            var output = funcs.ensure('test');
            assert.isTrue(output === funcs.noop);
        });

        it('number', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.ensure);

            var output = funcs.ensure(5);
            assert.isTrue(output === funcs.noop);
        });

        it('true', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.ensure);

            var output = funcs.ensure(true);
            assert.isTrue(output === funcs.noop);
        });

        it('false', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.ensure);

            var output = funcs.ensure(false);
            assert.isTrue(output === funcs.noop);
        });

        it('object', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.ensure);

            var output = funcs.ensure({});
            assert.isTrue(output === funcs.noop);
        });

        it('function', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.ensure);

            var testFn = function () {
                return true;
            };

            var output = funcs.ensure(testFn);
            assert.isTrue(output === testFn);
        });
    });

    describe('maxTimes', function () {
        it('no function', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            var output = funcs.maxTimes(10, 5);
            assert.isTrue(output === funcs.noop);
        });

        it('times not a number', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            var fn = createCounterFn();
            var output = funcs.maxTimes(fn, {});
            assert.isTrue(output === funcs.noop);
        });

        it('times negative', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            var fn = createCounterFn();
            var output = funcs.maxTimes(fn, -1);
            assert.isTrue(output === funcs.noop);
        });

        it('times is 0', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            var fn = createCounterFn();
            var output = funcs.maxTimes(fn, 0);
            assert.strictEqual(fn.getCounter(), 0);
            assert.isUndefined(output());
            assert.strictEqual(fn.getCounter(), 0);
            fn();
            assert.strictEqual(fn.getCounter(), 1);
        });

        it('times is positive', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            var times = 5;
            var fn = createCounterFn();
            var output = funcs.maxTimes(fn, times);
            assert.strictEqual(fn.getCounter(), 0);
            var index;
            for (index = 0; index < times; index++) {
                assert.strictEqual(output(), (index + 1));
            }
            assert.isUndefined(output());
            assert.strictEqual(fn.getCounter(), times);
            fn();
            assert.strictEqual(fn.getCounter(), times + 1);
        });

        it('validate input proxy', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            var fn = createCounterFn(true);
            var output = funcs.maxTimes(fn, 1);
            assert.strictEqual(fn.getCounter(), 0);
            assert.strictEqual(output(1, 'test', false), 1);
            assert.isUndefined(output(1, 'test', false));
            assert.strictEqual(fn.getCounter(), 1);
            fn(1, 'test', false);
            assert.strictEqual(fn.getCounter(), 2);
        });

        it('chaining', function (done) {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            var fn = createCounterFn();
            var output = funcs.maxTimes(fn, 1).async();
            assert.strictEqual(fn.getCounter(), 0);
            var result = output(function (counter) {
                assert.strictEqual(counter, 1);
                
                output(function () {
                    assert.fail();
                });
                
                setTimeout(done, 10);
            });
            assert.isUndefined(result);
        });
    });

    describe('once', function () {
        it('no function', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.once);

            var output = funcs.once(10);
            assert.isTrue(output === funcs.noop);
        });

        it('once', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.once);

            var fn = createCounterFn();
            var output = funcs.once(fn);
            assert.strictEqual(fn.getCounter(), 0);
            assert.strictEqual(output(), 1);
            assert.isUndefined(output());
            assert.strictEqual(fn.getCounter(), 1);
            fn();
            assert.strictEqual(fn.getCounter(), 2);
        });

        it('validate input proxy', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.once);

            var fn = createCounterFn(true);
            var output = funcs.once(fn);
            assert.strictEqual(fn.getCounter(), 0);
            assert.strictEqual(output(1, 'test', false), 1);
            assert.isUndefined(output(1, 'test', false));
            assert.strictEqual(fn.getCounter(), 1);
            fn(1, 'test', false);
            assert.strictEqual(fn.getCounter(), 2);
        });

        it('chaining', function (done) {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.once);

            var fn = createCounterFn();
            var output = funcs.once(fn).async();
            assert.strictEqual(fn.getCounter(), 0);
            var result = output(function (counter) {
                assert.strictEqual(counter, 1);
                
                output(function () {
                    assert.fail();
                });
                
                setTimeout(done, 10);
            });
            assert.isUndefined(result);
        });
    });
});
