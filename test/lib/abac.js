/* jshint mocha: true */

'use strict';

var Canornot = require('../../src/index');
var policySchema = require('./../fixtures/abac.json');

function getActorSchema() {
    return {
        id: 'actor',
        $schema: 'http://json-schema.org/draft-04/schema#',
        description: 'Actor Properties',
        type: 'object',
        additionalProperties: false,
        properties: {
            user_id: {
                type: 'number',
                enum: [2222]
            },
            project_ids: {
                type: 'number',
                enum: [1,2,3,4,5]
            },
            account_ids: {
                type: 'number',
                enum: [11,22,33,44]
            },
            role: {
                type: 'string',
                enum: ['user', 'admin']
            }

        }
    };
}

module.exports = function (/*options*/) {
    return new Canornot({
        actorSchema: getActorSchema(),
        policySchema: policySchema
    });
};
