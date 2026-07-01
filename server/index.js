const Port = 8000;
const Websocket = new websocket(Port);
console.log(`Server started on port ${Port}`);

Websocket.start