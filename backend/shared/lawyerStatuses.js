const Constant = require('./Constant');

module.exports = new Constant({
  INACTIVE: 0,
  ACTIVE: 1,
  SEND_INVITE: 2,
  ON_CALL: 3,
  DO_NOT_DISTURB: 4,
  BLOCKED: 10,
  DELETED: 20
}, 'LawyerStatuses');
