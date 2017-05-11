const LawyerStatuses = require('../shared/lawyerStatuses');
const LawyerTypes = require('../shared/lawyerTypes');
const toMysqlFormat = require('./format').toMysqlFormat;

const promiseGetLawyerByPhone = (phone) => promiseQuery(
`SELECT * FROM Officer WHERE phone = '${phone}' `);

const promiseSaveIdent = (oReq) => promiseQuery(
 'INSERT INTO Officer SET ?', [oReq]);

 const promiseSignLawyer = (lawyerid, status, counter, nextime) => promiseQuery(
   `UPDATE
       Officer C
     SET C.status = ${status}, C.counter = ${counter}, C.updated = '${nextime}'
     WHERE
       C.ID = ${lawyerid}`);

const promiseGetFreeTopLawyers = (areaId) => promiseQuery(
`SELECT O.ID
 FROM Officer O, Service S
 WHERE
    O.ID = S.OfficerID        AND
    S.AreaID = ${areaId}      AND
    O.typeOfficer = ${LawyerTypes.get('LAWYER')}  AND
    O.status = ${LawyerStatuses.get('ACTIVE')}    AND
    O.BlockID IS NULL
ORDER by O.rating
LIMIT 10`);

//TODO code review later
const promiseGetFreeOtherLawyers = (areaId) => promiseQuery(
`SELECT O.ID
 FROM Officer O, Service S
 WHERE
    O.ID = S.OfficerID        AND
    S.AreaID = ${areaId}      AND
    O.typeOfficer = ${LawyerTypes.get('LAWYER')}  AND
    O.status = ${LawyerStatuses.get('ACTIVE')}    AND
    O.BlockID IS NULL
ORDER by RAND()
LIMIT 10`);

const promiseSetStatusLawyers = (clientId, status, updated, listLawyersId) => promiseQuery(
`UPDATE Officer SET BlockID = ?, status = ?, updated = ?
  WHERE ID IN (?)`,  [clientId, status, updated, listLawyersId]);

const promiseChangeStatusLawyer = (lawierid, status, updated) => promiseQuery(
 `UPDATE
     Officer
   SET status = ${status}, updated = '${updated}'
   WHERE
     ID = ${lawierid}`);

const promiseGetInvitedLawyers = (clientId) => promiseQuery(
`SELECT O.ID
FROM Officer O
WHERE
   O.BlockID = ${clientId}                       AND
   O.typeOfficer = ${LawyerTypes.get('LAWYER')}  AND
   O.status = ${LawyerStatuses.get('SEND_INVITE')}    AND
   O.BlockID IS NOT NULL`);

const Lawyer = {
  promiseGetLawyerByPhone,
  promiseSaveIdent,
  promiseSignLawyer,
  promiseGetFreeTopLawyers,
  promiseGetFreeOtherLawyers,
  promiseSetStatusLawyers,
  promiseChangeStatusLawyer,
  promiseGetInvitedLawyers
};

module.exports = Lawyer;
