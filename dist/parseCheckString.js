"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseCheckString;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var formats = [{
  t: 'time',
  s: {
    name: 'price',
    transformer: function transformer(price) {
      return parseInt(price.replace('.', ''));
    }
  },
  fn: 'fiscalNumber',
  i: 'fiscalDocument',
  fp: 'fiscalSign',
  n: 'checkType'
}];

function match(params, format) {
  var formatKeys = Object.keys(format);
  Object.keys(params).forEach(function (param) {
    if (!(param in formatKeys)) {
      return false;
    }
  });
  return true;
}

function extract(params, format) {
  var result = {};
  Object.keys(params).forEach(function (param) {
    var normal_name = typeof format[param] === 'string' ? format[param] : format[param].name;
    var transformer = typeof format[param] === 'string' ? function (el) {
      return el;
    } : format[param].transformer;
    result[normal_name] = transformer(params[param]);
  });
  return result;
}

function parseCheckString(qr_string) {
  var params = {};
  qr_string.split('&').forEach(function (param) {
    var _param$split = param.split('='),
        _param$split2 = _slicedToArray(_param$split, 2),
        name = _param$split2[0],
        value = _param$split2[1];

    params[name] = value;
  });
  var format = formats.find(function (_format) {
    return match(params, _format);
  });

  if (format === null) {
    return null;
  }

  return extract(params, format);
}