import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide username"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email address"],
        unique: [true, "email already taken"]
    },
    phone: {
        type: String,
        required: [true, "Please provide mobile number"],
        unique: [true, "email already taken"]
    },
    password: {
        type: String,
        required: [true, "Please enter password"]
    },
    language: {
        type: [String],
        required: [true, "Please enter languages known"]
    },
    profilePic: {
        type: String,
    },
    favourites: {
        type: [String],
    },
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema); 