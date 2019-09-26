const dgram = require('dgram');
const delay = require('./delay');

class Drone {

    constructor(droneIp, commandPort, statusPort) {
        this._droneIp = droneIp;
        this._commandPort = commandPort;
        this._commandSocket = dgram.createSocket('udp4');
        this._commandSocket.bind(commandPort);

        // Listen for responses to our commands
        this._commandSocket.on('message', (msg) => {
            const msgStr = msg.toString();
            console.log(msgStr);

            // Specifically looking for 'ok' so we know when we can send the next
            // command.
            if (msgStr == 'ok') {
                if (this._lastStatus) {
                    console.log(JSON.stringify(this._lastStatus));
                }
                this._waiting = false;
            }
        });

        // Keep track of the status
        this._statusPort = statusPort;
        this._statusSocket = dgram.createSocket('udp4');
        this._statusSocket.bind(statusPort);
        this._statusSocket.on('message', (msg) => {
            this._lastStatus = Drone.parseStatus(msg.toString());
        });
    }

    async sendCommand(command) {
        console.log(`Sending command: ${command}`);
        this._commandSocket.send(command, 0, command.length, this._commandPort, this._droneIp, this._errorHandler);
        this._waiting = true;

        // Wait until we receive an 'ok' command response
        // Poor-man's state machine.
        let waitCycles = 0;
        const maxWaitCycles = 40;
        while (this._waiting && waitCycles < maxWaitCycles) {
            waitCycles++;
            await delay(500);
        }

        // Hmmm... no OK... hope somebody has a tennis racquet handy
        if (waitCycles >= maxWaitCycles) {
            await this.sendCommand('land');
            throw new Error("Something's wrong");
        }

        // Wait for an extra second, just to be on the safe side
        await delay(1000);
    }

    async start() {
        await this.sendCommand('command');
    }

    async takeoff() {
        await this.sendCommand('takeoff');
    }

    async land() {
        await this.sendCommand('land');
    }

    async clockwise(degrees) {
        await this.sendCommand(`cw ${degrees}`);
    }

    async counterClockwise(degrees) {
        await this.sendCommand(`ccw ${degrees}`);
    }

    async up(centimeters) {
        await this.sendCommand(`up ${centimeters}`);
    }

    async down(centimeters) {
        await this.sendCommand(`down ${centimeters}`);
    }

    async left(centimeters) {
        await this.sendCommand(`left ${centimeters}`);
    }

    async right(centimeters) {
        await this.sendCommand(`right ${centimeters}`);
    }

    async forward(centimeters) {
        await this.sendCommand(`forward ${centimeters}`);
    }

    async back(centimeters) {
        await this.sendCommand(`back ${centimeters}`);
    }

    async flipLeft() {
        await this.sendCommand(`flip l`);
    }

    async flipRight() {
        await this.sendCommand(`flip r`);
    }

    close() {
        this._statusSocket.close();
        this._commandSocket.close();
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

module.exports = Drone;