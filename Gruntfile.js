'use strict';

/*jslint nomen: true*/
//jscs:disable disallowDanglingUnderscores
/*eslint-disable no-underscore-dangle*/

module.exports = function (grunt) {
    var commons = require('js-project-commons');

    commons.grunt.config.initConfig(grunt, {
        buildConfig: {
            projectRoot: __dirname,
            nodeProject: false
        },
        apidoc2readme: {
            readme: {
                options: {
                    tags: {
                        'usage-once': 'funcs.once',
                        'usage-maxTimes': 'funcs.maxTimes',
                        'usage-async': 'funcs.async',
                        'usage-delay': 'funcs.delay',
                        'usage-isFunction': 'funcs.isFunction',
                        'usage-noop': 'funcs.noop',
                        'usage-ensure': 'funcs.ensure'
                    }
                }
            }
        }
    });
};
