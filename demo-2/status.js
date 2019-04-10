const dgram = require('dgram');
const readline = require('readline');

const DRONE_IP = '192.168.10.1';
const COMMAND_PORT = 8889;
const STATUS_PORT = 8890;

// Create a socket on which we can listen for status updates from the drone
const statusSocket = dgram.createSocket('udp4');
statusSocket.bind(STATUS_PORT);
statusSocket.on('message', (msg) => {
    console.log(`STATUS: ${msg}`)
});

// Send the 'command' command to let the drone know we're looking for updates
const commandSocket = dgram.createSocket('udp4');
commandSocket.send('command', 0, 'command'.length, COMMAND_PORT, DRONE_IP, (err) => err && console.error("ERROR: ", JSON.stringify(err)));

// wait for human intervention
const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
input.on('line', () => {
    statusSocket.close();
    commandSocket.close();
    process.exit();
});