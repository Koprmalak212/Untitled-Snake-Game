const Websocket = require('ws');

const wss = new Websocket.Server({ port: 8080 });


console.log('WebSocket server is running on ws://localhost:8080');

wss.on('connection', (ws) => {
    console.log('New Client Connected');

    ws.send('Welcome to the WebSocket server!');



    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        ws.send(`You said: ${message}`);
    });


    ws.on('close', () => {
        console.log('Client Disconnected');
    });


})