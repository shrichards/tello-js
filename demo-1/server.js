const dgram = require('dgram');
const readline = require('readline');

const RECEIVE_PORT = 31000;
const TRANSMIT_PORT = 32000;

var HOST = '127.0.0.1';

// Set up the "Server"
// Listens for message 'command' from a client, and opens a socket
// back to the client over which "status" messages are sent.
var server = dgram.createSocket('udp4');
server.on('listening', function () {
    var address = server.address();
    console.log(`Server listening on ${address.address}:${address.port}`);
});
server.on('message', function (message, remote) {
    console.log(`Received message from ${remote.address}`);
    if (message == "command") {
        startConnection(remote.address);
    }
});
server.bind(RECEIVE_PORT, HOST);

// Keep track of the clients that have connected
var clients = {};

// Open the socket back to the client, and send period status messaged
function startConnection(remoteAddress) {
    if (clients[remoteAddress]) {
        console.log(`Already have a socket for ${remoteAddress}:${TRANSMIT_PORT}`);
        return;
    }

    console.log('Starting connection...');
    var clientConn = dgram.createSocket('udp4');
    var messageCount = 0;
    var transmitInterval = setInterval(() => {
        console.log(`Sending message ${messageCount} to ${remoteAddress}:${TRANSMIT_PORT}`)
        var message = new Buffer.from(`Here's a message from the server! Message: ${messageCount}`);
        messageCount++;
        clientConn.send(message, 0, message.length, TRANSMIT_PORT, remoteAddress);
    }, 1500);

    // Hold on to the socket and interval so that we can clean up after ourselves
    clients[remoteAddress] = {
        socket: clientConn,
        interval: transmitInterval
    };
}

const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// When the user presses enter on the command line...
input.on('line', () => {

    // Close the client connections
    Object.values(clients).forEach(client => {
        clearInterval(client.interval);
        client.socket.close();
    });

    // close our command port
    server.close();

    process.exit();
});