const dgram = require('dgram');

const RECEIVE_PORT = 31337;
const TRANSMIT_PORT = 31338;

var HOST = '127.0.0.1';


var fakeDrone = dgram.createSocket('udp4');
fakeDrone.on('listening', function () {
    var address = fakeDrone.address();
    console.log('Fake drone listening on ' + address.address + ":" + address.port);
});
fakeDrone.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port + ' - ' + message);
    if (message == "command") {
        handshake(remote.address);
    }
});
fakeDrone.bind(RECEIVE_PORT, HOST);

var clients = [];

function handshake(remoteAddress) {
    var fakeDroneClient = dgram.createSocket('udp4');
    var messageCount = 0;
    var transmitInterval = setInterval(() => {
        console.log(`Sending message ${messageCount}`)
        var message = new Buffer.from(`Here's a message from a fake drone! Message: ${messageCount}`);
        messageCount++;
        fakeDroneClient.send(message, 0, message.length, TRANSMIT_PORT, remoteAddress);
    }, 1500);

    clients.push({
        socket: fakeDroneClient,
        interval: transmitInterval
    });
}

// Wait for input in the terminal
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));

clients.forEach(client => {
    clearInterval(client.interval);
    client.socket.close();
});