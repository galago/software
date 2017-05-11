const co = require('co');
const validator = require('validator');

const ClientStatuses = require('../../shared/clientStatuses');
const ClientTypes = require('../../shared/clientTypes');

const toMysqlFormat = require('../../util/format').toMysqlFormat;

const promiseGetClientByPhone = require('../../util/client').promiseGetClientByPhone;
const promiseSaveIdent = require('../../util/client').promiseSaveIdent;

module.exports = function(app) {

  app.post('/clients/identification', function(req, res) {
    co(function * () {

      if (!(validator.isMobilePhone(req.body.phone, 'ru-RU'))) {
        res.status(403).send({message: 'client phone not russia'});
        return;
      }
      //if (!(validator.isMobilePhone(req.body.phone, 'vi-VN'))) {
      //  res.status(403).send({message: 'client phone not VN'});
      //  return;
      //}

      let client = yield promiseGetClientByPhone(Number(req.body.phone));
      if (client.length) {
        res.status(403).send({message: 'phone is exist'});
      } else {
        req.body.lastname = 'new';
        req.body.login = req.body.phone;
        req.body.password = '1000';
        req.body.counter = 0;
        req.body.amount = 0;
        req.body.status = ClientStatuses.get('INACTIVE');
        req.body.created = toMysqlFormat(new Date());
        req.body.updated = toMysqlFormat(new Date());
        yield promiseSaveIdent(req.body);
        console.log('client identification OK');
        res.status(200).send({message: 'client SMS code: 1000'});
      }

    }).catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
  });

};
