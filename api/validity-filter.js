'use strict';

const _ = require('lodash');
const Moment = require('moment');

module.exports = (data) => {
  const validFrom = _.get(data, ['validFrom']);
  const validUntil = _.get(data, ['validUntil']);

  const now = new Moment();

  if (validFrom) {
    if (now.isBefore(new Moment(validFrom))) {
      return false;
    }
  }

  if (validUntil) {
    if (now.isAfter(new Moment(validUntil))) {
      return false;
    }
  }

  return true;
};
