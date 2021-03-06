/*global assert: false */

describe('funcs', function () {
    'use strict';

    const createCounterFn = function (validateInput, callbackStyle) {
        let counter = 0;

        const fn = function (arg1, arg2, arg3) {
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

            const cb = arguments[arguments.length - 1];
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
            const global = {};

            window.funcs.initFuncsFromContext(global);

            assert.isObject(global.funcs);
            assert.isFunction(global.funcs.async);
        });

        it('define', function () {
            const global = {};

            window.define = function (factory) {
                const funcs = factory();

                assert.isObject(funcs);
                assert.isFunction(funcs.async);

                delete window.define;
            };
            window.define.amd = true;

            window.funcs.initFuncsFromContext(global);
        });

        it('module', function () {
            const global = {};

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
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.noop);

            assert.isUndefined(funcs.noop());
        });
    });

    describe('isFunction', function () {
        it('no input', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction());
        });

        it('null', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction(null));
        });

        it('string', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction('test'));
        });

        it('number', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction(5));
        });

        it('true', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction(true));
        });

        it('false', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction(false));
        });

        it('object', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction({}));
        });

        it('function', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.isFunction);

            assert.isTrue(funcs.isFunction(function () {
                return true;
            }));
        });
    });

    describe('ensure', function () {
        it('no input', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.ensure);

            const output = funcs.ensure();
            assert.isTrue(output === funcs.noop);
        });

        it('null', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.ensure);

            const output = funcs.ensure(null);
            assert.isTrue(output === funcs.noop);
        });

        it('string', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.ensure);

            const output = funcs.ensure('test');
            assert.isTrue(output === funcs.noop);
        });

        it('number', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.ensure);

            const output = funcs.ensure(5);
            assert.isTrue(output === funcs.noop);
        });

        it('true', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.ensure);

            const output = funcs.ensure(true);
            assert.isTrue(output === funcs.noop);
        });

        it('false', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.ensure);

            const output = funcs.ensure(false);
            assert.isTrue(output === funcs.noop);
        });

        it('object', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.ensure);

            const output = funcs.ensure({});
            assert.isTrue(output === funcs.noop);
        });

        it('function', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.ensure);

            const testFn = function () {
                return true;
            };

            const output = funcs.ensure(testFn);
            assert.isTrue(output === testFn);
        });
    });

    describe('maxTimes', function () {
        it('no function', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            const output = funcs.maxTimes(10, 5);
            assert.isTrue(output === funcs.noop);
        });

        it('times not a number', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            const fn = createCounterFn();
            const output = funcs.maxTimes(fn, {});
            assert.isTrue(output === funcs.noop);
        });

        it('times negative', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            const fn = createCounterFn();
            const output = funcs.maxTimes(fn, -1);
            assert.isTrue(output === funcs.noop);
        });

        it('times is 0', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            const fn = createCounterFn();
            const output = funcs.maxTimes(fn, 0);
            assert.strictEqual(fn.getCounter(), 0);
            assert.isUndefined(output());
            assert.strictEqual(fn.getCounter(), 0);
            fn();
            assert.strictEqual(fn.getCounter(), 1);
        });

        it('times is positive', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            const times = 5;
            const fn = createCounterFn();
            const output = funcs.maxTimes(fn, times);
            assert.strictEqual(fn.getCounter(), 0);
            for (let index = 0; index < times; index++) {
                assert.strictEqual(output(), (index + 1));
            }
            assert.isUndefined(output());
            assert.strictEqual(fn.getCounter(), times);
            fn();
            assert.strictEqual(fn.getCounter(), times + 1);
        });

        it('validate input proxy', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            const fn = createCounterFn(true);
            const output = funcs.maxTimes(fn, 1);
            assert.strictEqual(fn.getCounter(), 0);
            assert.strictEqual(output(1, 'test', false), 1);
            assert.isUndefined(output(1, 'test', false));
            assert.strictEqual(fn.getCounter(), 1);
            fn(1, 'test', false);
            assert.strictEqual(fn.getCounter(), 2);
        });

        it('no args', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            const times = 5;
            let counter = 0;
            const output = funcs.maxTimes(function () {
                counter++;
                assert.strictEqual(arguments.length, 0);
            }, times);
            for (let index = 0; index < (times + 5); index++) {
                output();
            }

            assert.strictEqual(counter, times);
        });

        it('callback style', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            const fn = createCounterFn(true, true);
            const output = funcs.maxTimes(fn, 1, {
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
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.maxTimes);

            const fn = createCounterFn();
            const output = funcs.maxTimes(fn, 1).async();
            assert.strictEqual(fn.getCounter(), 0);
            const result = output(function (counter) {
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
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.once);

            const output = funcs.once(10);
            assert.isTrue(output === funcs.noop);
        });

        it('once', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.once);

            const fn = createCounterFn();
            const output = funcs.once(fn);
            assert.strictEqual(fn.getCounter(), 0);
            assert.strictEqual(output(), 1);
            assert.isUndefined(output());
            assert.strictEqual(fn.getCounter(), 1);
            fn();
            assert.strictEqual(fn.getCounter(), 2);
        });

        it('validate input proxy', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.once);

            const fn = createCounterFn(true);
            const output = funcs.once(fn);
            assert.strictEqual(fn.getCounter(), 0);
            assert.strictEqual(output(1, 'test', false), 1);
            assert.isUndefined(output(1, 'test', false));
            assert.strictEqual(fn.getCounter(), 1);
            fn(1, 'test', false);
            assert.strictEqual(fn.getCounter(), 2);
        });

        it('no args', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.once);

            let counter = 0;
            const output = funcs.once(function () {
                counter++;
                assert.strictEqual(arguments.length, 0);
            });
            output();
            output();
            output();

            assert.strictEqual(counter, 1);
        });

        it('callback style', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.once);

            const fn = createCounterFn(true, true);
            const output = funcs.once(fn, {
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
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.once);

            const fn = createCounterFn();
            const output = funcs.once(fn).delay(0);
            assert.strictEqual(fn.getCounter(), 0);
            const result = output(function (counter) {
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
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            const output = funcs.delay(10, 10);
            assert.isTrue(output === funcs.noop);
        });

        it('delay not provided', function (done) {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            const fn = createCounterFn();
            const output = funcs.delay(fn);
            assert.isFalse(output === fn);
            output(function (counter) {
                assert.strictEqual(counter, 1);

                done();
            });
        });

        it('negative delay', function () {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            const fn = createCounterFn();
            const output = funcs.delay(fn, -1);
            assert.isTrue(output === fn);
        });

        it('delay is 0', function (done) {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            const fn = createCounterFn();
            const output = funcs.delay(fn, 0);
            assert.isFalse(output === fn);
            output(function (counter) {
                assert.strictEqual(counter, 1);
                assert.strictEqual(fn.getCounter(), 1);

                done();
            });
        });

        it('delay is positive', function (done) {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            const delay = 20;
            const fn = createCounterFn();
            const output = funcs.delay(fn, delay);
            assert.isFalse(output === fn);
            const startTime = Date.now();
            output(function (counter) {
                assert.strictEqual(counter, 1);
                assert.isTrue((Date.now() - startTime) >= (delay / 2));
                assert.strictEqual(fn.getCounter(), 1);

                done();
            });
        });

        it('validate input proxy', function (done) {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            const delay = 20;
            const fn = createCounterFn(true);
            const output = funcs.delay(fn, delay);
            assert.isFalse(output === fn);
            const startTime = Date.now();
            output(1, 'test', false, function (counter) {
                assert.strictEqual(counter, 1);
                assert.isTrue((Date.now() - startTime) >= (delay / 2));
                assert.strictEqual(fn.getCounter(), 1);

                done();
            });
        });

        it('no args', function (done) {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            const fn = createCounterFn(true, true);
            const output = funcs.delay(function () {
                assert.strictEqual(arguments.length, 0);

                done();
            }, 0);
            assert.isFalse(output === fn);

            output();
        });

        it('callback style', function (done) {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            const delay = 20;
            const fn = createCounterFn(true, true);
            const output = funcs.delay(fn, delay, {
                callbackStyle: true
            });
            assert.isFalse(output === fn);
            const startTime = Date.now();
            output(1, function (counter) {
                assert.strictEqual(counter, 1);
                assert.isTrue((Date.now() - startTime) >= (delay / 2));
                assert.strictEqual(fn.getCounter(), 1);

                done();
            }, 'bad');
        });

        it('options provided without delay', function (done) {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            const fn = createCounterFn(true, true);
            const output = funcs.delay(fn, {
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
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.delay);

            const delay = 20;
            const fn = createCounterFn();
            const output = funcs.delay(fn, delay).once();
            assert.strictEqual(fn.getCounter(), 0);
            const startTime = Date.now();
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
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.async);

            const output = funcs.async(10);
            assert.isTrue(output === funcs.noop);
        });

        it('async', function (done) {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.async);

            const fn = createCounterFn();
            const output = funcs.async(fn);
            assert.isFalse(output === fn);
            let invoked = false;
            output(function (counter) {
                invoked = true;
                assert.strictEqual(counter, 1);
                assert.strictEqual(fn.getCounter(), 1);

                done();
            });

            assert.isFalse(invoked);
        });

        it('validate input proxy', function (done) {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.async);

            const fn = createCounterFn(true);
            const output = funcs.async(fn);
            assert.isFalse(output === fn);
            let invoked = false;
            output(1, 'test', false, function (counter) {
                invoked = true;
                assert.strictEqual(counter, 1);
                assert.strictEqual(fn.getCounter(), 1);

                done();
            });

            assert.isFalse(invoked);
        });

        it('no args', function (done) {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.async);

            const fn = createCounterFn(true, true);
            const output = funcs.async(function () {
                assert.strictEqual(arguments.length, 0);

                done();
            });
            assert.isFalse(output === fn);

            output();
        });

        it('callback style', function (done) {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.async);

            const fn = createCounterFn(true, true);
            const output = funcs.async(fn, {
                callbackStyle: true
            });
            assert.isFalse(output === fn);
            let invoked = false;
            output(1, function (counter) {
                invoked = true;
                assert.strictEqual(counter, 1);
                assert.strictEqual(fn.getCounter(), 1);

                done();
            }, 'bad');

            assert.isFalse(invoked);
        });

        it('chaining', function (done) {
            const funcs = window.funcs;
            assert.isDefined(funcs);

            assert.isFunction(funcs.async);

            const fn = createCounterFn();
            const output = funcs.async(fn).maxTimes(1);
            assert.strictEqual(fn.getCounter(), 0);
            let invoked = false;
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
