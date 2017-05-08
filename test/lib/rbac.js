'use strict';

const Canornot = require('../../src/index');

const policySchema = {
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

module.exports = (/*options*/) => {
    return new Canornot({
        actorSchema: getActorSchemaPromise(),
        policySchema: policySchema
    });
};
