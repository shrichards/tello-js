const dgram = require('dgram');
const readline = require('readline');

const RECEIVE_PORT = 31337;
const TRANSMIT_PORT = 31338;

var HOST = '127.0.0.1';

// Set up the "fake drone"
// Listens for message 'command' from a client, and opens a socket
// back to the client over which status messages are sent.
var fakeDrone = dgram.createSocket('udp4');
fakeDrone.on('listening', function () {
    var address = fakeDrone.address();
    console.log('Fake drone listening on ' + address.address + ":" + address.port);
});
fakeDrone.on('message', function (message, remote) {
    console.log('Received message');
    if (message == "command") {
        startConnection(remote.address);
    }
});
fakeDrone.bind(RECEIVE_PORT, HOST);

// Keep track of the clients that have connected
var clients = [];

// Open the socket back to the client, and send period status messaged
function startConnection(remoteAddress) {
    console.log('Starting connection...');
    var fakeDroneClient = dgram.createSocket('udp4');
    var messageCount = 0;
    var transmitInterval = setInterval(() => {
        console.log(`Sending message ${messageCount}`)
        var message = new Buffer.from(`Here's a message from a fake drone! Message: ${messageCount}`);
        messageCount++;
        fakeDroneClient.send(message, 0, message.length, TRANSMIT_PORT, remoteAddress);
    }, 1500);

    // Hold on to the socket and interval so that we can clean up after ourselves
    clients.push({
        socket: fakeDroneClient,
        interval: transmitInterval
    });
}


const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// When the user presses enter on the command line...
input.on('line', () => {

    // Close the client connections
    clients.forEach(client => {
        clearInterval(client.interval);
        client.socket.close();
    });

    // close our command port
    fakeDrone.close();

    process.exit();
});