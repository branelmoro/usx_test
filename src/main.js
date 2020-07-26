const Websocket = require("./websocket");
const Publisher = require("./publisher");
const FSM = require("./finite-state-machine/fsm");
const TradeFetcher = require("./tradeFetcher")

const getNanoSecTime = () => {
    var hrTime = process.hrtime();
    return hrTime[0] * 1000000000 + hrTime[1];
}

/*
 * Bootstrap
 * @description  : Manages all intervals, tradeFetcher(worker-1), websocket server(worker-3)
 *                 and fsm(finite-state-machine)
 */
class Bootstrap {

    /*
     * Publisher
     * @description  : initializes fsm and websocket server
     */
    constructor() {
        // specify intervals in second here----
        this.intervals = [15, 30, 60];

        const publisher = new Publisher(this.intervals);

        // initialize finite-state-machine
        this.fsm = new FSM(publisher);
        this.intervals.forEach((i) => {
            this.fsm.setInterval(i);
        })

        // initialize websocket
        this.ws = new Websocket(this.fsm);
    }

    /*
     * startTradeFetcher(worker-1)
     * @description  : starts trade fetcher and sends newly fetched trade to finite-state-machine
     */
    async startTradeFetcher() {
        const fetcher = new TradeFetcher();
        let trade = fetcher.fetchNew();
        if(trade) {
            const timeDiff = getNanoSecTime() - trade.TS2;
            while(trade) {
                this.fsm.processTrade(trade);
                trade = fetcher.fetchNew();

                const relativeTimeDiff = (trade.TS2 - (getNanoSecTime() - timeDiff))/1000000;

                if(relativeTimeDiff > 0) {
                    await new Promise(resolve => setTimeout(resolve, relativeTimeDiff));
                }
            }
        }
        this.fsm.stop();
        console.log("Fetcher closed");
    }

    /*
     * startWebSocket(worker-3)
     * @description  : starts trade fetcher and sends newly fetched trade to finite-state-machine(worker-2)
     */
    async startWebSocket() {
        this.ws.startServer();
    }

    /*
     * start
     * @description  : starts the application
     */
    start() {
        this.startTradeFetcher();
        this.startWebSocket();
    }

}


const a = new Bootstrap();

a.start();
