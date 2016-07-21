/* jshint mocha: true */

'use strict';

var Canornot = require('../../src/index');

var policySchema = {
    id: 'policy',
    $schema: 'http://json-schema.org/draft-04/schema#',
    description: 'Generic User Policy',
    additionalProperties: false,
    definitions: {
        account_id: {
            type: 'object',
            additionalProperties: true,
            required: ['account_id'],
            properties: {
                account_id: {
                    $ref: 'actor#/properties/account_id'
                }
            }
        },
        project_id: {
            type: 'object',
            required: ['project_id'],
            additionalProperties: true,
            properties: {
                account_id: {
                    $ref: 'actor#/properties/project_id'
                }
            }
        },
        user_id: {
            type: 'object',
            required: ['user_id'],
            additionalProperties: true,
            properties: {
                account_id: {
                    $ref: 'actor#/properties/user_id'
                }
            }
        }
    },
    properties: {

        /**
         * USERS
         */
        'user:get': {
            $ref: '#/definitions/user_id'
        },
        'user:update': {
            $ref: '#/definitions/user_id'
        },

    }
};

var actorSchema = {
    id: 'actor',
    $schema: 'http://json-schema.org/draft-04/schema#',
    description: 'User Actor',
    type: 'object',
    additionalProperties: false,
    properties: {
        user_id: {enum: ['00000098038114680832']}
    }
};

module.exports = function (/*options*/) {
    return new Canornot({
        rejectOnValidatorError: true,
        rejectOnPermissionDenied: true,
        returnSchemas: true,
        actorSchema: actorSchema,
        policySchema: policySchema
    });
};
