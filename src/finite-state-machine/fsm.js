const TradeHandler = require("./tradeHandler");

/*
 * FSM (Worker-2)
 * @description  : FAM(finite-state-machine) handles all trades and gives to tradeHandler
 *                 with interval for OHLC candlestick generation
 */
class FSM {

    /*
     * FSM
     * @description  : creates FSM object
     * @params       : publisher - publisher object for publishing OHLC candlestick
     */
    constructor(publisher) {
        this.publisher = publisher;
        this.intervalHandlers = {};
    }

    /*
     * setInterval
     * @description  : set intervals
     * @params       : interval{integer} - interval in number of seconds
     */
    setInterval(interval) {
        this.intervalHandlers[interval] = new TradeHandler(interval, this.publisher);
    }

    /*
     * processTrade
     * @description  : sends trade data it to all available interval handlers for processing
     * @params       : trade {object} - json object with trade data
     */
    processTrade(tradeData) {
        for (const [interval, th] of Object.entries(this.intervalHandlers)) {
            th.addStockTrade(tradeData);
        }
    }

    /*
     * onSubscription
     * @description  : publishes OHLC candlestick to use on first subscription
     * @params       : subscriber {object} - Subscribers websocket object
     *                 interval {integer} - interval for which user subscribe
     *                 stockName {string} - stock symbol
     */
    onSubscription(subscriber, interval, stockName) {
        const data = this.intervalHandlers[interval].getOHLCData(stockName);
        this.publisher.sendData(subscriber, JSON.stringify(data));
    }

    /*
     * stop
     * @description  : stops timers for all intervals
     */
    stop() {
        for (const [interval, th] of Object.entries(this.intervalHandlers)) {
            th.clearTimer();
        }
    }

};

module.exports = FSM;
