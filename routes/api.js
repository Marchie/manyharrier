'use strict';

module.exports = (router, config, logger) => {
  router.get('/alerts', require('../api/get-alerts')(config, logger));

  return router;
};
