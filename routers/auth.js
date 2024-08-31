const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, validateRegisterUser, validateLoginUser ,validateUpdateUser} = require("../models/User");

/** 
@desc: Reister New User
@route /api/auth/register
@method POST
@access public
*/

router.post("/register", asyncHandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "User already registered" });
    }
    user = new User({

        email: req.body.email,
        firstName: req.body.firstName,
        lastName:req.body.lastName,
        password: req.body.password,
        image:req.body.image,
        role: req.body.role,
    });
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY);

    const result = await user.save();
    res.status(201).json({ token: token, user: result });
}));


/** 
@desc: Login User
@route /api/auth/login
@method POST
@access public
*/

router.post("/login", asyncHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email" });
    }

    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '5h' });

    const userResponse = user.toObject();
    delete userResponse.password; 

    res.status(200).json({ token: token, user: userResponse });
}));

/** 
@desc: get user by id 
@route /api/auth/:id
@method GET
@access public

*/
router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY);
            res.status(200).json({ token: token, user: user });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    })
);

/** 
* @desc: Update auth
* @route /api/auth/:id
* @method PUT
* @access public
*/
router.put("/:id", asyncHandler(async (req, res) => {
    const { error } = validateUpdateUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const updateData = {
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        image: req.body.image || "default-image.png", // Set default image if not provided
    };

    if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
    if (user) {
        const userResponse = user.toObject();
        delete userResponse.password; // Exclude password from the response
        res.status(200).json(userResponse);
    } else {
        res.status(404).json({ message: "User not found" });
    }
}));



module.exports = router;