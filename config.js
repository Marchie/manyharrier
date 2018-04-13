'use strict';

const nconf = require('nconf');

// 1. Configuration values provided on the command line
nconf.argv({
  parseValues: true
});

// 2. Configuration values provided by environment variables
nconf.env({
  parseValues: true,
  separator: '__'
});

// 3. Default configuration values
nconf.defaults({
  contentful: {
    spaceId: null,
    accessToken: null,
    host: null
  },
  http: {
    host: 'localhost',
    port: process.env.PORT || 3000
  },
  logger: {
    level: 'info'
  }
});

module.exports = nconf;
