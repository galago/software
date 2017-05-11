function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isDate(val) {
  const d = new Date(val);
  return !isNaN(d.valueOf());
}

function isArray (a) {
    return (typeof a == "object") && (a instanceof Array);
}

const Validator = {
  isNumber,
  isDate,
  isArray
};

module.exports = Validator;
