## Description
This service fetches trade data and generates OHLC candlestick data for subscribers.

## Quick Installation
### Pre-requites
* install nodejs - ^12.18.3LTS
* install npm - ^6.14.6

### Running the app
clone this repository and run below commands:
```
$ cd usx_test
$ npm i
$ npm start
```

### To run unit test
```
$ npm test
```

### How to change candlestick bar intervals??
* Go to file src/main.js
* Add intervals in Bootstrap constructor

### How To change websocket service port:
* Go to file src/websocket.js
* Add intervals in Bootstrap constructor

### Usage:
* Connect to websocket service running on port 8080(ws://localhost:8080)
* Send data `{"event": "subscribe", "symbol": "XXBTZUSD", "interval": 15}` for subscription.

**Note: To see all published data check standard output(console)**
