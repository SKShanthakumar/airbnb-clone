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
    password: {
        type: String,
        required: [true, "Please enter password"]
    },
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema); 