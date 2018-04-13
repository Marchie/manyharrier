'use strict';

const {createClient} = require('contentful');
const logHandler = require('./log-handler');

module.exports = (config, logger) => {
  return createClient({
    accessToken: config.get('contentful:accessToken'),
    host: config.get('contentful:host'),
    logHandler: logHandler(logger),
    space: config.get('contentful:spaceId')
  });
};
