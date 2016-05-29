/* jshint mocha: true */
'use strict';

var Canornot = require('../src/index');
var assert = require('chai').assert;

var policySchema = {
    properties: {
        'user:get': {
            $ref: 'actor#/properties/user_id'
        }
    }
};

var actorSchema = {
    properties: {
        user_id: {
            type: 'number',
            enum: [1]
        }
    }
};

var acWithCallbacks = function (/*options*/) {
    return new Canornot({
        actorSchema: function (cb) {
            setTimeout(function () {
                cb(actorSchema);
            }, 200);
        },

        policySchema: function (cb) {
            setTimeout(function () {
                cb(policySchema);
            }, 200);
        }
    });
};

var acWithCallbackActorError = function (/*options*/) {
    return new Canornot({
        actorSchema: function (cb) {
            setTimeout(function () {
                cb(new Error());
            }, 200);
        },

        policySchema: function (cb) {
            setTimeout(function () {
                cb(policySchema);
            }, 200);
        }
    });
};

var acWithCallbackPolicyError = function (/*options*/) {
    return new Canornot({
        actorSchema: function (cb) {
            setTimeout(function () {
                cb(actorSchema);
            }, 200);
        },

        policySchema: function (cb) {
            setTimeout(function () {
                cb(new Error());
            }, 200);
        }
    });
};

var acWithPromises = function (/*options*/) {

    return new Canornot({
        actorSchema: new Promise(function (resolve) {
            setTimeout(function () {
                resolve(actorSchema);
            }, 200);
        }),

        policySchema: new Promise(function (resolve) {
            setTimeout(function () {
                resolve(policySchema);
            }, 200);
        })
    });
};

var acWithBrokenPromises = function (/*options*/) {

    return new Canornot({
        actorSchema: new Promise(function (resolve, reject) {
            setTimeout(function () {
                reject(new Error());
            }, 200);
        }),

        policySchema: new Promise(function (resolve, reject) {
            setTimeout(function () {
                reject(new Error());
            }, 200);
        })
    });
};

var acWithObjects = function (/*options*/) {
    return new Canornot({
        actorSchema: actorSchema,
        policySchema: policySchema
    });
};

var acWithFunctions = function (/*options*/) {
    return new Canornot({
        actorSchema: function () {
            return actorSchema;
        },

        policySchema: function () {
            return policySchema;
        }
    });
};

var acWithStrings1 = function (/*options*/) {
    return new Canornot({
        actorSchema: 'hahaha',
        policySchema: policySchema
    });
};

var acWithStrings2 = function (/*options*/) {
    return new Canornot({
        actorSchema: actorSchema,
        policySchema: 'heeee'
    });
};

var acWithNoOptions = function (/*options*/) {
    return new Canornot();
};

var acWithRejectOnPermissionDenied = function (/*options*/) {
    return new Canornot({
        actorSchema: actorSchema,
        policySchema: policySchema,
        rejectOnPermissionDenied: true
    });
};

var acWithoutRejectOnPermissionDenied = function (/*options*/) {
    return new Canornot({
        actorSchema: actorSchema,
        policySchema: policySchema,
        rejectOnPermissionDenied: false
    });
};

var acWithoutRejectOnError = function (/*options*/) {
    return new Canornot({
        actorSchema: Promise.reject(new Canornot.validator.ValidationError()),
        policySchema: Promise.reject(new Canornot.validator.ValidationError()),
        rejectOnError: false
    });
};

var acWithRejectOnError = function (/*options*/) {
    return new Canornot({
        actorSchema: Promise.reject(new Canornot.validator.ValidationError()),
        policySchema: Promise.reject(new Canornot.validator.ValidationError())
    });
};

describe('Base', function () {

    it('Access Control with schema provided via callback', function (done) {

        var permission = acWithCallbacks();

        permission.can('user:get', 1)
            .then(function (allowed) {
                if (allowed === true) {
                    done();
                } else {
                    throw new Error('Unexpected allowance');
                }
            })
            .catch(done);
    });

    it('Access Control with schema provided via Promises', function (done) {

        var permission = acWithPromises();

        permission.can('user:get', 1)
            .then(function (allowed) {
                if (allowed === true) {
                    done();
                } else {
                    throw new Error('Unexpected allowance');
                }
            })
            .catch(done);
    });

    it('Access Control with schema provided via objects', function (done) {

        var permission = acWithObjects();

        permission.can('user:get', 1)
            .then(function (allowed) {
                if (allowed === true) {
                    done();
                } else {
                    throw new Error('Unexpected allowance');
                }
            })
            .catch(done);
    });

    it('Access Control with schema provided via functions', function (done) {

        var permission = acWithFunctions();

        permission.can('user:get', 1)
            .then(function (allowed) {
                if (allowed === true) {
                    done();
                } else {
                    throw new Error('Unexpected allowance');
                }
            })
            .catch(done);
    });

    it('Access Control with broken promises', function (done) {

        var permission = acWithBrokenPromises();

        permission.can('user:get', 1)
            .then(function () {
                done(new Error('This test should throw an error'));
            })
            .catch(function (err) {
                assert.instanceOf(err, Error);
                done();
            })
            .catch(done);
    });

    it('Access Control with callback actor errors', function (done) {

        var permission = acWithCallbackActorError();

        permission.can('user:get', 1)
            .then(function () {
                done(new Error('This test should throw an error'));
            })
            .catch(function (err) {
                assert.instanceOf(err, Error);
                done();
            })
            .catch(done);
    });

    it('Access Control with callback policy errors', function (done) {

        var permission = acWithCallbackPolicyError();

        permission.can('user:get', 1)
            .then(function () {
                done(new Error('This test should throw an error'));
            })
            .catch(function (err) {
                assert.instanceOf(err, Error);
                done();
            })
            .catch(done);
    });

    it('Access Control with callback policy errors', function (done) {

        var permission = acWithCallbackPolicyError();

        permission.can('user:get', 1)
            .then(function () {
                done(new Error('This test should throw an error'));
            })
            .catch(function (err) {
                assert.instanceOf(err, Error);
                done();
            })
            .catch(done);
    });

    it('Access Control with policy TypeErrors0', function (done) {

        var permission = acWithObjects();

        permission.can(1111111)
            .then(function () {
                done(new Error('This test should throw an error'));
            })
            .catch(function (err) {
                assert.instanceOf(err, TypeError);
                done();
            })
            .catch(done);
    });

    it('Access Control with policy TypeErrors1', function (done) {

        var permission = acWithStrings1();

        permission.can('user:get', 1)
            .then(function () {
                done(new Error('This test should throw an error'));
            })
            .catch(function () {
                done();
            })
            .catch(done);
    });

    it('Access Control with policy TypeErrors2', function (done) {

        var permission = acWithStrings2();

        permission.can('user:get', 1)
            .then(function () {
                done(new Error('This test should throw an error'));
            })
            .catch(function (err) {
                assert.instanceOf(err, TypeError);
                done();
            })
            .catch(done);
    });

    it('Access Control with no options', function (done) {

        var permission = acWithNoOptions();

        permission.can('user:get', 1)
            .then(function () {
                done(new Error('This test should throw an error'));
            })
            .catch(function (err) {
                assert.instanceOf(err, TypeError);
                done();
            })
            .catch(done);
    });

    it('Access Control with reject (expected fail)', function (done) {

        var permission = acWithRejectOnPermissionDenied();

        permission.can('user:get', 99999999999)
            .then(function () {
                done(new Error('This test should throw an error'));
            })
            .catch(function (err) {
                assert.instanceOf(err, Error);
                done();
            })
            .catch(done);
    });

    it('Access Control with reject (expected success)', function (done) {

        var permission = acWithRejectOnPermissionDenied();

        permission.can('user:get', 1)
            .then(function () {
                done();
            })
            .catch(done);
    });

    it('Access Control without reject', function (done) {

        var permission = acWithoutRejectOnPermissionDenied();

        permission.can('user:get', 999999999)
            .then(function (valid) {
                assert.isNotOk(valid);
                done();
            })
            .catch(done);
    });

    it('Access Control missing permission', function (done) {

        var permission = acWithObjects();

        permission.can('missing:permission', 999999999)
            .then(function () {
                done(new Error('This test should throw an error'));
            })
            .catch(function (err) {
                assert.instanceOf(err, Error);
                done();
            })
            .catch(done);
    });

    it('Access Control without reject on validator error', function (done) {

        var permission = acWithoutRejectOnError();

        permission.can('missing:permission', 999999999)
            .then(function (valid) {
                assert.isNotOk(valid);
                done();
            })
            .catch(done);
    });

    it('Access Control with reject on validator error', function (done) {

        var permission = acWithRejectOnError();

        permission.can('missing:permission', 999999999)
            .then(function () {
                done(new Error('This test should throw an error'));
            })
            .catch(function (err) {
                assert.instanceOf(err, Error);
                done();
            })
            .catch(done);
    });

});
