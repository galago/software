const Constant = require('./Constant');

module.exports = new Constant({
  ON_CALL: 0,
  RANKING: 5,
  COMPLETE: 10,
  NO_COMPLETE: 20
}, 'ClientStatuses');
