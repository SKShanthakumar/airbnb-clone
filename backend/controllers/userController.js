import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';       // for deleting files from storage
import dotenv from 'dotenv';
import sharp from "sharp"; // for img compression
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

function oldCalculator(user) {
    let old = "";

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
    return old;
}

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
                language: user.language,
                profilePic: user.profilePic,
                favourites: user.favourites,
                createdAt: user.createdAt
            }
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "12h" });

        const old = oldCalculator(user);

        res.status(200).cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: process.env.COOKIE_SAME_SITE,
            secure: process.env.COOKIE_SECURE_STATE,
        }).json({ name: user.name, email: user.email, profilePic: user.profilePic, old, favourites: user.favourites });
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
    const emailCheck = await User.findOne({ email });
    const phoneCheck = await User.findOne({ phone });
    if ((emailCheck && emailCheck.id != req.user.id) || (phoneCheck && phoneCheck.id != req.user.id)) {
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
            language: updated.language,
            profilePic: updated.profilePic,
            favourites: updated.favourites,
            createdAt: updated.createdAt
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
    const old = oldCalculator(req.user);
    res.status(200).json({ ...req.user, old });
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

// @desc set profile picture for a user
// @route POST /api/user/set-profile-pic
// @access private
const setProfilePic = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }
    const prevProfile = req.user.profilePic;
    const img = req.file.filename;

    // Path where the original uploaded file is saved
    const originalFilePath = join(__dirname, 'uploads', 'temp', img);

    // Compress the image using sharp
    const compressedFileName = `compressed-${img}`;
    const compressedFilePath = join(__dirname, 'uploads', 'profile', compressedFileName);

    try {
        await sharp(originalFilePath)
            .resize(500)  // Resize to max width of 300px
            .toFile(compressedFilePath);  // Save the compressed version

    } catch (error) {
        res.status(500);
        throw new Error('Error processing image');
    }

    const updated = await User.findByIdAndUpdate(req.user.id, { profilePic: compressedFileName }, { new: true });

    if (!updated) {
        res.status(400);
        throw new Error("user not found")
    }

    if (prevProfile != "" && prevProfile != undefined) {
        const filePath = join(__dirname, "uploads", "profile", prevProfile); // Adjust the path to your uploads directory
        fs.unlink(filePath, (err) => {
            if (err && err.code !== "ENOENT") {
                // Log error if it's not a "file not found" error
                throw new Error(`Failed to delete file: ${filePath}, err`);
            }
        });
    }

    const accessToken = jwt.sign({
        user: {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            phone: updated.phone,
            language: updated.language,
            profilePic: updated.profilePic,
            favourites: updated.favourites,
            createdAt: updated.createdAt
        }
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "12h" });
    res.status(200).cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: process.env.COOKIE_SAME_SITE,
        secure: process.env.COOKIE_SECURE_STATE,
    }).json({
        img: compressedFileName
    });
});

// @desc remove profile picture for a user
// @route POST /api/user/remove-profile-pic
// @access private
const removeProfilePic = asyncHandler(async (req, res) => {
    const photo = req.user.profilePic;

    const updated = await User.findByIdAndUpdate(req.user.id, { profilePic: "" }, { new: true });

    if (!updated) {
        res.status(400);
        throw new Error("user not found")
    }

    const filePath = join(__dirname, "uploads", "profile", photo); // Adjust the path to your uploads directory
    fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
            // Log error if it's not a "file not found" error
            throw new Error(`Failed to delete file: ${filePath}, err`);
        }
    });

    const accessToken = jwt.sign({
        user: {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            phone: updated.phone,
            language: updated.language,
            profilePic: updated.profilePic,
            favourites: updated.favourites,
            createdAt: updated.createdAt
        }
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "12h" });
    res.status(200).cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: process.env.COOKIE_SAME_SITE,
        secure: process.env.COOKIE_SECURE_STATE,
    }).json({
        img: ""
    });
});

// @desc add place to favourites of user
// @route POST /api/user/add-to-favourites
// @access private
const addToFavourites = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        res.status(400);
        throw new Error("Place ID is required");
    }

    const updated = await User.findByIdAndUpdate(
        req.user.id,
        { $addToSet: { favourites: id } }, // Add to favourites array if not already present
        { new: true }
    );

    if (!updated) {
        res.status(404);
        throw new Error("User not found");
    }

    const accessToken = jwt.sign({
        user: {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            phone: updated.phone,
            language: updated.language,
            profilePic: updated.profilePic,
            favourites: updated.favourites,
            createdAt: updated.createdAt
        }
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "12h" });
    res.status(200).cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: process.env.COOKIE_SAME_SITE,
        secure: process.env.COOKIE_SECURE_STATE,
    }).json({
        favourites: updated.favourites,
    });
});

// @desc remove place from favourites of user
// @route POST /api/user/remove-from-favourites
// @access private
const removeFromFavourites = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        res.status(400);
        throw new Error("Place ID is required");
    }

    const updated = await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { favourites: id } }, // Remove the place ID from favourites
        { new: true }
    );

    if (!updated) {
        res.status(404);
        throw new Error("User not found");
    }

    const accessToken = jwt.sign({
        user: {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            phone: updated.phone,
            language: updated.language,
            profilePic: updated.profilePic,
            favourites: updated.favourites,
            createdAt: updated.createdAt
        }
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "12h" });
    res.status(200).cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: process.env.COOKIE_SAME_SITE,
        secure: process.env.COOKIE_SECURE_STATE,
    }).json({
        favourites: updated.favourites,
    });
});

// @desc get favourites of user
// @route GET /api/user/favourites
// @access private
const getFavourites = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("favourites").populate("favourites");
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    res.status(200).json(user.favourites)
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

    let old = oldCalculator(user)

    res.json({ name: user.name, email: user.email, old, id: user.id, profilePic: user.profilePic }).status(200);
});

export { registerUser, loginUser, updateUser, currentUser, logoutUser, getUserById, setProfilePic, removeProfilePic, addToFavourites, removeFromFavourites, getFavourites }