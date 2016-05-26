'use strict';

var validator = require('ajv');
var debug = require('debug')('canornot');
//var validator = require('is-my-json-valid');
//var validator = require('jsen');

var _ = {
    defaultsDeep: require('lodash.defaultsdeep'),
    omit: require('lodash.omit')
};

function PermissionError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}
//require('util').inherits(PermissionError, Error);

module.exports = function Canoronot(options) {

    options = options || {
            rejectOnValidatorError: false,
            rejectOnPermissionDenied: false
        };

    options = _.defaultsDeep(options || {}, {
        rejectOnValidatorError: true,
        rejectOnPermissionDenied: false
    });

    /**
     * @returns {Promise<Object>}
     */
    function getPolicySchema() {
        if (typeof options.policySchema === 'function') {
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
            return Promise.resolve(options.policySchema);
        }

    }

    /**
     * @returns {Promise<Object>}
     */
    function getActorSchema() {
        if (typeof options.actorSchema === 'function') {
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
            return Promise.resolve(options.actorSchema);
        }
    }

    /**
     * @returns {Promise}
     */
    function init() {

        return Promise.resolve();

        // return Promise.all([getActorSchema(), getPolicySchema()])
        //     .then(function (results) {
        //
        //         var actorSchema = results[0];
        //         var policySchema = results[1];
        //
        //         if (typeof actorSchema !== 'object') {
        //             throw new TypeError('Actor Schema must be an object or a function/promise that returns an object. Saw ' + typeof actorSchema);
        //         }
        //
        //         if (typeof policySchema !== 'object') {
        //             throw new TypeError('Policy Schema must be an object or a function/promise that returns an object. Saw ' + typeof policySchema);
        //         }
        //
        //         if (!loaded) {
        //             try {
        //                 console.log('adding actor schema');
        //                 validator.addSchema(actorSchema, 'actor');
        //                 console.log('adding policy schema');
        //                 validator.addSchema(policySchema, 'policy');
        //                 loaded = true;
        //             } catch (err) {
        //                 console.log('kakked it', err.message);
        //                 throw new Error('Failed to add policy or actor schema: ' + err.message);
        //
        //             }
        //         } else {
        //             console.log('policies already loaded');
        //         }
        //
        //     });
    }

    /**
     * @param {String} permission
     * @param {*} data
     * @returns {Promise.<Boolean>}
     */
    this.can = function (permission, data) {

        if (typeof permission !== 'string') {
            return Promise.reject(new TypeError('Permission must be a string'));
        }

        return init()
            .then(function () {

                // AJV
                return Promise.all([getActorSchema(), getPolicySchema()])
                    .then(function (results) {

                        var actorSchema = results[0];
                        var policySchema = results[1];

                        if (typeof actorSchema !== 'object') {
                            throw new TypeError('Actor Schema must be an object or a function/promise that returns an object. Saw ' + typeof actorSchema);
                        }

                        if (typeof policySchema !== 'object') {
                            throw new TypeError('Policy Schema must be an object or a function/promise that returns an object. Saw ' + typeof policySchema);
                        }

                        var ajv = validator({
                            breakOnError: true
                            //allErrors: true,
                            //v5: true
                        });

                        ajv.addSchema(actorSchema, 'actor');
                        ajv.addSchema(policySchema, 'policy');

                        var validate = ajv.compile({
                            $ref: 'policy#/properties/' + permission
                        });

                        var valid = validate(data);

                        debug('Permission `%s` against data `%s` - allowed: `%s`', permission, JSON.stringify(data), valid);

                        debug('rejectOnPermissionDenied: `%s`', options.rejectOnPermissionDenied);

                        if (options.rejectOnPermissionDenied === true) {
                            if (!valid) {
                                debug('Throwing PermissionError', validate.errors);
                                var err = new PermissionError('Permission Denied for `' + permission + '` against `' + JSON.stringify(data) + '`');
                                err.errors = validate.errors;
                                throw err;
                            } else {
                                return data;
                            }
                        } else {
                            debug('Returning `%s` result: %s', permission, valid);
                            return valid;
                        }

                    });

                // IS MY JSON VALID
                // return Promise.all([getPolicySchema(), getActorSchema()])
                //     .then(function (results) {
                //
                //         var actorSchema = results[0];
                //         var policySchema = results[1];
                //
                //         var validate = validator({
                //             $ref: 'policy#/properties/' + permission
                //         }, {
                //             // verbose: true,
                //             // greedy: true,
                //             schemas: {
                //                 policy: policySchema,
                //                 actor: actorSchema
                //             }
                //         });
                //
                //         console.log('validating', data);
                //         console.info('config', {
                //             $ref: 'policy#/properties/' + permission
                //         }, {
                //             // verbose: true,
                //             // greedy: true,
                //             schemas: {
                //                 policy: policySchema,
                //                 actor: actorSchema
                //             }
                //         });
                //
                //         return validate(data);
                //
                //     });

                // JSEN
                // return Promise.all([getPolicySchema(), getActorSchema()])
                //     .then(function (results) {
                //
                //         var actorSchema = results[0];
                //         var policySchema = results[1];
                //
                //         var validate = validator({
                //             $ref: '#policy/properties/' + permission
                //         }, {
                //             missing$Ref: true,
                //             schemas: {
                //                 policy: policySchema,
                //                 actor: actorSchema
                //             }
                //         });
                //
                //         var valid = validate(data);
                //
                //         return valid;
                //
                //     });

            })
            .catch(function (err) {

                // if (options.rejectOnValidatorError === true) {
                //     throw err;
                // } else {
                //     return false;
                // }

                // AJV
                if (err instanceof validator.ValidationError) {
                    if (options.rejectOnPermissionDenied === true) {
                        throw new PermissionError(err.message);
                    } else {
                        return false;
                    }
                } else {

                    if (options.rejectOnValidatorError === true) {
                        throw new Error(err.message);
                    } else {
                        return false;
                    }
                }

            });
    };

    this.has = this.can;

};
