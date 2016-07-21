/* jshint mocha: true */

'use strict';

var rbac = require('./lib/stackbin');

describe('Stackbin', function () {

    var ac = rbac();

    it('Basic User check', function (done) {

        ac
            .can('user:get', {
                user_id: '00000098038114680832'
            })
            .then(function (allowed) {
                if (allowed === true) {
                    done();
                } else {
                    throw new Error('This test should allow permission');
                }
            })
            .catch(done);
    });

    it('Basic User check REJECT', function (done) {

        ac
            .can('user:get', {
                user_id: '00030164495926034432'
            })
            .then(function () {
                throw new Error('This test should disallow permission');
            })
            .catch(function () {
                done();
            });
    });

});
