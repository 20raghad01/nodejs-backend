const express = require("express");
const router = express.Router();
const { reviews,validateUpdateReview,validateReview } = require("../models/reviews");
const { Book } = require("../models/Book");
const asyncHandler = require('express-async-handler'); 
const User = require('../models/User'); 
const mongoose = require("mongoose");


router.post(
    "/",
    asyncHandler(async (req, res) => {
        const { error } = validateReview(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const review= new reviews({
            book: req.body.book,
            user: req.body.user,
            title:req.body.title,
            content:req.body.content,
            rating: req.body.rating,
        });

        const result = await review.save();
        res.status(201).json(result);
    })
);
router.get(
    '/user/:userId',
    asyncHandler(async (req, res) => {
        const { userId } = req.params;

        // Validate userId (assuming it's a valid ObjectId)
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Fetch statuses for the given user
        const userreview = await reviews.find({ user: userId });

        if (!userreview.length) {
            return res.status(404).json({ message: 'No Review found for this user' });
        }

        res.status(200).json(userreview);
    })
);
router.get(
    '/book/:bookId',
    asyncHandler(async (req, res) => {
        const { bookId } = req.params;

        // Validate userId (assuming it's a valid ObjectId)
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Fetch statuses for the given user
        const bookreview = await reviews.find({ book: bookId });

        if (!bookreview.length) {
            return res.status(404).json({ message: 'No Review found for this book' });
        }

        res.status(200).json(bookreview);
    })
);






module.exports = router;
