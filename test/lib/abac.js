/* jshint mocha: true */

'use strict';

var Canornot = require('../../src/index');

var policySchema = {
    additionalProperties: false,
    properties: {
        'user:get': {
            $ref: 'actor#/properties/user_id'
        },
        'project:get': {
            $ref: 'actor#/properties/project_ids'
        },
        'account:get': {
            required: ['account_id'],
            type: 'object',
            properties: {
                account_id: {
                    $ref: 'actor#/properties/account_ids'
                }
            }
        },
        'account:list': {
            $ref: 'actor#/properties/account_ids'
        },
        'project:list': {}
    },
    patternProperties: {
        "^payment:\w+$": {
            $ref: 'actor#/properties/account_ids'
        }
    }
};

function getActorSchema() {
    return {
        id: 'actor',
        $schema: 'http://json-schema.org/draft-04/schema#',
        description: 'Actor Properties',
        type: 'object',
        properties: {
            user_id: {
                type: 'number',
                enum: [2222]
            },
            project_ids: {
                type: 'number',
                enum: [1, 2, 3, 4, 5]
            },
            account_ids: {
                type: 'number',
                enum: [11, 22, 33, 44]
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
        rejectOnPermissionDenied: false,
        actorSchema: getActorSchema(),
        policySchema: policySchema
    });
};
