/* eslint-env mocha */
'use strict';

const util = require('util');
const Canornot = require('../src/index');
const assert = require('chai').assert;

const ValidationError = require('ajv').ValidationError;
const PermissionError = require('../src/error').PermissionError;

function TestError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}

util.inherits(TestError, Error);

const policySchema = {
    properties: {
        'user:get': {
            $ref: 'actor#/properties/user_id'
        }
    }
};

const actorSchema = {
    properties: {
        user_id: {
            type: 'number',
            enum: [1]
        }
    }
};

const acWithTimeoutCallbacks = () => new Canornot({
    actorSchema: cb => setTimeout(() => cb(actorSchema), 200),
    policySchema: cb => setTimeout(() => cb(policySchema), 200)
});

const acWithTimeoutCallbackActorError = () => new Canornot({
    actorSchema: cb => setTimeout(() => cb(new TestError('Intentional Error')), 200),
    policySchema: cb => setTimeout(() => cb(policySchema), 200)
});

const acWithTimeoutCallbackPolicyError = () => new Canornot({
    actorSchema: cb => setTimeout(() => cb(new TestError('Intentional Error')), 200),
    policySchema: cb => setTimeout(() => cb(new TestError('Intentional Error')), 200)
});

const acWithTimeoutPromises = () => new Canornot({
    actorSchema: new Promise(resolve => setTimeout(() => resolve(actorSchema), 200)),
    policySchema: new Promise(resolve => setTimeout(() => resolve(policySchema), 200))
});

const acWithTimeoutBrokenPromises = () => new Canornot({
    actorSchema: new Promise((_, reject) => setTimeout(() => reject(new TestError('Intentional Error')), 200)),
    policySchema: new Promise((_, reject) => setTimeout(() => reject(new TestError('Intentional Error')), 200))
});

const acWithObjects = () => new Canornot({
    actorSchema: actorSchema,
    policySchema: policySchema
});

const acWithFunctions = () => new Canornot({
    actorSchema: () => actorSchema,
    policySchema: () => policySchema
});

const acWithStrings1 = () => new Canornot({
    actorSchema: 'hahaha',
    policySchema: policySchema
});

const acWithStrings2 = () => new Canornot({
    actorSchema: actorSchema,
    policySchema: 'heeee'
});

const acWithNoOptions = () => new Canornot();

const acWithRejectOnPermissionDenied = () => new Canornot({
    actorSchema: actorSchema,
    policySchema: policySchema,
    rejectOnPermissionDenied: true
});

const acWithoutRejectOnPermissionDenied = () => new Canornot({
    actorSchema: actorSchema,
    policySchema: policySchema,
    rejectOnPermissionDenied: false
});

const acWithoutRejectOnError = () => new Canornot({
    actorSchema: Promise.reject(new ValidationError()),
    policySchema: Promise.reject(new ValidationError()),
    rejectOnError: false
});

const acWithRejectOnError = () => new Canornot({
    actorSchema: Promise.reject(new ValidationError()),
    policySchema: Promise.reject(new ValidationError())
});

describe('Base', function () {

    it('Access Control with schema provided via callback', function () {

        const permission = acWithTimeoutCallbacks();
        this.timeout(400);

        return permission.can('user:get', 1)
            .then(allowed => {
                if (allowed !== true) {
                    throw new Error('Unexpectedly forbidden');
                }
            });
    });

    it('Access Control with schema provided via Promises', function () {

        const permission = acWithTimeoutPromises();
        this.timeout(400);

        return permission.can('user:get', 1)
            .then(allowed => {
                if (allowed !== true) {
                    throw new Error('Unexpectedly forbidden');
                }
            });
    });

    it('Access Control with schema provided via objects', function () {

        const permission = acWithObjects();

        return permission.can('user:get', 1)
            .then(allowed => {
                if (allowed !== true) {
                    throw new Error('Unexpectedly forbidden');
                }
            });
    });

    it('Access Control with schema provided via functions', function () {

        const permission = acWithFunctions();

        return permission.can('user:get', 1)
            .then(allowed => {
                if (allowed !== true) {
                    throw new Error('Unexpectedly forbidden');
                }
            });
    });

    it('Access Control with broken promises', function () {

        const permission = acWithTimeoutBrokenPromises();
        this.timeout(400);

        return permission.can('user:get', 1)
            .then(() => {
                throw new Error('This test should throw an error');
            })
            .catch(err => {
                assert.instanceOf(err, TestError);
            });
    });

    it('Access Control with callback actor errors', function () {

        const permission = acWithTimeoutCallbackActorError();
        this.timeout(400);

        return permission.can('user:get', 1)
            .then(() => {
                throw new Error('This test should throw an error');
            })
            .catch(err => assert.instanceOf(err, TestError));
    });

    it('Access Control with callback policy errors', function () {

        const permission = acWithTimeoutCallbackPolicyError();
        this.timeout(400);

        return permission.can('user:get', 1)
            .then(() => {
                throw new Error('This test should throw an error');
            })
            .catch(err => assert.instanceOf(err, TestError));
    });

    it('Access Control with callback policy errors', function () {

        const permission = acWithTimeoutCallbackPolicyError();
        this.timeout(400);

        return permission.can('user:get', 1)
            .then(() => {
                throw new Error('This test should throw an error');
            })
            .catch(err => assert.instanceOf(err, TestError));
    });

    it('Access Control with policy TypeErrors0', function () {

        const permission = acWithObjects();

        return permission.can(1111111)
            .then(() => {
                throw new Error('This test should throw an error');
            })
            .catch(err => assert.instanceOf(err, TypeError));
    });

    it('Access Control with policy TypeErrors1', function () {

        const permission = acWithStrings1();

        return permission.can('user:get', 1)
            .then(() => {
                throw new Error('This test should throw an error');
            })
            .catch(err => assert.instanceOf(err, TypeError));
    });

    it('Access Control with policy TypeErrors2', function () {

        const permission = acWithStrings2();

        return permission.can('user:get', 1)
            .then(() => {
                throw new Error('This test should throw an error');
            })
            .catch(err => {
                assert.instanceOf(err, TypeError);
            });
    });

    it('Access Control with no options', function () {

        const permission = acWithNoOptions();

        return permission.can('user:get', 1)
            .then(() => {
                throw new Error('This test should throw an error');
            })
            .catch(err => {
                assert.instanceOf(err, TypeError);
            });
    });

    it('Access Control with reject (expected fail)', function () {

        const permission = acWithRejectOnPermissionDenied();

        return permission.can('user:get', 99999999999)
            .then(() => {
                throw new Error('This test should throw an error');
            })
            .catch(err => assert.instanceOf(err, PermissionError));
    });

    it('Access Control with reject (expected success)', function () {

        const permission = acWithRejectOnPermissionDenied();

        return permission.can('user:get', 1);

    });

    it('Access Control without reject', function () {

        const permission = acWithoutRejectOnPermissionDenied();

        return permission.can('user:get', 999999999)
            .then(valid => assert.isNotOk(valid));
    });

    it('Access Control missing permission', function () {

        const permission = acWithObjects();

        return permission.can('missing:permission', 999999999)
            .then(() => {
                throw new Error('This test should throw an error');
            })
            .catch(err => assert.instanceOf(err, PermissionError));
    });

    it('Access Control without reject on validator error', function () {

        const permission = acWithoutRejectOnError();

        return permission.can('missing:permission', 999999999)
            .then(valid => assert.isNotOk(valid));
    });

    it('Access Control with reject on validator error', function () {

        const permission = acWithRejectOnError();

        return permission.can('missing:permission', 999999999)
            .then(() => {
                throw new Error('This test should throw an error');
            })
            .catch(err => assert.instanceOf(err, ValidationError));
    });

    // it('Access Control using patternProperties to allow an entire namespace', function () {
    //
    //     const permission = acWithObjects();
    //
    //     return permission.can('payment:something', 33)
    //         .then(function (valid) {
    //             assert.isNotOk(valid);
    //             done();
    //         })
    //         .catch(done);
    // });

});
