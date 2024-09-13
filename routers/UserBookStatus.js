const express = require('express');
const router = express.Router();
const {UserBookStatus,validateStatus,validateUpdateStatus}= require('../models/UserBookStatus');
const asyncHandler = require('express-async-handler'); 
const Book = require('../models/Book');
const mongoose = require("mongoose");
const User = require('../models/User'); 


router.get(
    "/",
    asyncHandler(async (req, res) => {
        const { pageNumber } = req.query;
        const statusPerPage = 5;
         statusList = await UserBookStatus.find().skip((pageNumber - 1) * statusPerPage)
        .limit(statusPerPage);
    res.status(200).json(statusList);
}
));


/**
 * @desc: Update user-book status
 * @route /api/status/:id
 * @method PUT
 * @access public
 */
router.put(
    '/:id',
    asyncHandler(async (req, res) => {
        const { error } = validateUpdateStatus(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const updatedStatus = await UserBookStatus.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status: req.body.status,
                },
            },
            { new: true }
        );

        res.status(200).json(updatedStatus);
    })
);


router.post(
    "/",
    asyncHandler(async (req, res) => {
        const { error } = validateStatus(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const userbook= new UserBookStatus({
            book: req.body.book,
            user: req.body.user,
            status: req.body.status,
        });

        const result = await userbook.save();
        res.status(201).json(result);
    })
);



/**
 * @desc: Get all book statuses for a specific user
 * @route /api/status/user/:userId
 * @method GET
 * @access public
 */
router.get(
    '/user/:userId',
    asyncHandler(async (req, res) => {
        const { userId } = req.params;

        // Validate userId (assuming it's a valid ObjectId)
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Fetch statuses for the given user
        const userStatuses = await UserBookStatus.find({ user: userId });

        if (!userStatuses.length) {
            return res.status(404).json({ message: 'No statuses found for this user' });
        }

        res.status(200).json(userStatuses);
    })
);
module.exports = router;
