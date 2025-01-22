import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
import Place from '../models/placeModel.js'
import { fileURLToPath } from 'url';
import { dirname, extname, join } from 'path';
import imageDownloader from 'image-downloader';
import Booking from "../models/bookingModel.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

// @desc Upload photos using link
// @route POST /api/place/photo/upload-by-link
// @access private
const uploadByLink = asyncHandler(async (req, res) => {
    const { link } = req.body;
    const extension = extname(link);
    const newName = req.user.name + "-" + Date.now() + extension;

    try {
        await imageDownloader.image({
            url: link,
            dest: join(__dirname, 'uploads', newName),
        })
        res.json({ fileName: newName }).status(200);
    } catch (e) {
        res.status(404);
        throw new Error("invalid link");
    }
});

// @desc Upload photos from device
// @route POST /api/place/photo/upload-from-device
// @access private
const uploadFromDevice = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        res.status(400);
        throw new Error('No files uploaded');
    }

    // Get the filenames of uploaded files
    const fileNames = req.files.map(file => file.filename);

    // Send the filenames as response
    res.json({ fileNames });
});

// @desc Add an accommodation
// @route POST /api/place/add
// @access private
const addAccommodation = asyncHandler(async (req, res) => {
    const { title, address, photos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price } = req.body;

    const placeAvailable = await Place.findOne({ address });
    if (placeAvailable) {
        res.status(400);
        throw new Error("Address already registered");
    }

    const place = await Place.create({
        owner: req.user.id,
        title,
        address,
        photos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price
    });

    if (place) {
        res.status(201).json({ id: place.id, owner_id: place.owner, message: "success" });
    } else {
        res.status(200).json({ message: "Place not added" });
    }
});

// @desc Update an accommodation
// @route PUT /api/place/:id
// @access private
const updateAccommodation = asyncHandler(async (req, res) => {
    const data = await Place.findById(req.params.id);
    if (!data) {
        res.status(400);
        throw new Error("Place not found")
    } else if (!data.owner == req.user.id) {
        res.status(400);
        throw new Error("User not authorized to access this place")
    }

    const updated = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
});

// @desc Get all accommodations added by a user
// @route GET /api/place/my-places
// @access private
const getMyAccommodations = asyncHandler(async (req, res) => {
    const data = await Place.find({ owner: req.user.id });
    if (data)
        res.status(200).json(data);
    else {
        res.status(400);
        throw new Error("Database Error");
    }
});

// @desc Book an accommodation
// @route GET /api/place/book
// @access private
const bookAccommodation = asyncHandler(async (req, res) => {
    const { place, owner, checkIn, checkOut, guests, nights, price } = req.body;

    if (owner == req.user.id) {
        res.status(400);
        throw new Error("You cannot book your own accommodation");
    }

    const booking = await Booking.create({
        place,
        client: req.user.id,
        checkIn,
        checkOut,
        guests,
        nights,
        price
    });
    res.status(200).json({id: booking.id})
});

// @desc Get all bookings of a user
// @route GET /api/place/my-bookings
// @access private
const getMyBookings = asyncHandler(async (req, res) => {
    const data = await Booking.find({ client: req.user.id }).populate("place", "address id owner title photos");
    if (data)
        res.status(200).json(data);
    else {
        res.status(400);
        throw new Error("Database Error");
    }
});

// @desc Get accommodation by id
// @route GET /api/place/public/:id
// @access public
const getAccommodationById = asyncHandler(async (req, res) => {
    const data = await Place.findById(req.params.id);
    if (!data) {
        res.status(400);
        throw new Error("Place not found")
    }
    res.status(200).json(data);
});

// @desc Get all accommodations
// @route GET /api/place
// @access public
const getAccommodations = asyncHandler(async (req, res) => {
    const data = await Place.find();
    if (data)
        res.json(data).status(200);
    else {
        res.status(400);
        throw new Error("Database Error");
    }
});

export { uploadByLink, uploadFromDevice, addAccommodation, updateAccommodation, getMyAccommodations, bookAccommodation, getMyBookings, getAccommodationById, getAccommodations }