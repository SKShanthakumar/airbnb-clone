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
    const { name, email, phone, password, profilePic, language } = req.body;

    if (!name || !email || !password || !phone) {
        res.status(400);
        throw new Error("All fields are required");
    }
    const userAvailableEmail = await User.findOne({ email });
    if (userAvailableEmail) {
        res.status(400);
        throw new Error("Email already registered");
    }

    const userAvailablePhone = await User.findOne({ phone });
    if (userAvailablePhone) {
        res.status(400);
        throw new Error("Phone number already registered");
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // When you write username and email directly inside the object, it's using object property shorthand, assumes the key and the value are the same.
    const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        profilePic,
        language
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
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                language: user.language
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

// @desc Update a user
// @route PUT /api/user/update
// @access private
const updateUser = asyncHandler(async (req, res) => {
    const { name, email, phone, profilePic, language } = req.body;

    // email & phone check
    const emailCheck = await User.findOne({email});
    const phoneCheck = await User.findOne({phone});
    if((emailCheck && emailCheck.id != req.user.id) || (phoneCheck && phoneCheck.id != req.user.id)){
        res.status(401);
        throw new Error("user not authorized to update data with this email and phone number");
    }

    const fetchedUser = await User.findById(req.user.id);
    if (!fetchedUser) {
        res.status(400);
        throw new Error("user not found")
    }

    const data = {
        name,
        email,
        phone,
        profilePic,
        language
    }

    const updated = await User.findByIdAndUpdate(req.user.id, data, { new: true });

    const accessToken = jwt.sign({
        user: {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            phone: updated.phone,
            language: updated.language
        }
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "12h" });
    res.status(200).cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: process.env.COOKIE_SAME_SITE,
        secure: process.env.COOKIE_SECURE_STATE,
    }).json({
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        language: updated.language
    });
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
    }).json({ message: "logout successful" });
});

// @desc Get user data by id
// @route GET /api/user/:id
// @access public
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(400);
        throw new Error("User not found");
    }

    let old = ""; // Initialize the old variable

    const createdDate = new Date(user.createdAt);
    const currentDate = new Date();

    const totalMonths = (currentDate.getFullYear() - createdDate.getFullYear()) * 12 + (currentDate.getMonth() - createdDate.getMonth());

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const days = Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24));

    if (years >= 1) {
        old = `${years} year${years > 1 ? 's' : ''}`;
    } else if (months >= 1) {
        old = `${months} month${months > 1 ? 's' : ''}`;
    } else {
        old = `${days} day${days > 1 ? 's' : ''}`;
    }

    res.json({ name: user.name, old, id: user.id }).status(200);
});

export { registerUser, loginUser, updateUser, currentUser, logoutUser, getUserById }