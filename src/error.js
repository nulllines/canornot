'use strict';

const util = require('util');

function PermissionError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
}

util.inherits(PermissionError, Error);

module.exports = {
    PermissionError
};
