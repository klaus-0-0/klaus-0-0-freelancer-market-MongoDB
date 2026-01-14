const mongoose = require("mongoose");

const SellerProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        skill: {
            type: String,
            required: true
        },
        experience: {
            type: Number,
            required: true,
            // min: 0
        },
        hourlyRate: {
            type: Number,
            required: true,
            // min: 1
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("SellerProfile", SellerProfileSchema);
