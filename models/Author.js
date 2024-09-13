const mongoose = require("mongoose");
const Joi = require("joi");

const Authorschema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 200,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 200,
        },
        nationality: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        image: { type: String, default: "default-image.png" 

        },
        description: {
            type: String,
            trim: true,
            minlength: 5,
            default:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."

        },
    },
    { timeStamps: true }
);

const Author = mongoose.model("Author", Authorschema);
// Validate create author
function validateAuthor(obj) {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(200).required(),
        lastName: Joi.string().trim().min(3).max(200).required(),
        nationality: Joi.string().trim().min(2).max(100).required(),
        image: Joi.string(),
        description: Joi.string().trim().min(5)
    });

    return schema.validate(obj);
}
// validate Update book
function validateUpdateAuthor(obj) {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(200),
        lastName: Joi.string().trim().min(3).max(30),
        nationality: Joi.string().trim().min(2).max(100),
        image: Joi.string(),
        description: Joi.string().trim().min(5)
    });

    return schema.validate(obj);
}

module.exports = {
    Author,
    validateAuthor,
    validateUpdateAuthor,
};