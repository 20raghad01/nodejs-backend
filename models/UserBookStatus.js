const mongoose = require('mongoose');
const Joi = require('joi');

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
        enum: ['Read', 'Reading', 'Want to read'],
        required: true,
    },
}, { timestamps: true });

const UserBookStatus = mongoose.model('UserBookStatus', userBookStatusSchema);
function validateStatus(obj) {
    const schema = Joi.object({
        user:Joi.string().required(),
        book:Joi.string().required(),
        status:Joi.string().required(),

    });

    return schema.validate(obj);
}
//validate status
function validateUpdateStatus(obj) {
    const schema = Joi.object({
        user:Joi.string().required(),
        book:Joi.string().required(),
        status:Joi.string().required(),
    });

    return schema.validate(obj);
}

module.exports = {UserBookStatus,validateStatus,validateUpdateStatus};
