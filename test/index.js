/* jshint mocha: true */

'use strict';

var abac = require('./lib/abac');
var rbac = require('./lib/rbac');

describe('ABAC', function () {

    var ac = abac();

    it('Permission attributes with no more info', function (done) {

        ac.can('project:list')
            .then(function (allowed) {
                if (allowed === true) {
                    done();
                } else {
                    throw new Error('Permission denied');
                }
            })
            .catch(done);
    });

    it('Permission attributes as integer', function (done) {

        ac.can('project:get', 3)
            .then(function (allowed) {
                if (allowed === true) {
                    done();
                } else {
                    throw new Error('Permission denied');
                }
            })
            .catch(done);
    });

    it('Permission attributes as integer (REJECTED)', function (done) {

        ac.can('project:get', 99999)
            .then(function (allowed) {
                if (allowed === true) {
                    throw new Error('This test should disallow permission');
                } else {
                    done();
                }
            })
            .catch(done);
    });

    it('Permission user:get attributes as undefined (REJECTED)', function (done) {

        ac.can('user:get', undefined)
            .then(function (allowed) {
                if (allowed === true) {
                    throw new Error('This test should disallow permission');
                } else {
                    done();
                }
            })
            .catch(done);
    });

    it('Permission attributes as object', function (done) {

        ac.can('account:get', {account_id: 22})
            .then(function (allowed) {
                if (allowed === true) {
                    done();
                } else {
                    throw new Error('Permission denied');
                }
            })
            .catch(done);
    });

    it('Permission attributes as object (REJECTED)', function (done) {

        ac.can('account:get', {account_id: 999999})
            .then(function (allowed) {
                if (allowed === true) {
                    throw new Error('This test should disallow permission');
                } else {
                    done();
                }
            })
            .catch(done);
    });

    it('Permission attributes as object w/undefiend values (REJECTED)', function (done) {

        ac.can('account:get', {account_id: undefined})
            .then(function (allowed) {
                if (allowed === true) {
                    throw new Error('This test should disallow permission');
                } else {
                    done();
                }
            })
            .catch(done);
    });


});

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
