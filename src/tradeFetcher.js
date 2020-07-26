const lineByLine = require('n-readlines');

/*
 * TradeFetcher(Worker 1)
 * @description  : TradeFetcher fetches new trades from file for OHLC candlestick generation
 */
class TradeFetcher {

    constructor() {
        const source = __dirname + "/../trades-data/trades.json";
        this.tradeFetcher = new lineByLine(source);
    }

    fetchNew() {
        return JSON.parse(this.tradeFetcher.next().toString());
    }

    close() {
        return this.tradeFetcher.close();
    }

}

module.exports = TradeFetcher;
