const {v4: uuidv4} = require('uuid');

let activeRooms = [];

exports.addNewActiveRooms = (socketId, userId) => {
    const newActiveRoom = {
        roomCreator: {
            socketId,
            userId
        },
        participants: [
            {
                userId,
                socketId
            }
        ],
        roomId: uuidv4()
    }

    activeRooms = [...activeRooms, newActiveRoom];

    return newActiveRoom;
}
