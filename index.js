const dgram = require('dgram');

const delay = (ms) => new Promise(function (resolve) {
    setTimeout(resolve, ms);
});

class Drone {

    constructor(droneIp, commandPort, statusPort) {
        this._droneIp = droneIp;
        this._commandPort = commandPort;
        this._commandSocket = dgram.createSocket('udp4');
        this._commandSocket.bind(commandPort);

        this._commandSocket.on('message', (msg) => {
            console.log(`COMMAND SOCKET MSG: ${msg}`);
        });

        this._statusPort = statusPort;
        this._statusSocket = dgram.createSocket('udp4');
        this._statusSocket.bind(statusPort);
        this._statusSocket.on('message', (msg) => {
            console.log(`STATUS: ${JSON.stringify(Drone.parseStatus(msg.toString()))}`);
        });
    }



    async sendCommand(command) {
        this._commandSocket.send(command, 0, command.length, this._commandPort, this._droneIp, this._errorHandler);
        await delay(1000);
    }

    _errorHandler(err) {
        if (err) {
            console.error('ERROR', err);
        }
    }

    static parseStatus(rawStatus) {
        return rawStatus
            .split(';')
            .map(x => x.split(':'))
            .reduce((data, [key, value]) => {
                data[key] = value;
                return data;
            }, {});
    }
}
const DRONE_IP = '192.168.10.1';
const COMMAND_PORT = 8889;
const STATUS_PORT = 8890;

(async () => {
    const tello = new Drone(DRONE_IP, COMMAND_PORT, STATUS_PORT);
    await tello.sendCommand('command');

    console.log('Press any key to exit');

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
})();