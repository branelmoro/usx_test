/*
 * OHLC_BAR
 * @description  : OHLC_BAR handles all operations related to single candlestick bar
 */

class OHLC_BAR {

    /*
     * OHLC_BAR
     * @description  : creates OHLC_BAR object with all values initialised to zero
     */
    constructor() {
        this.startNew(0);
    }

    /*
     * startNew
     * @description  : inialize new candlestick OHLC_BAR with given opening price.
     * @params       : openingPrice {float} - opening trade price 
     */
    startNew(openingPrice) {
        openingPrice = openingPrice !== undefined? openingPrice : this.c;
        this.o = openingPrice;
        this.h = openingPrice;
        this.l = openingPrice;
        this.c = 0;
        this.volume = 0;

        this.lastTradePrice = openingPrice;
    }

    /*
     * addNewTrade
     * @description  : adjusts high/low/opening price of candlestick OHLC_BAR according to given trade
     * @params       : trade {object} - json object with trade data inlcuding P and Q
     */
    addNewTrade(trade) {
        const { P, Q } = trade;
        if(this.volume == 0) {
            this.h = this.l = this.o = P;
        } else {
            if(P > this.h) this.h = P;
            if(P < this.l) this.l = P;
        }

        this.volume += Q;
        this.lastTradePrice = P;
    }

    /*
     * close
     * @description  : closed candlestick OHLC_BAR and assignes lastTradePrice to c(close) properly
     */
    close() {
        this.c = this.lastTradePrice
    }

    /*
     * getData
     * @description  : Returns candlestick OHLC_BAR data in object format
     */
    getData() {
        const { o, h, l, c, volume } = this;
        return { o, h, l, c, volume };
    }

}

module.exports = OHLC_BAR;
