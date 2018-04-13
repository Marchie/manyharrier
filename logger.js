'use strict';

const {Logger, transports} = require('winston');

module.exports = (config) => {
  return new Logger({
    level: config.get('logger:level'),
    transports: [
      new (transports.Console)({
        json: true,
        colorize: true
      })
    ]
  });
};
