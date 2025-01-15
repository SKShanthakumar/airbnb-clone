import mongoose from "mongoose";

const placeSchema = mongoose.Schema({
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "User",
    },
    title: {
        type: String,
        required: [true, "Please provide title"]
    },
    address: {
        type: String,
        required: [true, "Please provide address"],
        unique: [true, "address already exists"]
    },
    photos: {
        type: [String],
        required: [true, "Please add photos"]
    },
    description: {
        type: String,
        required: [true, "Please provide description"]
    },
    perks: {
        type: [String]
    },
    extraInfo: {
        type: String
    },
    checkIn: {
        type: Number,
        required: [true, "Please provide check in time"]
    },
    checkOut: {
        type: Number,
        required: [true, "Please provide check out time"]
    },
    maxGuests: {
        type: Number,
        required: [true, "Please provide maximum number of guests"]
    },
});

export default mongoose.model("Place", placeSchema); 