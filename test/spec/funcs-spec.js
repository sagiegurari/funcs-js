/*global describe: false, assert: false, it: false, beforeEach: false */

describe('funcs', function () {
    'use strict';

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
});
