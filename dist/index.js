"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parseReceiptString = _interopRequireDefault(require("./parseReceiptString"));

var _jsBase = require("js-base64");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const URL_CHECK = "https://proverkacheka.nalog.ru:9999/v1/ofds/*/inns/*/fss/<fiscalNumber>/operations/<checkType>/tickets/<fiscalDocument>?fiscalSign=<fiscalSign>&date=<time>&sum=<price>";
const URL_GET = "https://proverkacheka.nalog.ru:9999/v1/inns/*/kkts/*/fss/<fiscalNumber>/tickets/<fiscalDocument>?fiscalSign=<fiscalSign>&sendToEmail=no";

class ReceiptInfoGetter {
  constructor({
    username,
    password,
    delay
  }) {
    this.username = username;
    this.password = password;
    this.delay = delay;
  }

  static makeUrl(url_template, params) {
    let url = url_template.slice();
    Object.keys(params).forEach(param => {
      url = url.replace(`<${param}>`, params[param]);
    });
    return url;
  }

  getHeaders() {
    return {
      'Authorization': 'Basic ' + _jsBase.Base64.encode(this.username + ":" + this.password),
      'Device-Id': '',
      'Device-OS': ''
    };
  }

  async request(url) {
    const fetcher = typeof fetch !== 'undefined' ? fetch : Promise.resolve().then(() => _interopRequireWildcard(require('node-fetch')));
    return fetcher(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: this.getHeaders(),
      redirect: 'follow',
      referrer: 'no-referrer'
    });
  }

  async get(qr_string) {
    try {
      const params = (0, _parseReceiptString.default)(qr_string);

      if (params === null) {
        return null;
      }

      const check_status = (await this.request(ReceiptInfoGetter.makeUrl(URL_CHECK, params))).status;

      if (check_status === 204) {
        // delay required between check and get
        return new Promise(resolve => {
          setTimeout(async () => {
            try {
              const result = await this.request(ReceiptInfoGetter.makeUrl(URL_GET, params));
              resolve((await result.json()).document.receipt);
            } catch {
              resolve(null);
            }
          }, this.delay);
        });
      }
    } catch {}

    return null;
  }

}

exports.default = ReceiptInfoGetter;