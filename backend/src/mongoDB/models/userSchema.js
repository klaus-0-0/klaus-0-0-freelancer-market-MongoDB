const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            match: [
                /^\S+@\S+\.\S+$/,
                "Please enter a valid email address",
            ]
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        }
    },
    { timestamps: true }

);



module.exports = mongoose.model("User", UserSchema);
