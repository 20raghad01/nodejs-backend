const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User'); 
const Book = require('../models/Book'); 
const Author = require('../models/Author');
const router = express.Router();

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Folder to store uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

// Route to upload image and associate with book, user, or author
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        const imageUrl = req.file.path; // Path to the uploaded image
        const { entityId, entityType } = req.body;

        if (!entityId || !entityType) {
            return res.status(400).send('Entity ID and type are required');
        }

        let updatedEntity;

        switch (entityType) {
            case 'book':
                updatedEntity = await Book.findByIdAndUpdate(entityId, { image: imageUrl }, { new: true });
                break;
            case 'user':
                updatedEntity = await User.findByIdAndUpdate(entityId, { image: imageUrl }, { new: true });
                break;
            case 'author':
                updatedEntity = await Author.findByIdAndUpdate(entityId, { image: imageUrl }, { new: true });
                break;
            default:
                return res.status(400).send('Invalid entity type');
        }

        if (!updatedEntity) {
            return res.status(404).send('Entity not found');
        }

        res.status(200).send('File uploaded and entity updated successfully');
    } catch (error) {
        res.status(500).send('Error uploading file: ' + error.message);
    }
});

module.exports = router;
