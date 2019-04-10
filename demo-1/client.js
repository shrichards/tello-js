const dgram = require('dgram');

const RECEIVE_PORT = 31338;
const TRANSMIT_PORT = 31337;

var HOST = '127.0.0.1';


var droneClient = dgram.createSocket('udp4');
droneClient.on('listening', function () {
    var address = droneClient.address();
    console.log('Drone client listening on ' + address.address + ":" + address.port);
});
droneClient.on('message', function (message, remote) {
    console.log(`From fake drone: ${message}`);
});
droneClient.bind(RECEIVE_PORT, HOST);


var droneCommand = dgram.createSocket('udp4');
droneCommand.send('command', 0, 'command'.length, TRANSMIT_PORT, HOST);

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));