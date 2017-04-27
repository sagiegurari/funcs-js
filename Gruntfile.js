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
                        'usage-noop': 'funcs+noop'
                    }
                }
            }
        }
    });
};
