const ClientStatuses = require('../shared/clientStatuses');
const toMysqlFormat = require('./format').toMysqlFormat;

const promiseGetClientByPhone = (phone) => promiseQuery(
`SELECT * FROM Client WHERE phone = '${phone}' `);

const promiseGetClientById = (id) => promiseQuery(
`SELECT * FROM Client WHERE id = '${id}' `);

const promiseSaveIdent = (oReq) => promiseQuery(
 'INSERT INTO client SET ?', [oReq]);

 const promiseSignClient = (clientid, status, counter, nextime) => promiseQuery(
   `UPDATE
       Client C
     SET C.status = ${status}, C.counter = ${counter}, C.updated = '${nextime}'
     WHERE
       C.ID = ${clientid}`);

const promiseChangeStatusClient = (clientid, status, updated) => promiseQuery(
 `UPDATE
     Client C
   SET C.status = ${status}, C.updated = '${updated}'
   WHERE
     C.ID = ${clientid}`);

const Client = {
  promiseGetClientById,
  promiseGetClientByPhone,
  promiseSaveIdent,
  promiseSignClient,
  promiseChangeStatusClient
};

module.exports = Client;
