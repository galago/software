const co = require('co');
const validator = require('validator');

const ClientStatuses = require('../../shared/clientStatuses');
const ClientTypes = require('../../shared/clientTypes');
const LawyerStatuses = require('../../shared/lawyerStatuses');

const toMysqlFormat = require('../../util/format').toMysqlFormat;
const addMinutes  = require('../../util/format').addMinutes;

const promiseGetClientById = require('../../util/client').promiseGetClientById;
const promiseChangeStatusClient = require('../../util/client').promiseChangeStatusClient;
const promiseGetFreeTopLawyers = require('../../util/lawyer').promiseGetFreeTopLawyers;
const promiseGetFreeOtherLawyers = require('../../util/lawyer').promiseGetFreeOtherLawyers;
const promiseSetStatusLawyers = require('../../util/lawyer').promiseSetStatusLawyers;

module.exports = function(app) {

  /*
    {
      areaid="123"
  }
  */

  app.post('/clients/:id/lawyers/invite', function(req, res) {
    co(function * () {

      req.session.ClientId = 120;

      if (!req.session.ClientId) {
        res.sendStatus(401);
        return;
      } else if (+req.session.ClientId !== +req.params.id) {
        res.sendStatus(403);
        return;
      }

      if (!validator.isInt(req.body.areaId)) {
        res.status(400).send({message: 'areaId is wrong'});
        return;
      }
      //Block client
      yield promiseChangeStatusClient(
        req.session.ClientId,
        ClientStatuses.get('SEND_INVITE'),
        toMysqlFormat(new Date()) );

      let listTopLawyers = yield promiseGetFreeTopLawyers(req.body.areaId);
      listTopLawyers = listTopLawyers.map((item) => item.ID);
      if (listTopLawyers.length) {
        yield promiseSetStatusLawyers(
          req.session.ClientId, LawyerStatuses.get('SEND_INVITE'),
          toMysqlFormat(new Date()), listTopLawyers );
      };

      let listOtherLawyers =promiseGetFreeOtherLawyers(req.body.areaId);
      listOtherLawyers = listOtherLawyers.map((item) => item.ID);
      if (listOtherLawyers.length) {
        yield promiseSetStatusLawyers(
          req.session.ClientId, LawyerStatuses.get('SEND_INVITE'),
          toMysqlFormat(new Date()), listOtherLawyers );
      };
      if ((!listTopLawyers.length) && (!listOtherLawyers.length)) {
        res.sendStatus(404);
        return;

      }
      //send Invite to listTopLawyers
      //send Invite to listOtherLawyers
      res.sendStatus(200);

    }).catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
  });

};
