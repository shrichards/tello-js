const dgram = require('dgram');
const readline = require('readline')

const RECEIVE_PORT = 31338;
const TRANSMIT_PORT = 31337;

var HOST = '127.0.0.1';

// Set up a socket to listed for status updates from the fake drone
var droneStatus = dgram.createSocket('udp4');
droneStatus.on('listening', function () {
    var address = droneStatus.address();
    console.log('Drone client listening on ' + address.address + ":" + address.port);
});
droneStatus.on('message', function (message) {
    console.log(`From fake drone: ${message}`);
});
droneStatus.bind(RECEIVE_PORT, HOST);

// Tell the fake drone that we're ready to get status updates
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