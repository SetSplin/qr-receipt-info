# qr-check-info

> Get Russian check info using string from qr code

[![NPM Version][npm-image]][npm-url]

## Install

Via `npm`
```bash
npm i -S qr-check-info
```

Via `yarn`
```bash
yarn add qr-check-info
```

## Usage

To get info you need to register in [mobile app](https://kkt-online.nalog.ru/).

```javascript
import CheckInfoGetter from 'qr-check-info';

const qr_string =
  't=<number>&s=<number>&fn=<number>&i=<number>&fp=<number>&n=<number>'; // string from qr code

const checkInfo = new CheckInfoGetter({
  username: '+79999999999', // phone that you used to register
  password: '000000', // password that you received in sms
  delay: 500, // delay between queries (to get info getter makes two queries) is necessary so as not to get an error from the server
})

checkInfo.get(qr_string).then(
  info => {
    info.items.forEach(el => console.log(el));
  }
);
```

## License

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://img.shields.io/npm/v/live-xxx.svg
[npm-url]: https://npmjs.org/package/qr-check-info
