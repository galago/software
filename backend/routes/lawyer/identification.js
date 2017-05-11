const co = require('co');
const validator = require('validator');

const LawyerStatuses = require('../../shared/lawyerStatuses');
const LawyerTypes = require('../../shared/lawyerTypes');

const toMysqlFormat = require('../../util/format').toMysqlFormat;

const promiseGetLawyerByPhone = require('../../util/lawyer').promiseGetLawyerByPhone;
const promiseSaveIdent = require('../../util/lawyer').promiseSaveIdent;

module.exports = function(app) {

  app.post('/lawyers/identification', function(req, res) {
    co(function * () {

      if (!(validator.isMobilePhone(req.body.phone, 'ru-RU'))) {
        res.status(403).send({message: 'lawyer phone not russia'});
        return;
      }
      //if (!(validator.isMobilePhone(req.body.phone, 'vi-VN'))) {
      //  res.status(403).send({message: 'client phone not VN'});
      //  return;
      //}

      let lawyer = yield promiseGetLawyerByPhone(Number(req.body.phone));
      if (lawyer.length) {
        res.status(403).send({message: 'lawyer phone is exist'});
      } else {
        req.body.lastname = 'new';
        req.body.login = req.body.phone;
        req.body.password = '1000';
        req.body.counter = 0;
        req.body.amount = 0;
        req.body.status = LawyerStatuses.get('INACTIVE');
        req.body.created = toMysqlFormat(new Date());
        req.body.updated = toMysqlFormat(new Date());
        yield promiseSaveIdent(req.body);
        console.log('lawyer identification OK');
        res.status(200).send({message: 'lawyer SMS code: 1000'});
      }

    }).catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
  });

};
