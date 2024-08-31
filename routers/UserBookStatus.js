const express = require('express');
const router = express.Router();
const UserBookStatus = require('../models/UserBookStatus');
const asyncHandler = require('express-async-handler'); 
const Book = require('../models/Book');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 


const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; 
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

/**
 * @desc: Create or update user-book status
 * @route /api/status
 * @method POST
 * @access public
 */
router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { user, book, status } = req.body;

        
        if (!['Read', 'Reading', 'Want to read', 'none'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // Check if the status already exists for this user and book
        let userBookStatus = await UserBookStatus.findOne({ user, book });

        if (userBookStatus) {
            // If it exists, update it
            userBookStatus.status = status;
            await userBookStatus.save();
            return res.status(200).json(userBookStatus);
        }

        // If it does not exist, create a new one
        userBookStatus = new UserBookStatus({
            user,
            book,
            status,
        });

        const result = await userBookStatus.save();
        res.status(201).json(result);
    })
);

/**
 * @desc: Update user-book status
 * @route /api/status/:id
 * @method PUT
 * @access public
 */
router.put(
    '/:id',
    asyncHandler(async (req, res) => {
        const { status } = req.body;

        // Validation (e.g., checking if `status` is valid)
        if (!['Read', 'Reading', 'Want to read', 'none'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const updatedStatus = await UserBookStatus.findByIdAndUpdate(
            req.params.id,
            { status }, // Only update status
            { new: true, runValidators: true } // Return updated document and run validators
        );

        if (!updatedStatus) {
            return res.status(404).json({ message: 'UserBookStatus not found' });
        }

        res.status(200).json(updatedStatus);
    })
);


// @desc: Get all books with user status
// @route: GET /api/books/status
// @access: Private
router.get(
    '/status',
    authenticate, // Apply the authentication middleware
    asyncHandler(async (req, res) => {
        const userId = req.user._id; // Extract user ID from authenticated request

        // Fetch user book statuses
        const userBookStatuses = await UserBookStatus.find({ user: userId });

        // Extract book IDs and statuses
        const bookStatusMap = userBookStatuses.reduce((acc, { book, status }) => {
            acc[book] = status;
            return acc;
        }, {});

        // Fetch books
        const books = await Book.find({ _id: { $in: Object.keys(bookStatusMap) } });

        // Attach status to books
        const booksWithStatus = books.map(book => ({
            ...book.toObject(),
            status: bookStatusMap[book._id.toString()] || 'none'
        }));

        res.status(200).json(booksWithStatus);
    })
);

module.exports = router;
