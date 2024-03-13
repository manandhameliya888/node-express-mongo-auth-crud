// This is used as try-catch of the express async code
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// @desc User Registration
// @route POST /api/users/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
    console.log("The request body coming is : => ", req.body);

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are Mandatory(username, email, password)");
    }

    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User Already Registered!");
    }

    // Hash Password
    // 10 is the SaltRounds to hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password: ", hashedPassword);

    const user = await User.create({
        username,
        email,
        password: hashedPassword
    })

    // If user created Successfully
    if (user) {
        res.status(201).json({
            message: "User Registered Successfully!",
            _id: user.id,
            email: user.email
        })
    } else {
        res.status(400);
        throw new Error("User Data is not valid!")
    }
    // res.json({ message: "User Registered Successfully!", user });
});


// @desc User Log In / Sign In
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
    console.log("The request body coming is : => ", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are Mandatory(email, password)");
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error("User Not Registered!");
    }

    // Compare password with Hashed Password
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            },
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "60m" }
        )
        res.status(200).json({ message: "User Logged In Successfully!", accessToken });
    } else {
        res.status(401);
        throw new Error("Email or Password is not Valid!")
    }

    // res.json({ message: "User Logged In Successfully!" });
});


// @desc Get Current User Information
// @route GET /api/users/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
    const user = req.user;
    res.json({ message: "Current User Fetched Successfully!", user });
});



module.exports = {
    registerUser,
    loginUser,
    currentUser
}