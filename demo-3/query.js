const dgram = require('dgram');
const readline = require('readline');

const DRONE_IP = '192.168.10.1';
const COMMAND_PORT = 8889;

// Create a socket over which we can send commands...
const commandSocket = dgram.createSocket('udp4');
// ... and from which we'll receive command responses
commandSocket.bind(COMMAND_PORT);
commandSocket.on('message', (msg) => {
    console.log(`RESPONSE: ${msg}`)
});

// Helper for sending commands to the drone
const sendCommand = (cmd) => {
    console.log(`Sending command: ${cmd}`);
    commandSocket.send(cmd, 0, cmd.length, COMMAND_PORT, DRONE_IP, (err) => err && console.error("ERROR: ", JSON.stringify(err)));
}

// Put the drone into command mode
sendCommand('command');

const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
input.on('line', (text) => {
    switch (text) {
        case 'q':
            commandSocket.close();
            process.exit();
            break;
        case 't':
            sendCommand('time?');
            break;
        case 's':
            sendCommand('speed?');
            break;
        case 'b':
            sendCommand('battery?');
            break;
    }
});