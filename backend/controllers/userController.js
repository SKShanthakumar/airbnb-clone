import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

// @desc Register a user
// @route POST /api/user/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered");
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // When you write username and email directly inside the object, it's using object property shorthand, assumes the key and the value are the same.
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    if (user) {
        res.status(201).json({ _id: user.id, email: user.email });
    } else {
        res.status(400);
        throw new Error("user data not valid");
    }
});

// @desc Login a user
// @route POST /api/user/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                name: user.name,
                email: user.email,
                id: user.id
            }
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "12h" });
        res.status(200).cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: process.env.COOKIE_SAME_SITE,
            secure: process.env.COOKIE_SECURE_STATE,
        }).json({ name: user.name, email: user.email });
    } else {
        res.status(400);
        throw new Error("email or password not valid");
    }
});

// @desc Current user information
// @route GET /api/user/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

// @desc Logout a user
// @route POST /api/user/logout
// @access private
const logoutUser = asyncHandler(async (req, res) => {
    res.status(200).cookie('accessToken', '', {
        httpOnly: true,
        sameSite: process.env.COOKIE_SAME_SITE,
        secure: process.env.COOKIE_SECURE_STATE,
    }).json({message: "logout successful"});
});

export { registerUser, loginUser, currentUser, logoutUser }