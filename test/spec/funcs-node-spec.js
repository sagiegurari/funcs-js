/*jslint node: true, browser: false*/
'use strict';

/*global describe: false, it: false */
/*eslint no-implicit-globals: 'off', strict: ['error', 'global']*/
/*jshint node: true, browser: false*/

var chai = require('chai');
var assert = chai.assert;
var funcs = require('../../funcs');

describe('funcs', function () {
    var createCounterFn = function (validateInput, callbackStyle) {
        var counter = 0;

        var fn = function (arg1, arg2, arg3) {
            if (validateInput) {
                assert.strictEqual(arg1, 1);
                assert.strictEqual(arg2, 'test');
                if (callbackStyle) {
                    assert.isUndefined(arg3);
                } else {
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

    describe('noop', function () {
        it('simple', function () {
            assert.isFunction(funcs.noop);

            assert.isUndefined(funcs.noop());
        });
    });

    describe('isFunction', function () {
        it('no input', function () {
            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction());
        });

        it('null', function () {
            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction(null));
        });

        it('string', function () {
            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction('test'));
        });

        it('number', function () {
            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction(5));
        });

        it('true', function () {
            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction(true));
        });

        it('false', function () {
            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction(false));
        });

        it('object', function () {
            assert.isFunction(funcs.isFunction);

            assert.isFalse(funcs.isFunction({}));
        });

        it('function', function () {
            assert.isFunction(funcs.isFunction);

            assert.isTrue(funcs.isFunction(function () {
                return true;
            }));
        });
    });

    describe('ensure', function () {
        it('no input', function () {
            assert.isFunction(funcs.ensure);

            var output = funcs.ensure();
            assert.isTrue(output === funcs.noop);
        });

        it('null', function () {
            assert.isFunction(funcs.ensure);

            var output = funcs.ensure(null);
            assert.isTrue(output === funcs.noop);
        });

        it('string', function () {
            assert.isFunction(funcs.ensure);

            var output = funcs.ensure('test');
            assert.isTrue(output === funcs.noop);
        });

        it('number', function () {
            assert.isFunction(funcs.ensure);

            var output = funcs.ensure(5);
            assert.isTrue(output === funcs.noop);
        });

        it('true', function () {
            assert.isFunction(funcs.ensure);

            var output = funcs.ensure(true);
            assert.isTrue(output === funcs.noop);
        });

        it('false', function () {
            assert.isFunction(funcs.ensure);

            var output = funcs.ensure(false);
            assert.isTrue(output === funcs.noop);
        });

        it('object', function () {
            assert.isFunction(funcs.ensure);

            var output = funcs.ensure({});
            assert.isTrue(output === funcs.noop);
        });

        it('function', function () {
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
            assert.isFunction(funcs.maxTimes);

            var output = funcs.maxTimes(10, 5);
            assert.isTrue(output === funcs.noop);
        });

        it('times not a number', function () {
            assert.isFunction(funcs.maxTimes);

            var fn = createCounterFn();
            var output = funcs.maxTimes(fn, {});
            assert.isTrue(output === funcs.noop);
        });

        it('times negative', function () {
            assert.isFunction(funcs.maxTimes);

            var fn = createCounterFn();
            var output = funcs.maxTimes(fn, -1);
            assert.isTrue(output === funcs.noop);
        });

        it('times is 0', function () {
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
            assert.isFunction(funcs.once);

            var output = funcs.once(10);
            assert.isTrue(output === funcs.noop);
        });

        it('once', function () {
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
            assert.isFunction(funcs.delay);

            var output = funcs.delay(10, 10);
            assert.isTrue(output === funcs.noop);
        });

        it('delay not provided', function (done) {
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
            assert.isFunction(funcs.delay);

            var fn = createCounterFn();
            var output = funcs.delay(fn, -1);
            assert.isTrue(output === fn);
        });

        it('delay is 0', function (done) {
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

        it('chaining', function (done) {
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
            assert.isFunction(funcs.async);

            var output = funcs.async(10);
            assert.isTrue(output === funcs.noop);
        });

        it('async', function (done) {
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

        it('chaining', function (done) {
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
