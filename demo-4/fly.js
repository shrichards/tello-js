const Drone = require('./drone');
const delay = require('./delay');
const readline = require(`readline`);


const DRONE_IP = '192.168.10.1';
const COMMAND_PORT = 8889;
const STATUS_PORT = 8890;

(async () => {
    const tello = new Drone(DRONE_IP, COMMAND_PORT, STATUS_PORT);

    await tello.start();

    await tello.takeoff();

    await tello.land();

    const input = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    // When the user presses enter on the command line...
    input.on('line', async () => {
        tello.close();
        process.exit();
    });
})();