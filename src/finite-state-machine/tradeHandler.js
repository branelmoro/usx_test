const OHLC_BAR = require("./ohlc_bar");

/*
 * TradeHandler
 * @description  : Handles all operations for single interval and all stocks
 */
class TradeHandler {

    /*
     * TradeHandler
     * @description  : creates TradeHandler object
     * @params       : interval{integer} - interval in number of seconds
     *                 publisher - publisher object for publishing OHLC candlestick
     */
    constructor(interval, publisher) {

        this.publisher = publisher;

        this.interval = interval;
        this.bar_num = 1;
        this.stocks = {};

        this.intervalStartTime = new Date().getTime();

        this.setChangeBarTimer();
    }

    /*
     * setChangeBarTimer
     * @description  : sets close timer for interval
     */
    setChangeBarTimer() {
        const timeout = this.intervalStartTime + this.bar_num*this.interval*1000 - new Date().getTime();
        this.intervalTimer = setTimeout(() => {
            this.changeInterval();
        }, timeout);
    }

    /*
     * clearTimer
     * @description  : clears close timer for interval
     */
    clearTimer() {
        return clearTimeout(this.intervalTimer);
    }

    /*
     * addStockTrade
     * @description  : adds tradeData to stock's OHLC candlestic
     */
    addStockTrade(tradeData) {
        const { sym } = tradeData;
        if(!this.stocks[sym]) {
            this.stocks[sym] = new OHLC_BAR();
        }
        this.stocks[sym].addNewTrade(tradeData);
        return this.publishBarUpdates(sym);
    }

    /*
     * publishBarUpdates
     * @description  : Publishes OHLC candlestic to all subscribers
     */
    publishBarUpdates(stockName) {
        // send to all subscriber
        const OHLC_DATA = this.getOHLCData(stockName);
        return this.publisher.publish(stockName, this.interval, OHLC_DATA);
    }

    /*
     * getOHLCData
     * @description  : generates OHLC candlestic data for publishing to all subscribers
     */
    getOHLCData(stockName) {
        return Object.assign(this.stocks[stockName].getData(), {
            // ...data
            symbol: stockName,
            event: "ohlc_notify",
            bar_num: this.bar_num,
        });
    }

    /*
     * changeInterval
     * @description  : changes interval and start OHLC candlestic bar
     */
    changeInterval() {

        for (const [stockName, bar] of Object.entries(this.stocks)) {

            // close bar data
            bar.close();

            const barData = bar.getData();

            // publish bar data to subscribers
            this.publishBarUpdates(stockName);

            // reset bar data
            bar.startNew();
        }

        this.bar_num += 1;

        this.setChangeBarTimer();
    }
}

module.exports = TradeHandler;
