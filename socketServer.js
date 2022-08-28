const roomHandlers = require('./socketHandlers/roomHandlers');
const verifySocketJwtToken = require('./middlewares/authSocket');

const registerSocketServer = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.use((socket, next) => {
        verifySocketJwtToken(socket, next);
    });

    io.on('connection', (socket) => {
        console.log('User connected...');

        console.log(socket.id);
    });

    io.on('room-create', (socket) => {
        console.log('Run')
        // roomHandlers.roomCreateHandler(socket);
    });
}

module.exports = registerSocketServer;