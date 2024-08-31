const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Author, validateAuthor, validateUpdateAuthor } = require("../models/Author");



/** 
@desc: get all authors
@route /api/authors
@method GET
@access public

*/
router.get("/", asyncHandler(async (req, res) => {
    const { pageNumber } = req.query;
    const authorsPerPage = 5;

    const authorList = await Author.find()
        .skip((pageNumber - 1) * authorsPerPage)
        .limit(authorsPerPage);
    res.status(200).json(authorList);
}));

/** 
@desc: get authors by id 
@route /api/authors/:id
@method GET
@access public

*/
router.get("/:id", asyncHandler(async (req, res) => {

    const author = await Author.findById(req.params.id);
    if (author) {
        res.status(200).json(author);
    } else {
        res.status(404).json({ message: "Author not found" });
    }
}));

/** 
* @desc: Create new author
* @route /api/authors
* @method POST
* @access public
*/
router.post("/", asyncHandler(async (req, res) => {

    const { error } = validateAuthor(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const author = new Author({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        image: req.body.image,
    })
    const result = await author.save();
    res.status(201).json(result);
}));

/** 
* @desc: Update author
* @route /api/authors/:id
* @method PUT
* @access public
*/
router.put("/:id", asyncHandler(async (req, res) => {
    const { error } = validateUpdateAuthor(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const author = await Author.findByIdAndUpdate(req.params.id, {
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nationality: req.body.nationality,
            image: req.body.image,
        }
    },
        {
            new: true
        }
    )

    res.status(200).json(author);
}));

/** 
* @desc: Delete author
* @route /api/authors/:id
* @method DELETE
* @access public
*/
router.delete("/:id", asyncHandler(async (req, res) => {

    const author = await Author.findById(req.params.id);
    if (author) {
        await Author.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "author Deleted successfully" });
    } else {
        res.status(404).json({ message: "author not found" });
    }

}));



module.exports = router;