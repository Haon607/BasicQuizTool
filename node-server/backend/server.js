const WebSocket = require('ws');
const express = require('express');
const path = require('path');

const appPlayer = express();
const wss = new WebSocket.Server({port: 23000});

appPlayer.use(express.static(path.join(__dirname, '../interface')));
appPlayer.listen(21100, () => console.log('interface at :21100'));

wss.on('connection', function connection(ws) {
    console.log('Client connected!');

    ws.on('message', async function incoming(data) {
        const msg = JSON.parse(data);
        console.log(msg);
        broadcast(msg);
    });
});

function broadcast(msg) {
    const data = JSON.stringify(msg);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}
