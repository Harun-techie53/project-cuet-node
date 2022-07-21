const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'A course must have a name!']
    },
    credit: {
        type: Number,
        required: [true, 'A course must have credits!']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    level: {
        type: Number,
        required: [true, 'A course must have a level!']
    },
    term: {
        type: Number,
        required: [true, 'A course must have a term!']
    },
    sessional: Boolean
});

module.exports = Course = mongoose.model('Course', courseSchema);