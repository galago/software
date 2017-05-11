const co = require('co');
const validator = require('validator');

const LawyerStatuses = require('../../shared/lawyerStatuses');
const LawyerTypes = require('../../shared/lawyerTypes');

const toMysqlFormat = require('../../util/format').toMysqlFormat;
const addMinutes  = require('../../util/format').addMinutes;

const promiseGetLawyerByPhone = require('../../util/lawyer').promiseGetLawyerByPhone;
const promiseSaveIdent = require('../../util/lawyer').promiseSaveIdent;
const promiseSignLawyer  = require('../../util/lawyer').promiseSignLawyer;

module.exports = function(app) {

  app.post('/lawyers/signup', function(req, res) {
    co(function * () {

      if (!(validator.isMobilePhone(req.body.phone, 'ru-RU'))) {
        res.status(400).send({message: 'lawyer phone not russia'});
        return;
      }
      if (!(validator.isLength(req.body.password, {min:4, max: 4}))) {
        res.status(400).send({message: 'lawyer password length  is not 4'});
        return;
      }

      let lawyer = yield promiseGetLawyerByPhone(Number(req.body.phone));
      if (lawyer.length) {

        let Updated = new Date(lawyer[0].updated);
        let Now = new Date();

        if (Updated > Now) {
          res.status(403).send({message: 'lawyer password is blocked. nexttime:}'+ client[0].updated});
          return;
        }

        if (lawyer[0].password == req.body.password) {

          yield promiseSignLawyer(
            LawyerStatuses.get('ACTIVE'),
            lawyer[0].ID, 0, toMysqlFormat(new Date()) );

          req.session.LawyerId = lawyer[0].ID; //Start new client session
          res.sendStatus(200);

        } else {
          if ((lawyer[0].counter)< 3) {

            yield promiseSignLawyer(
              lawyer[0].ID, LawyerStatuses.get('INACTIVE'),
              lawyer[0].counter + 1, toMysqlFormat(Now));

            res.status(403).send({message: 'lawyer password is wrong, current count: ' + (client[0].counter + 1)});

          } else {
            //Delay nexttime
            let nexttime = addMinutes(Now,  1);

            yield promiseSignLawyer(
              LawyerStatuses.get('INACTIVE'),
              lawyer[0].ID, 0, nexttime);

            res.status(403).send({message: 'lawyer password now blocked, nexttime:' + toMysqlFormat(nexttime)});

          }
        }

      } else {
        res.sendStatus(404);
      }

    }).catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
  });

};
