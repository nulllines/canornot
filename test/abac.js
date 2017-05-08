/* eslint-env mocha */

'use strict';

const abac = require('./lib/abac');

describe('ABAC', function () {

    const ac = abac();

    it('Permission attributes with no more info', function () {

        return ac.can('project:list')
            .then(allowed => {
                if (allowed !== true) {
                    throw new Error('Permission denied');
                }
            });
    });

    it('Permission attributes as integer', function () {

        return ac.can('project:get', 3)
            .then(allowed => {
                if (allowed !== true) {
                    throw new Error('Permission denied');
                }
            });
    });

    it('Permission attributes as integer (REJECTED)', function () {

        return ac.can('project:get', 99999)
            .then(allowed => {
                if (allowed === true) {
                    throw new Error('This test should disallow permission');
                }
            });
    });

    it('Permission user:get attributes as undefined (REJECTED)', function () {

        return ac.can('user:get')
            .then(allowed => {
                if (allowed === true) {
                    throw new Error('This test should disallow permission');
                }
            });
    });

    it('Permission attributes as object', function () {

        return ac.can('account:get', {account_id: 22})
            .then(allowed => {
                if (allowed !== true) {
                    throw new Error('Permission denied');
                }
            });
    });

    it('Permission attributes as object (REJECTED)', function () {

        return ac.can('account:get', {account_id: 999999})
            .then(allowed => {
                if (allowed === true) {
                    throw new Error('This test should disallow permission');
                }
            });
    });

    it('Permission attributes as object w/undefiend values (REJECTED)', function () {

        return ac.can('account:get', {account_id: undefined})
            .then(allowed => {
                if (allowed === true) {
                    throw new Error('This test should disallow permission');
                }
            });
    });

});
