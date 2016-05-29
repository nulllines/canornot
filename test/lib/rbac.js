/* jshint mocha: true */

'use strict';

var Canornot = require('../../src/index');

var policySchema = {
    properties: {
        role: {
            $ref: 'actor#/properties/roles'
        }
    }
};

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
