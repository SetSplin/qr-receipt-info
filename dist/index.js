"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parseCheckString = _interopRequireDefault(require("./parseCheckString"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _jsBase = require("js-base64");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var URL_CHECK = "https://proverkacheka.nalog.ru:9999/v1/ofds/*/inns/*/fss/<fiscalNumber>/operations/<checkType>/tickets/<fiscalDocument>?fiscalSign=<fiscalSign>&date=<time>&sum=<price>";
var URL_GET = "https://proverkacheka.nalog.ru:9999/v1/inns/*/kkts/*/fss/<fiscalNumber>/tickets/<fiscalDocument>?fiscalSign=<fiscalSign>&sendToEmail=no";

var CheckInfoGetter =
/*#__PURE__*/
function () {
  function CheckInfoGetter(_ref) {
    var username = _ref.username,
        password = _ref.password;

    _classCallCheck(this, CheckInfoGetter);

    this.username = username;
    this.password = password;
  }

  _createClass(CheckInfoGetter, [{
    key: "getHeaders",
    value: function getHeaders() {
      return {
        'Authorization': 'Basic ' + _jsBase.Base64.encode(this.username + ":" + this.password),
        'Device-Id': '',
        'Device-OS': ''
      };
    }
  }, {
    key: "request",
    value: function () {
      var _request = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(url) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", (0, _nodeFetch.default)(url, {
                  method: 'GET',
                  mode: 'cors',
                  cache: 'no-cache',
                  credentials: 'same-origin',
                  headers: this.getHeaders(),
                  redirect: 'follow',
                  referrer: 'no-referrer'
                }));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function request(_x) {
        return _request.apply(this, arguments);
      }

      return request;
    }()
  }, {
    key: "get",
    value: function () {
      var _get = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(qr_string) {
        var _this = this;

        var params, check_status;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                params = (0, _parseCheckString.default)(qr_string);

                if (!(params === null)) {
                  _context3.next = 4;
                  break;
                }

                return _context3.abrupt("return", null);

              case 4:
                _context3.next = 6;
                return this.request(CheckInfoGetter.makeUrl(URL_CHECK, params));

              case 6:
                check_status = _context3.sent.status;

                if (!(check_status === 204)) {
                  _context3.next = 9;
                  break;
                }

                return _context3.abrupt("return", new Promise(function (resolve) {
                  setTimeout(
                  /*#__PURE__*/
                  _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee2() {
                    var result;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            _context2.prev = 0;
                            _context2.next = 3;
                            return _this.request(CheckInfoGetter.makeUrl(URL_GET, params));

                          case 3:
                            result = _context2.sent;
                            _context2.t0 = resolve;
                            _context2.next = 7;
                            return result.json();

                          case 7:
                            _context2.t1 = _context2.sent.document.receipt;
                            (0, _context2.t0)(_context2.t1);
                            _context2.next = 14;
                            break;

                          case 11:
                            _context2.prev = 11;
                            _context2.t2 = _context2["catch"](0);
                            resolve(null);

                          case 14:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2, null, [[0, 11]]);
                  })), 500);
                }));

              case 9:
                _context3.next = 13;
                break;

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3["catch"](0);

              case 13:
                return _context3.abrupt("return", null);

              case 14:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 11]]);
      }));

      function get(_x2) {
        return _get.apply(this, arguments);
      }

      return get;
    }()
  }], [{
    key: "makeUrl",
    value: function makeUrl(url_template, params) {
      var url = url_template.slice();
      Object.keys(params).forEach(function (param) {
        url = url.replace("<".concat(param, ">"), params[param]);
      });
      return url;
    }
  }]);

  return CheckInfoGetter;
}();

exports.default = CheckInfoGetter;