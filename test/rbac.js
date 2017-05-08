/* eslint-env mocha */

'use strict';

const rbac = require('./lib/rbac');

describe('RBAC', function () {

    const ac = rbac();

    it('Basic role check', function () {

        return ac.has('role', 'admin')
            .then(allowed => {
                if (allowed !== true) {
                    throw new Error('Permission denied');
                }
            });
    });

});
