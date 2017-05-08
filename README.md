# Canornot?

[![npm version](https://badge.fury.io/js/canornot.svg)](https://badge.fury.io/js/canornot) [![Build Status](https://travis-ci.org/nulllines/canornot.svg?branch=master)](https://travis-ci.org/maxholman/canornot) [![Coverage Status](https://coveralls.io/repos/github/nulllines/canornot/badge.svg?branch=master)](https://coveralls.io/github/nulllines/canornot?branch=master)

An authorisation and access control library based on JSON Schema.

### Install

Using NPM

```bash
npm install canornot --save
```

Using Yarn

```bash
yarn add canornot
```

### Usage

Example ABAC module based on Canornot

```javascript
const Canornot = require('canornot');
const datastore = require('some-kind-of-datastore');

// A policy that allows getting your own user details, and editing companies
// in your list of company ids
const policySchema = {
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
        .then(user => {
            return {
                id: 'actor',
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

module.exports = options => {
    return new Canornot({
        actorSchema: getActorSchema(options.user_id),
        policySchema: policySchema
    });
};

```


Example use of the above ABAC module

```javascript
//This is our ABAC module based on Canornot
const abac  = require('./abac.js');

// Create a check method using the provided details (user_id)
const permission = abac({user_id: 12344});

// Permission is allowed here
permission.can('user:get', 12344)
    .then(() => console.log('Permission allowed!'))
    .catch(() => console.log('Permission denied!'));

// Permission is denied here!
permission.can('user:get', 99999)
    .then(() => console.log('Permission allowed!'))
    .catch(() => console.log('Permission denied!'));
```

### Support

Via GitHub issue tracker

### License

MIT (See LICENCE file)
