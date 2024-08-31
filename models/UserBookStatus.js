const mongoose = require('mongoose');

const userBookStatusSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    status: {
        type: String,
        enum: ['reading', 'finished', 'want-to-read', 'none'],
        default: 'none',
    },
}, { timestamps: true });

const UserBookStatus = mongoose.model('UserBookStatus', userBookStatusSchema);

module.exports = UserBookStatus;
