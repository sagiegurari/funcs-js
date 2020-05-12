'use strict';

/*jslint nomen: true*/
//jscs:disable disallowDanglingUnderscores
/*eslint-disable no-underscore-dangle*/

module.exports = function (grunt) {
    const commons = require('js-project-commons');

    const webBuild = !!process.env.CI_RUN_KARMA;

    commons.grunt.config.initConfig(grunt, {
        buildConfig: {
            projectRoot: __dirname,
            dualProject: !webBuild,
            nodeProject: !webBuild,
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
