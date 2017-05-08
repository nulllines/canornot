/* eslint-env mocha */

'use strict';

const assert = require('chai').assert;
const abac = require('./lib/stackbin');

const PermissionError = require('../src/error').PermissionError;

describe('Stackbin', function () {

    const ac = abac();

    it('Basic User check', function () {
        return ac.can('user:get', {user_id: '00000098038114680832'});
    });

    it('Basic User check REJECT', function () {

        return ac
            .can('user:get', {
                user_id: '00030164495926034432'
            })
            .then(() => {
                throw new Error('This test should disallow permission');
            })
            .catch(err => assert.instanceOf(err, PermissionError));
    });

});
