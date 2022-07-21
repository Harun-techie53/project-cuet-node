const { v4: uuidV4 } = require('uuid');

exports.getRoom = async (req, res) => {
    try {
        res.redirect(`/api/v1/videoChat/${uuidV4()}`);
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}

exports.getRoomId = async (req, res) => {
    console.log(req.params.roomId);
    try {
        res.status(200).json({
            status: 'success',
            room: req.params.roomId
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}