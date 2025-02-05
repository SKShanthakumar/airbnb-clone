import asyncHandler from "express-async-handler";
import dotenv from 'dotenv';
import Place from '../models/placeModel.js'
import { fileURLToPath } from 'url';
import { dirname, extname, join, resolve } from 'path';
import imageDownloader from 'image-downloader';
import Booking from "../models/bookingModel.js";
import fs from 'fs';       // for deleting files from storage
import sharp from "sharp"; // for img compression
import Trie from "../dsa/trie.js";
import mergeInterval from "../dsa/mergeInterval.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

// search trie initialization
const trie = new Trie();

async function loadTrie() {
    try {
        const places = await Place.find();  // Fetch all places from MongoDB
        places.forEach((place) => {
            trie.insert(place.address.city, place.id);  // Insert each place into the Trie
        });
        console.log('Places loaded into Trie successfully.');
    } catch (error) {
        console.error('Error loading places to Trie:', error);
    }
};



// @desc Upload photos using link
// @route POST /api/place/photo/upload-by-link
// @access private
const uploadByLink = asyncHandler(async (req, res) => {
    const { link } = req.body;
    const extension = extname(link); // Preserve the original extension
    const newName = `${req.user.name}-${Date.now()}${extension}`;
    const filePath = join(__dirname, 'uploads/temp', newName);
    const compressName = `${req.user.name}-compress-${Date.now()}${extension}`;
    const filePathCompress = join(__dirname, 'uploads/placePhotos', compressName);

    try {
        await imageDownloader.image({
            url: link,
            dest: filePath,
        });

        // Compress the image (keep the original format)
        await sharp(filePath)
            .resize(800) // Resize to max width of 800px
            .toFile(filePathCompress); // Overwrite the file with the compressed version

        res.status(200).json({ fileName: compressName });
    } catch (e) {
        res.status(404);
        throw new Error('Invalid link or compression error' + e);
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

    const fileNames = [];

    for (const file of req.files) {
        const originalFilePath = resolve('uploads/temp', file.filename);
        const compressedFileName = req.user.name + '-compress-' + Date.now() + extname(file.originalname);
        const compressedFilePath = resolve('uploads/placePhotos', compressedFileName);

        try {
            // Compress the image using sharp
            await sharp(originalFilePath)
                .resize(800) // Resize to a max width of 800px (or adjust as needed)
                .toFile(compressedFilePath); // Save the compressed version

            // Add compressed filename to response array
            fileNames.push(compressedFileName);
        } catch (error) {
            console.error('Error processing image:', error);
            res.status(500);
            throw new Error('Error processing image');
        }
    }

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
        price,
        rating: []
    });

    if (place) {
        trie.insert(place.address.city, place.id);  // Insert place into the Trie
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
    const oldName = data.address.city;

    const updated = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // trie updataion
    const newName = updated.address.city;
    if (oldName !== newName) {
        trie.delete(oldName, updated.id);
        trie.insert(newName, updated.id);
    }

    res.status(200).json(updated);
});

// @desc delete an accommodation
// @route POST /api/place/delete/:id
// @access private
const deleteAccommodation = asyncHandler(async (req, res) => {
    const data = await Place.findById(req.params.id);
    if (!data) {
        res.status(400);
        throw new Error("Place not found")
    } else if (data.owner != req.user.id) {
        res.status(400);
        throw new Error("User not authorized to delete this place")
    }

    const photos = data.photos;

    const deleted = await Place.findByIdAndDelete(req.params.id);
    if (!deleted) {
        res.status(500); // Internal Server Error in case of unexpected failure
        throw new Error("Failed to delete the place");
    }

    trie.delete(data.address.city, data.id);  // Delete place from the Trie

    // For deleting files locally
    photos.forEach((photo) => {
        const filePath = join(__dirname, "uploads", "placePhotos", photo); // Adjust the path to your uploads directory
        fs.unlink(filePath, (err) => {
            if (err && err.code !== "ENOENT") {
                // Log error if it's not a "file not found" error
                throw new Error(`Failed to delete file: ${filePath}, err`);
            }
        });
    });

    res.status(200).json({
        message: "Accommodation deleted successfully",
        deleted,
    });
});

// @desc Add rating to an accommodation
// @route POST /api/place/rating
// @access private
const rateAccommodation = asyncHandler(async (req, res) => {
    return
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

    const bookings = await Booking.find({ place }).sort({ checkIn: 1 });
    let intervals = [];

    for (let book of bookings) {
        intervals.push([new Date(book.checkIn), new Date(book.checkOut)]);
    }

    const canBook = mergeInterval(intervals, [new Date(checkIn), new Date(checkOut)]);

    if (canBook) {
        const booking = await Booking.create({
            place,
            client: req.user.id,
            checkIn,
            checkOut,
            guests,
            nights,
            price
        });
        res.status(200).json({ id: booking.id })
    } else {
        res.status(400).json({ message: "accommodation already booked in these dates" })
    }
});

// @desc cancel a booking
// @route POST /api/place/booking/cancel/:id
// @access private
const cancelBooking = asyncHandler(async (req, res) => {
    const data = await Booking.findById(req.params.id);
    if (!data) {
        res.status(400);
        throw new Error("Booking not found")
    } else if (data.client != req.user.id) {
        res.status(400);
        throw new Error("User not authorized to cancel this booking")
    }

    const cancelled = await Booking.findByIdAndDelete(req.params.id);
    if (!cancelled) {
        res.status(500); // Internal Server Error in case of unexpected failure
        throw new Error("Failed to delete the place");
    }

    res.status(200).json({
        message: "Booking cancelled successfully",
        cancelled,
    });
});

// @desc Get all bookings of a user
// @route GET /api/place/my-bookings
// @access private
const getMyBookings = asyncHandler(async (req, res) => {
    const data = await Booking.find({ client: req.user.id }).populate("place", "address id owner title photos");
    const past = data.filter(booking => new Date(booking.checkIn) < new Date());
    const upcoming = data.filter(booking => new Date(booking.checkIn) >= new Date());

    if (data)
        res.status(200).json({ past, upcoming });
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

// @desc search functionality
// @route GET /api/place/search/searchPrefix
// @access public
const searchByName = asyncHandler(async (req, res) => {
    const { query } = req.params;
    if (!query) return res.json([]);

    const placeIds = trie.search(query);
    const places = await Place.find({ _id: { $in: placeIds } });
    res.json(places);
})

export { uploadByLink, uploadFromDevice, addAccommodation, updateAccommodation, deleteAccommodation, rateAccommodation, getMyAccommodations, bookAccommodation, cancelBooking, getMyBookings, getAccommodationById, getAccommodations, loadTrie, searchByName }