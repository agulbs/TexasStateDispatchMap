function createSocketConnection() {
    setTimeout(() => {
        // TODO: Load from config file
        socket = new WebSocket("ws://172.83.159.155:30121");
        socket.onopen = socketOnOpen;
        socket.onclose = socketOnClose;
        socket.onmessage = socketOnMessage;
        socket.onerror = socketOnError;
    }, 1000)
}

var socketOnOpen = (msg) => {
    console.log("Websocket opened.");
}

var socketOnClose = (msg) => {
    console.log("Websocket disconnected - waiting for connection.");
}

var socketOnError = (msg) => {
    console.log(msg)
}

var socketOnMessage = (msg) => {
    handleSocketData(msg.data);
}