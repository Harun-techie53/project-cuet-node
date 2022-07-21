const mongoose = require('mongoose');

const registeredTermSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ]
});

module.exports = RegisteredTerm = mongoose.model('RegisteredTerm', registeredTermSchema);