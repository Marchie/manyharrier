'use strict';

const _ = require('lodash');
const contentfulClient = require('../contentful');
const validityFilter = require('./validity-filter');

module.exports = (config, logger) => {
  return (req, res, next) => {
    return contentfulClient(config, logger)
      .getEntries({
        'content_type': 'alert'
      })
      .then((response) => {
        return _(response.items)
          .map((item) => {
            return item.fields;
          })
          .filter(validityFilter)
          .value();
      })
      .then((filtered) => {
        res.json(filtered);
      })
      .catch((err) => {
        next(err);
      });
  };
};
