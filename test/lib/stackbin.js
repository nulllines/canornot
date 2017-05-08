'use strict';

const Canornot = require('../../src/index');

const policySchema = {
    id: 'policy',
    description: 'Generic User Policy',
    definitions: {
        account_id: {
            type: 'object',
            additionalProperties: false,
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
            additionalProperties: false,
            properties: {
                project_id: {
                    $ref: 'actor#/properties/project_id'
                }
            }
        },
        user_id: {
            type: 'object',
            required: ['user_id'],
            additionalProperties: false,
            properties: {
                user_id: {
                    $ref: 'actor#/properties/user_id'
                }
            }
        }
    },
    additionalProperties: false,
    properties: {

        /**
         * USERS
         */
        'user:get': {
            $ref: '#/definitions/user_id'
        },
        'user:update': {
            $ref: '#/definitions/user_id'
        }

    }
};

const actorSchema = {
    id: 'actor',
    description: 'User Actor',
    type: 'object',
    additionalProperties: false,
    properties: {
        user_id: {
            enum: ['00000098038114680832']
        }
    }
};

module.exports = (/*options*/) => {
    return new Canornot({
        rejectOnValidatorError: true,
        rejectOnPermissionDenied: true,
        returnSchemas: true,
        actorSchema: actorSchema,
        policySchema: policySchema
    });
};
