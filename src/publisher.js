/*
 * Publisher
 * @description  : Manages all subscribers and publishes message to subscribers
 */
class Publisher {

    /*
     * Publisher
     * @description  : creates Publisher object
     * @params       : intervals{array} - array of all intervals for which user can subscribe
     */
    constructor(intervals) {
        // set subscription 
        this.subscribers = {};
        intervals.forEach((interval) => {
            this.subscribers[interval] = {};
        });
    }

    /*
     * addSubscriber
     * @description  : adds new subscriber for given interval and stock OHLC candlestic data
     * @params       : subscriber{object} - websocket connection object of user
     *                 interval{integer} - number of seconds for which user subscribes
     *                 stockName{string} - stock symbol for which user subscribes
     */
    addSubscriber(subscriber, interval, stockName) {
        if(!this.subscribers[interval][stockName]) {
            this.subscribers[interval][stockName] = new Set();
        }
        this.subscribers[interval][stockName].add(subscriber);
    }

    /*
     * removeSubscriber
     * @description  : removes subscriber from publishers list for given interval
     *                 and stock OHLC candlestic data
     * @params       : subscriber{object} - websocket connection object of user
     *                 interval{integer} - number of seconds for which user unsubscribes
     *                 stockName{string} - stock symbol for which user unsubscribes
     */
    removeSubscriber(subscriber, interval, stockName) {
        if(this.subscribers[interval][stockName]) {
            this.subscribers[interval][stockName].delete(subscriber);
            if(this.subscribers[interval][stockName].size == 0) {
                delete this.subscribers[interval][stockName];
            }
        }
    }

    /*
     * getSubscribers
     * @description  : returns all subscribers for specific interval and stock
     * @params       : interval{integer} - number of seconds for which user subscribes
     *                 stockName{string} - stock symbol
     */
    getSubscribers(interval, stockName) {
        return this.subscribers[interval][stockName]? Array.from(this.subscribers[interval][stockName]): [];
    }

    /*
     * publish
     * @description  : publishes stock OHLC candlestick to it's subscribers
     * @params       : stockName{string} - stock symbol
     *                 interval{integer} - number of seconds for which user subscribes
     *                 data{object} - OHCL candlestic data
     */
    publish(stockName, interval, data) {
        return new Promise((resolve, reject) => {
            const publishJson = JSON.stringify(data);
            console.log("Publish for interval - ", interval, "---", publishJson );
            var prs = [];
            this.getSubscribers(interval, stockName).forEach((subscriber) => {
                prs.push(this.sendData(subscriber, publishJson));
            })
            return Promise.all(prs);
        });
    }

    /*
     * sendData
     * @description  : sends json object to single subscriber
     * @params       : subscriber{object} - websocket connection object of user
     *                 publishJson{string} - data to publish
     */
    sendData(subscriber, publishJson) {
        return new Promise((resolve) => {
            subscriber.send(publishJson);
            resolve();
        })
        .catch((err) => {
            console.log("Error in sending data to subscriber----");
        });

    }
};

module.exports = Publisher;
