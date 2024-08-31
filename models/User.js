const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        minlength: [5, "Email must be at least 5 characters long"],
        maxlength: 100,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        trim: true,
        minlength: [3, "First Name must be at least 3 characters long"], // Corrected minlength
        maxlength: 100,
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
        trim: true,
        minlength: [3, "Last Name must be at least 3 characters long"], // Corrected minlength
        maxlength: 100,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minlength: [6, "Password must be at least 6 characters long"],
    },
    image: { type: String, default: "default-image.png" }, // URL or path to the image
    role: {
        type: String,
        enum: {
            values: ["admin", "user"],
            message: "{VALUE} is not a valid role",
        },
        default: "user",
    },
});

const User = mongoose.model("User", userSchema);

// Validation functions

function validateRegisterUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required(),
        firstName: Joi.string().trim().min(3).max(100).required(),
        lastName: Joi.string().trim().min(3).max(100).required(),
        password: Joi.string().trim().min(6).max(100).required(),
        image: Joi.string(),
        role: Joi.string().trim().valid("admin", "user"),
    });
    return schema.validate(obj);
}

function validateLoginUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required(),
        password: Joi.string().trim().min(6).max(100).required(),
        role: Joi.string().trim().valid("admin", "user"),
    });
    return schema.validate(obj);
}

// Validate Update User
function validateUpdateUser(obj) {
    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(100),
        lastName: Joi.string().trim().min(3).max(100),
        email: Joi.string().trim().min(5).max(100),
        password: Joi.string().trim().min(6).max(100),
        image: Joi.string(),
    });

    return schema.validate(obj);
}

module.exports = { User, validateRegisterUser, validateLoginUser, validateUpdateUser };
