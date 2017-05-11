const co = require('co');
const validator = require('validator');

const ClientStatuses = require('../../shared/clientStatuses');
const LawyerStatuses = require('../../shared/lawyerStatuses');

const CallStatuses = require('../../shared/callStatuses');
const CallTypes = require('../../shared/callTypes');

const toMysqlFormat = require('../../util/format').toMysqlFormat;
const addMinutes  = require('../../util/format').addMinutes;

const promiseGetClientById = require('../../util/client').promiseGetClientById;
const promiseChangeStatusClient = require('../../util/client').promiseChangeStatusClient;
const promiseGetFreeTopLawyers = require('../../util/lawyer').promiseGetFreeTopLawyers;
const promiseGetFreeOtherLawyers = require('../../util/lawyer').promiseGetFreeOtherLawyers;
const promiseSetStatusLawyers = require('../../util/lawyer').promiseSetStatusLawyers;
const promiseChangeStatusLawyer = require('../../util/lawyer').promiseChangeStatusLawyer;
const promiseGetInvitedLawyers = require('../../util/lawyer').promiseGetInvitedLawyers;

const promiseNewCall = require('../../util/Call').promiseNewCall;


module.exports = function(app) {
  app.post('/lawyers/:lawyerid/clients/:clientid/invite', function(req, res) {
    co(function * () {

      req.session.LawyerId = 4;

      if (!req.session.LawyerId) {
        res.sendStatus(401);
        return;
      } else if (+req.session.LawyerId !== +req.params.lawyerid) {
        res.sendStatus(403);
        return;
      }
      if (!validator.isInt(req.body.areaId)) {
        res.status(400).send({message: 'areaId is wrong'});
        return;
      }
      if (!validator.isInt(req.params.clientid)) {
        res.status(400).send({message: 'clientid is wrong'});
        return;
      }
      //check client
      let client = yield promiseGetClientById(req.params.clientid);
      if (!client.length) {
        res.sendStatus(404);
      } else if (+client[0].status !== ClientStatuses.get('SEND_INVITE')) {
        res.status(403).send({message: 'client status not SEND_INVITE'});
      } else {

        let invitedLawiyers = yield promiseGetInvitedLawyers(req.params.clientid);
        invitedLawiyers = invitedLawiyers.map((item) => item.ID);
        //Unblock other lawyers
        yield promiseSetStatusLawyers(
          req.params.clientid,
          LawyerStatuses.get('ACTIVE'),
          toMysqlFormat(new Date()),
          invitedLawiyers
        );

        //Change client status "ON_CALL"
        yield promiseChangeStatusClient(
          req.params.clientid,
          ClientStatuses.get('ON_CALL'),
          toMysqlFormat(new Date())
        );
        //Change current lawyer status "ON_CALL"
        yield promiseChangeStatusLawyer(
          req.session.LawyerId,
          LawyerStatuses.get('ON_CALL'),
          toMysqlFormat(new Date)
        );

        //Create record in Call
        yield promiseNewCall({
          "AreaID" : +req.body.areaId,
          "ClientID" : +req.params.clientid,
          "OfficerID" : +req.session.LawyerId,
          "status" : CallStatuses.get('ON_CALL'),
          "typeCall" : CallTypes.get('PHONE'),
          "dateFrom" : toMysqlFormat(new Date())
        });

        //TODO send to client LawierID

        res.sendStatus(200);
      }


    }).catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
  });

};
