const dgram = require('dgram');
const readline = require('readline')

const RECEIVE_PORT = 32000;
const TRANSMIT_PORT = 31000;

var HOST = '127.0.0.1';

// Set up a socket to listen for messages from the server
var droneStatus = dgram.createSocket('udp4');
droneStatus.on('listening', function () {
    var address = droneStatus.address();
    console.log('Client listening on ' + address.address + ":" + address.port);
});
droneStatus.on('message', function (message) {
    console.log(`FROM SERVER -> ${message}`);
});
droneStatus.bind(RECEIVE_PORT, HOST);

// Tell the server that we're ready to receive messages
var droneCommand = dgram.createSocket('udp4');
droneCommand.send('command', 0, 'command'.length, TRANSMIT_PORT, HOST);


const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// When the user presses enter on the command line...
input.on('line', () => {
    droneCommand.close();
    droneStatus.close();
    process.exit();
});