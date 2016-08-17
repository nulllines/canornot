/* jshint mocha: true */

'use strict';

var rbac = require('./lib/rbac');

describe('RBAC', function () {

    var ac = rbac();

    it('Basic role check', function (done) {

        ac.has('role', 'admin')
            .then(function (allowed) {
                if (allowed === true) {
                    done();
                } else {
                    throw new Error('Permission denied');
                }
            })
            .catch(done);
    });

});
