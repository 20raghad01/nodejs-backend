const mongoose = require("mongoose");
const Joi = require("joi");

// Category schema
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
            validate: {
                validator: function (value) {
                    return value && value.trim().length > 0;
                },
                message: "Description cannot be an empty string"
            }
        }
    },
    { timestamps: true }
);

// Category model
const Category = mongoose.model("Category", categorySchema);

// Validate create category
function validateCategory(obj) {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(50).required(),
        description: Joi.string().trim().max(500)
    });

    return schema.validate(obj);
}

// Validate update category
function validateUpdateCategory(obj) {
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(50),
        description: Joi.string().trim().max(500),
    });

    return schema.validate(obj);
}

// Export Category model and validation functions
module.exports = {
    Category,
    validateCategory,
    validateUpdateCategory
};