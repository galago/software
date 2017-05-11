const co = require('co');
const validator = require('validator');

const ClientStatuses = require('../../shared/clientStatuses');
const ClientTypes = require('../../shared/clientTypes');

const toMysqlFormat = require('../../util/format').toMysqlFormat;
const addMinutes  = require('../../util/format').addMinutes;

const promiseGetClientByPhone = require('../../util/client').promiseGetClientByPhone;
const promiseSaveIdent = require('../../util/client').promiseSaveIdent;
const promiseSignClient  = require('../../util/client').promiseSignClient;

module.exports = function(app) {

  app.post('/clients/signup', function(req, res) {
    co(function * () {

      if (!(validator.isMobilePhone(req.body.phone, 'ru-RU'))) {
        res.status(400).send({message: 'client phone not russia'});
        return;
      }
      if (!(validator.isLength(req.body.password, {min:4, max: 4}))) {
        res.status(400).send({message: 'client password length  is not 4'});
        return;
      }

      let client = yield promiseGetClientByPhone(Number(req.body.phone));
      if (client.length) {

        let Updated = new Date(client[0].updated);
        let Now = new Date();

        if (Updated > Now) {
          res.status(403).send({message: 'client password is blocked. nexttime:}'+ client[0].updated});
          return;
        }

        if (client[0].password == req.body.password) {

          yield promiseSignClient(
            client[0].ID, ClientStatuses.get('ACTIVE'),
            0, toMysqlFormat(new Date()) );
          req.session.ClientId = client[0].ID; //Start new client session
          res.sendStatus(200);

        } else {
          if ((client[0].counter)< 3) {

            yield promiseSignClient(
              client[0].ID, ClientStatuses.get('INACTIVE'),
              client[0].counter + 1, toMysqlFormat(Now));
            res.status(403).send({message: 'client password is wrong, current count: ' + (client[0].counter + 1)});

          } else {
            //Delay nexttime
            let nexttime = addMinutes(Now,  1);
            yield promiseSignClient(
              client[0].ID,ClientStatuses.get('INACTIVE'),
              0, nexttime);
            res.status(403).send({message: 'client password now blocked, nexttime:' + toMysqlFormat(nexttime)});
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
