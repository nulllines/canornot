# Canornot?

[![Build Status](https://travis-ci.org/maxholman/canornot.svg?branch=master)](https://travis-ci.org/maxholman/canornot)

An experimental authorisation and access control library based on JSON Schema.

## Warning: highly experimental

This is known to not be particularly performant, and the API will likely change at the drop of a hat.

Use at your own risk.

### Install

```bash
npm install canornot --save
```

### Usage

Example ABAC module based on Canornot

```javascript
var Canornot = require('canornot');
var datastore = require('some-kind-of-datastore');

// A policy that allows getting your own user details, and editing companies
// in your list of company ids
var policySchema = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    properties: {
        'user:get': {
            $ref: 'actor#/properties/user_id'
        },
        'company:edit': {
            $ref: 'actor#/properties/company_ids'
        }
    }
};

function getActorSchema(user_id) {
    return datastore.fetchUserById(user_id)
        .then(function (user) {
            return {
                id: 'actor',
                $schema: 'http://json-schema.org/draft-04/schema#',
                description: 'Actor Properties',
                type: 'object',
                additionalProperties: false,
                properties: {
                    user_id: {
                        type: 'number',
                        enum: [user.id]
                    },
                    company_ids: {
                        type: 'number',
                        enum: user.company_ids
                    }
                }
            };
        });
    }
}

module.exports = function (options) {
    return new Canornot({
        actorSchema: getActorSchema(options.user_id),
        policySchema: policySchema
    });
};

```


Example use of the above ABAC module

```javascript
//This is our ABAC module based on Canornot
var abac  = require('./abac.js');

// Create a check method based on this user id
var user_id = 12344;
var permission = abac(user_id);

permission.can('user:get', user_id)
    .then(function () {
        console.log('Permission allowed!');
    })
    .catch(function () {
        console.log('Permission denied!');
    })
```

### Support

Any feedback or thoughts via GitHub issue tracker.

### License

See LICENCE file.
