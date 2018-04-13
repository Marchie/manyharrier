'use strict';

module.exports = (logger) => {
  return (level, data) => {
    switch (level) {
      case 'warning':
        logger.warn(data);
        break;
      default:
        logger[level](data);
    }
  };
};
