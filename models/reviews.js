const express = require("express");
const Joi = require("joi");
const router = express.Router();


const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0, 
        max: 5,
    },
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
}, { timestamps: true });

function validateReview(obj) {
    const schema = Joi.object({
        user:Joi.string().required(),
        book:Joi.string().required(),
        title:Joi.string(),
        content:Joi.string(),
        rating:Joi.number(),

    });

    return schema.validate(obj);
}
//validate status
function validateUpdateReview(obj) {
    const schema = Joi.object({
        user:Joi.string().required(),
        book:Joi.string().required(),
        title:Joi.string(),
        content:Joi.string(),
        rating:Joi.number(),
    });

    return schema.validate(obj);
}


const reviews = mongoose.model("reviews", reviewSchema);
module.exports = {
    reviews,validateUpdateReview,validateReview
}