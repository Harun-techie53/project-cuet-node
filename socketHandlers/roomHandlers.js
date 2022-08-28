const serverStore = require('../serverStore');

exports.roomCreateHandler = (socket) => {
    console.log('Room created');

    const socketId = socket.id;
    const { id: userId } = socket.user;

    // const roomDetails = serverStore.addNewActiveRooms(socketId, userId);
    console.log('Check')
    socket.emit('room-create', {
        message:'OK'
    });
}