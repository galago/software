const promiseNewCall = (oReq) => promiseQuery(
 'INSERT INTO Calls SET ?', [oReq]);

const Call = {
  promiseNewCall
};

module.exports = Call;
