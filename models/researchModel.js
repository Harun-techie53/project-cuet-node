const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'User Id is required'],
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        // minlength: 200
    },
    thumbnail: {
        type: String,
        // required: [true, 'Thumbnail image is required']
    },
    pdf: {
        type: [String],
        // required: [true, 'A PDF is required']
    },
    description: {
        type: String,
        required: [true, 'Research description is required']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = Research = mongoose.model('Research', researchSchema);