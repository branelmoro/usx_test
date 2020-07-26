const webSocket = require('ws');

/*
 * Websocket(Worker 3)
 * @description  : Handles all processing related to websockets
 */
class Websocket {

    /*
     * Websocket
     * @description  : creates new websocket server object
     * @params       : fsm - finite-state-machine instance
     */
    constructor(fsm) {
        this.fsm = fsm;
        this.connections = {};
    }

    /*
     * onConnection (TODO)
     * @description  : Handles close event of websocket connection
     */
    onClose(conn) {
        // TODO
    }

    /*
     * onConnection
     * @description  : Handles new incoming websocket message
     */
    onMessage(conn, message) {

        try {
            const payload = JSON.parse(message);

            switch(payload.event) {
                case "subscribe":
                    this.fsm.publisher.addSubscriber(conn, payload.interval, payload.symbol);
                    // send initial bar data
                    this.fsm.onSubscription(conn, payload.interval, payload.symbol);
                    break;
                case "unsubscribe":
                    this.fsm.publisher.removeSubscriber(conn, payload.interval, payload.symbol);
                    break;
            }
        } catch(err) {

        }
    }

    /*
     * onConnection (TODO)
     * @description  : Handles new incoming websocket connection
     */
    onConnection(conn) {
        this.connections[conn] = {};
        // TODO
    }

    /*
     * onConnection
     * @description  : Starts websocket server on port 8080
     */
    startServer() {
        this.wss = new webSocket.Server({ port: 8080 });

        this.wss.on('connection', (ws) => {

            this.onConnection(ws);

            ws.on('message', (message) => {
                console.log('received: %s', message);
                this.onMessage(ws, message);
            });

            ws.send('something');
        });

    }

    /*
     * stopServer (TODO)
     * @description  : Stops websocket server
     */
    stopServer() {
        // TODO
    }
}

module.exports = Websocket;
