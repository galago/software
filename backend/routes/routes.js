const express = require('express');

module.exports = function(app) {
  const router = express.Router();
  app.use(router);

  require('./client/identification')(router);
  require('./client/signup')(router);
  require('./client/signin')(router);
  require('./client/call')(router);

  require('./lawyer/identification')(router);
  require('./lawyer/signup')(router);
  require('./lawyer/signin')(router);
  require('./lawyer/call')(router);

};
