const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { Category, validateCategory, validateUpdateCategory } = require("../models/Category");

/** 
@desc: Get all categories
@route /api/categories
@method GET
@access public
*/
router.get(
    "/",
    asyncHandler(async (req, res) => {
        const categories = await Category.find();
        res.status(200).json(categories);
    })
);

/** 
@desc: Get category by ID 
@route /api/categories/:id
@method GET
@access public
*/
router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const category = await Category.findById(req.params.id);
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    })
);

/** 
@desc: Get category by name 
@route /api/categories/name/:name
@method GET
@access public
*/
router.get(
    "/name/:name",
    asyncHandler(async (req, res) => {
        const category = await Category.findOne({ name: req.params.name });
        if (category) {
            res.status(200).json(category);
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    })
);

/**
 * @desc: Create new category
 * @route /api/categories
 * @method POST
 * @access public
 */
router.post(
    "/",
    asyncHandler(async (req, res) => {
        const { error } = validateCategory(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const category = new Category({
            name: req.body.name,
            description: req.body.description,
        });

        const result = await category.save();
        res.status(201).json(result);
    })
);

/**
 * @desc: Update category
 * @route /api/categories/:id
 * @method PUT
 * @access public
 */
router.put(
    "/:id",
    asyncHandler(async (req, res) => {
        const { error } = validateUpdateCategory(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                },
            },
            { new: true }
        );

        res.status(200).json(updatedCategory);
    })
);

/**
 * @desc: Delete category
 * @route /api/categories/:id
 * @method DELETE
 * @access public
 */
router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
        const category = await Category.findById(req.params.id);
        if (category) {
            await Category.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Category deleted successfully" });
        } else {
            res.status(404).json({ message: "Category not found" });
        }
    })
);

module.exports = router;