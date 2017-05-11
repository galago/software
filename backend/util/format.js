function twoDigits(d) {
  if (d >= 0 && d < 10) return '0' + d.toString();
  if (d > -10 && d < 0) return '-0' + (-1 * d).toString();
  return d.toString();
}

function toMysqlFormat(date) {
  return date.getUTCFullYear() + '-' + twoDigits(1 + date.getUTCMonth()) + '-' +
  twoDigits(date.getUTCDate()) + ' ' + twoDigits(date.getHours()) + ':' +
  twoDigits(date.getUTCMinutes()) + ':' + twoDigits(date.getUTCSeconds());
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

function errors(errorsArray) {
  return errorsArray.reduce((prev, curr) => Object.assign(prev, curr));
}

const Format = {
  twoDigits,
  toMysqlFormat,
  addMinutes,
  errors
};

module.exports = Format;
