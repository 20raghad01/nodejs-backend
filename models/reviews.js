const express = require("express");
const router = express.Router();
const { reviews } = require("../models/reviews");


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

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;


const reviews = mongoose.model("reviews", reviewsSchema);
module.exports = {
    reviews
}