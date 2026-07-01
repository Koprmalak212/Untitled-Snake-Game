const Websocket = require('ws');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const ws = new Websocket.Server({ port: 8080 });

ws.on('open', () => {
    console.log('Connected to the WebSocket server');
    promptForMessage();
});


ws.on('message', (message) => {
    console.log(`Received message from server: ${message}`);
    promptForMessage();
});


ws.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
});


ws.on('close', () => {
    console.log('Disconnected from the WebSocket server');
    rl.close();
    process.exit(0);
});


function promptForMessage() {
    rl.question('Enter a message to send to the server (or type "exit" to quit): ', (message) => {
        if (message.toLowerCase() === 'exit') {
            ws.close();
        } else {
            ws.send(message);
        }
    });

}