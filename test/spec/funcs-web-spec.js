/*global describe: false, assert: false, it: false */

describe('funcs', function () {
    'use strict';

    var createCounterFn = function (validateInput, callbackStyle) {
        var counter = 0;

        var fn = function (arg1, arg2, arg3) {
            if (validateInput) {
                assert.strictEqual(arg1, 1);
                if (callbackStyle) {
                    if (typeof arg2 !== 'function') {
                        assert.strictEqual(arg2, 'test');
                    }
                    assert.isUndefined(arg3);
                } else {
                    assert.strictEqual(arg2, 'test');
                    assert.strictEqual(arg3, false);
                }
            }

            counter++;

            var cb = arguments[arguments.length - 1];
            if (cb && (typeof cb === 'function')) {
                cb(counter);
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

        it('callback style', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            var fn = createCounterFn(true, true);
            var output = funcs.maxTimes(fn, 1, {
                callbackStyle: true
            });
            assert.strictEqual(fn.getCounter(), 0);
            assert.strictEqual(output(1, 'test', 'bad'), 1);
            assert.isUndefined(output(1, 'test', 'bad'));
            assert.strictEqual(fn.getCounter(), 1);
            fn(1, 'test');
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

        it('callback style', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.once);

            var fn = createCounterFn(true, true);
            var output = funcs.once(fn, {
                callbackStyle: true
            });
            assert.strictEqual(fn.getCounter(), 0);
            assert.strictEqual(output(1, 'test', 'bad'), 1);
            assert.isUndefined(output(1, 'test', 'bad'));
            assert.strictEqual(fn.getCounter(), 1);
            fn(1, 'test');
            assert.strictEqual(fn.getCounter(), 2);
        });

        it('chaining', function (done) {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.once);

            var fn = createCounterFn();
            var output = funcs.once(fn).delay(0);
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

    describe('delay', function () {
        it('no function', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            var output = funcs.delay(10, 10);
            assert.isTrue(output === funcs.noop);
        });

        it('delay not provided', function (done) {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            var fn = createCounterFn();
            var output = funcs.delay(fn);
            assert.isFalse(output === fn);
            output(function (counter) {
                assert.strictEqual(counter, 1);

                done();
            });
        });

        it('negative delay', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            var fn = createCounterFn();
            var output = funcs.delay(fn, -1);
            assert.isTrue(output === fn);
        });

        it('delay is 0', function (done) {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            var fn = createCounterFn();
            var output = funcs.delay(fn, 0);
            assert.isFalse(output === fn);
            output(function (counter) {
                assert.strictEqual(counter, 1);
                assert.strictEqual(fn.getCounter(), 1);

                done();
            });
        });

        it('delay is positive', function (done) {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            var delay = 20;
            var fn = createCounterFn();
            var output = funcs.delay(fn, delay);
            assert.isFalse(output === fn);
            var startTime = Date.now();
            output(function (counter) {
                assert.strictEqual(counter, 1);
                assert.isTrue((Date.now() - startTime) >= delay);
                assert.strictEqual(fn.getCounter(), 1);

                done();
            });
        });

        it('validate input proxy', function (done) {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            var delay = 20;
            var fn = createCounterFn(true);
            var output = funcs.delay(fn, delay);
            assert.isFalse(output === fn);
            var startTime = Date.now();
            output(1, 'test', false, function (counter) {
                assert.strictEqual(counter, 1);
                assert.isTrue((Date.now() - startTime) >= delay);
                assert.strictEqual(fn.getCounter(), 1);

                done();
            });
        });

        it('callback style', function (done) {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            var delay = 20;
            var fn = createCounterFn(true, true);
            var output = funcs.delay(fn, delay, {
                callbackStyle: true
            });
            assert.isFalse(output === fn);
            var startTime = Date.now();
            output(1, function (counter) {
                assert.strictEqual(counter, 1);
                assert.isTrue((Date.now() - startTime) >= delay);
                assert.strictEqual(fn.getCounter(), 1);

                done();
            }, 'bad');
        });

        it('options provided without delay', function (done) {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            var fn = createCounterFn(true, true);
            var output = funcs.delay(fn, {
                callbackStyle: true
            });
            assert.isFalse(output === fn);
            output(1, function (counter) {
                assert.strictEqual(counter, 1);
                assert.strictEqual(fn.getCounter(), 1);

                done();
            }, 'bad');
        });

        it('chaining', function (done) {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            var delay = 20;
            var fn = createCounterFn();
            var output = funcs.delay(fn, delay).once();
            assert.strictEqual(fn.getCounter(), 0);
            var startTime = Date.now();
            output(function (counter) {
                assert.strictEqual(counter, 1);
                assert.isTrue((Date.now() - startTime) >= delay);
                assert.strictEqual(fn.getCounter(), 1);

                output(function () {
                    assert.fail();
                });

                setTimeout(done, delay + 50);
            });
        });
    });

    describe('async', function () {
        it('no function', function () {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.async);

            var output = funcs.async(10);
            assert.isTrue(output === funcs.noop);
        });

        it('async', function (done) {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.async);

            var fn = createCounterFn();
            var output = funcs.async(fn);
            assert.isFalse(output === fn);
            var invoked = false;
            output(function (counter) {
                invoked = true;
                assert.strictEqual(counter, 1);
                assert.strictEqual(fn.getCounter(), 1);

                done();
            });

            assert.isFalse(invoked);
        });

        it('validate input proxy', function (done) {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.async);

            var fn = createCounterFn(true);
            var output = funcs.async(fn);
            assert.isFalse(output === fn);
            var invoked = false;
            output(1, 'test', false, function (counter) {
                invoked = true;
                assert.strictEqual(counter, 1);
                assert.strictEqual(fn.getCounter(), 1);

                done();
            });

            assert.isFalse(invoked);
        });

        it('callback style', function (done) {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.async);

            var fn = createCounterFn(true, true);
            var output = funcs.async(fn, {
                callbackStyle: true
            });
            assert.isFalse(output === fn);
            var invoked = false;
            output(1, function (counter) {
                invoked = true;
                assert.strictEqual(counter, 1);
                assert.strictEqual(fn.getCounter(), 1);

                done();
            }, 'bad');

            assert.isFalse(invoked);
        });

        it('chaining', function (done) {
            var funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.async);

            var fn = createCounterFn();
            var output = funcs.async(fn).maxTimes(1);
            assert.strictEqual(fn.getCounter(), 0);
            var invoked = false;
            output(function (counter) {
                invoked = true;
                assert.strictEqual(counter, 1);
                assert.strictEqual(fn.getCounter(), 1);

                output(function () {
                    assert.fail();
                });

                setTimeout(done, 50);
            });

            assert.isFalse(invoked);
        });
    });
});
