'use strict';

const validator = require('ajv');
const debug = require('debug')('canornot');

const PermissionError = require('./error').PermissionError;

module.exports = function Canornot(opts = {}) {

    const options = Object.assign({
        rejectOnError: true,
        rejectOnPermissionDenied: true,
        returnSchemas: false
    }, opts);

    /**
     * @returns {Promise<Object>}
     */
    function getPolicySchema() {
        if (typeof options.policySchema === 'function') {

            // accepts a callback arguments
            if (options.policySchema.length === 1) {
                return new Promise(function (resolve, reject) {

                    return options.policySchema(function (result) {
                        if (result instanceof Error) {
                            reject(result);
                        } else {
                            resolve(result);
                        }
                    });
                });
            } else {
                return Promise.resolve(options.policySchema());
            }

        } else if (typeof options.policySchema === 'object' && typeof options.policySchema.then === 'function') {
            return options.policySchema;
        } else {
            return Promise.resolve(options.policySchema);
        }
    }

    /**
     * @returns {Promise<Object>}
     */
    function getActorSchema() {
        if (typeof options.actorSchema === 'function') {

            // accepts a callback arguments
            if (options.actorSchema.length === 1) {
                return new Promise(function (resolve, reject) {

                    return options.actorSchema(function (result) {
                        if (result instanceof Error) {
                            reject(result);
                        } else {
                            resolve(result);
                        }
                    });
                });
            } else {
                return Promise.resolve(options.actorSchema());
            }

        } else if (typeof options.actorSchema === 'object' && typeof options.actorSchema.then === 'function') {
            return options.actorSchema;
        } else {
            return Promise.resolve(options.actorSchema);
        }
    }

    /**
     * @param {String} permission
     * @param {String|Number|Object|Array} [data={}]
     * @returns {Promise.<Boolean>}
     */
    this.can = (permission, data = {}) => {

        if (typeof permission !== 'string') {
            return Promise.reject(new TypeError('Permission must be a string'));
        }

        return Promise.all([getActorSchema(), getPolicySchema()])
            .then(schemas => {

                const [actorSchema, policySchema] = schemas;

                if (typeof actorSchema !== 'object') {
                    debug('Invalid actor schema');
                    throw new TypeError('Actor Schema must be an object or a function/promise that returns an object. Saw ' + typeof actorSchema);
                }

                if (typeof policySchema !== 'object') {
                    debug('Invalid policy schema');
                    throw new TypeError('Policy Schema must be an object or a function/promise that returns an object. Saw ' + typeof policySchema);
                }

                policySchema.additionalProperties = false;

                const ajv = validator({
                    missingRefs: 'fail',
                    breakOnError: true
                });

                ajv.addSchema(actorSchema, 'actor');

                const valid = ajv.validate(policySchema, {
                    [permission]: data
                });

                // tiny bit of safety to stop stringifying everything even if we're not going to be outputting anything
                /* istanbul ignore next */
                if (process.env.DEBUG) {
                    debug('policySchema', JSON.stringify(policySchema));
                    debug('actorSchema', JSON.stringify(actorSchema));
                    debug('Permission data', JSON.stringify({
                        [permission]: data
                    }));
                }

                debug('Permission allowed/valid?', valid);

                if (options.rejectOnPermissionDenied === true) {
                    if (!valid) {
                        debug('Throwing PermissionError', ajv.errors);
                        const err = new PermissionError('Permission Denied for `' + permission + '` against `' + JSON.stringify(data) + '`');
                        err.errors = ajv.errors;
                        throw err;
                    } else {
                        if (options.returnSchemas) {
                            return {
                                actor: actorSchema,
                                policy: policySchema
                            };
                        } else {
                            return valid;
                        }
                    }
                } else {
                    debug('Returning `%s` result: %s', permission, valid);
                    return valid;
                }

            })
            .catch(err => {

                debug('Error fetching actor or policy schema', err.message);

                // it's not a basic permission error;
                if (err instanceof PermissionError && options.rejectOnPermissionDenied === true) {
                    throw err;
                } else {
                    if (options.rejectOnError === true) {
                        throw err;
                    } else {
                        return false;
                    }
                }

            });
    };

    this.has = this.can;

};
