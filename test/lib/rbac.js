/* jshint mocha: true */

'use strict';

var Canornot = require('../../src/index');
var policySchema = require('../fixtures/rbac.json');

function getActorSchema(cb) {
    cb({
        properties: {
            roles: {
                type: 'string',
                enum: ['admin', 'user']
            }
        }
    });
}

function getActorSchemaPromise() {
    return Promise.resolve({
        properties: {
            roles: {
                type: 'string',
                enum: ['admin', 'user']
            }
        }
    });
}

module.exports = function (/*options*/) {
    return new Canornot({
        actorSchema: getActorSchemaPromise(),
        policySchema: policySchema
    });
};
