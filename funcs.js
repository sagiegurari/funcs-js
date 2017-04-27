/*global module: false, define: false */

/**
 * Function wrappers and utilities for enhanced behavior.
 *
 * @name funcs
 * @namespace funcs
 * @author Sagie Gur-Ari
 */

/**
 * Initializes the funcs API.
 *
 * @function
 * @memberof! funcs
 * @alias funcs.initFuncs
 * @private
 * @param {Object} global - The root context (window/global/...)
 * @param {function} factory - Returns a new instance of the API
 * @returns {Object} New instance of the API
 */
(function initFuncs(global, factory) {
    'use strict';

    var funcs = factory();

    /**
     * Initializes the funcs API (only used for testing).
     *
     * @function
     * @memberof! funcs
     * @alias funcs.initFuncsFromContext
     * @private
     * @param {Object} context - The root context (window/global/...)
     * @returns {Object} New instance of the API
     */
    funcs.initFuncsFromContext = function (context) {
        return initFuncs(context, factory);
    };

    if ((typeof define === 'function') && define.amd) {
        define(function defineLib() {
            return funcs;
        });
    } else if ((typeof module === 'object') && module.exports) {
        module.exports = funcs;
    } else {
        global.funcs = funcs;
    }

    return funcs;
}(this, function initFuncs() {
    'use strict';

    var funcs = {};

    /**
     * Adds chaining support for the provided function.
     *
     * @function
     * @memberof! funcs
     * @alias funcs.addChaining
     * @private
     * @param {function} fn - Adds the funcs APIs to the provided function with this function as a context
     */
    var addChaining = function (fn) {
        /**
         * Chain function.
         *
         * @function
         * @memberof! funcs
         * @alias funcs.maxTimesChain
         * @private
         * @param {Number} times - The max times the provided function will be invoked
         * @returns {function} The new wrapper function
         */
        fn.maxTimes = function (times) {
            return funcs.maxTimes(fn, times);
        };

        /**
         * Chain function.
         *
         * @function
         * @memberof! funcs
         * @alias funcs.onceChain
         * @private
         * @returns {function} The new wrapper function
         */
        fn.once = function () {
            return funcs.once(fn);
        };

        /**
         * Chain function.
         *
         * @function
         * @memberof! funcs
         * @alias funcs.delayChain
         * @private
         * @param {Number} delay - The invocation delay in millies
         * @returns {function} The new wrapper function
         */
        fn.delay = function (delay) {
            return funcs.delay(fn, delay);
        };

        /**
         * Chain function.
         *
         * @function
         * @memberof! funcs
         * @alias funcs.asyncChain
         * @private
         * @returns {function} The new wrapper function
         */
        fn.async = function () {
            return funcs.async(fn);
        };
    };

    /**
     * Empty function.
     *
     * @function
     * @memberof! funcs
     * @alias funcs.noop
     * @public
     * @returns {undefined} Undefined
     */
    funcs.noop = function () {
        return undefined;
    };

    /**
     * Returns true if the provided argument is a function.
     *
     * @function
     * @memberof! funcs
     * @alias funcs.isFunction
     * @public
     * @params {function} [fn] - The function to check
     * @returns {Boolean} True if the provided argument is a function
     * @example
     * ````js
     * var isFn = funcs.isFunction(myFunction);
     *
     * funcs.isFunction(function () {}); //true
     * funcs.isFunction(); //false
     * funcs.isFunction(5); //false
     * funcs.isFunction(true); //false
     * ````
     */
    funcs.isFunction = function (fn) {
        return (fn && (typeof fn === 'function')) || false;
    }

    /**
     * Ensures a return function.<br>
     * If a function is provided, it will be returned, otherwise a noop function will be returned.
     *
     * @function
     * @memberof! funcs
     * @alias funcs.ensure
     * @public
     * @params {function} [fn] - The function to check
     * @returns {function} The original function if provided, or a noop
     * @example
     * ````js
     * var handler = funcs.ensure(maybeHandler);
     * ````
     */
    funcs.ensure = function (fn) {
        if (!this.isFunction(fn)) {
            return funcs.noop;
        }

        return fn;
    };

    /**
     * Wraps the provided function and ensures it is invoked no more than the provided amount.<br>
     * This function output can be chained with other func apis.
     *
     * @function
     * @memberof! funcs
     * @alias funcs.maxTimes
     * @public
     * @param {function} fn - The function to wrap
     * @param {Number} times - The max times the provided function will be invoked
     * @returns {function} The new wrapper function
     * @example
     * ````js
     * var onlyOnceCallback = funcs.maxTimes(callback, 1);
     *
     * //can also chain
     * var delayedMaxTimesCallback = funcs.maxTimes(callback, 5).delay(500);
     * ````
     */
    funcs.maxTimes = function (fn, times) {
        if ((!this.isFunction(fn)) || (!times) || (typeof times !== 'number') || (times < 0)) {
            return this.noop;
        }

        var counter = 0;

        var fnMaxTimesWrapper = function () {
            if (counter < times) {
                counter++;

                return fn.apply(null, arguments);
            }
        };

        //add chaining support
        addChaining(fnMaxTimesWrapper);

        return fnMaxTimesWrapper;
    };

    /**
     * Ensures the provided function is invoked only once.<br>
     * This is the same as calling funcs.times(fn, 1)<br>
     * This function output can be chained with other func apis.
     *
     * @function
     * @memberof! funcs
     * @alias funcs.once
     * @public
     * @param {function} fn - The function to wrap
     * @returns {function} The new wrapper function
     * @example
     * ````js
     * var onlyOnceCallback = funcs.once(callback);
     *
     * //can also chain
     * var asyncOnceCallback = funcs.once(callback).async();
     * ````
     */
    funcs.once = function (fn) {
        return this.maxTimes(fn, 1);
    };

    /**
     * Trigger the actual function only after the provided delay.<br>
     * This function output can be chained with other func apis.
     *
     * @function
     * @memberof! funcs
     * @alias funcs.delay
     * @public
     * @param {function} fn - The function to wrap
     * @param {Number} delay - The invocation delay in millies
     * @returns {function} The new wrapper function
     * @example
     * ````js
     * var delayedCallback = funcs.delay(callback, 500);
     *
     * //can also chain
     * var delayedMaxTimesCallback = funcs.delay(callback, 500).maxTimes(5);
     * ````
     */
    funcs.delay = function (fn, delay) {
        if (!this.isFunction(fn)) {
            return this.noop;
        }

        delay = delay || 0;

        if (delay < 0) {
            return fn;
        }

        var fnDelayWrapper = function () {
            var fnArguments = arguments;

            setTimeout(function () {
                fn.apply(null, fnArguments);
            }, delay);
        };

        //add chaining support
        addChaining(fnDelayWrapper);

        return fnDelayWrapper;
    };

    /**
     * Ensures the function is invoked only in the next cycle.<br>
     * This is the same as calling funcs.delay(fn, 0)<br>
     * This function output can be chained with other func apis.
     *
     * @function
     * @memberof! funcs
     * @alias funcs.async
     * @public
     * @param {function} fn - The function to wrap
     * @returns {function} The new wrapper function
     * @example
     * ````js
     * var asyncCallback = funcs.async(callback);
     *
     * //can also chain
     * var asyncOnceCallback = funcs.async(callback).once();
     * ````
     */
    funcs.async = function (fn) {
        return this.delay(fn, 0);
    };

    return funcs;
}));
