const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please provide a username"],
            unique: true
        },
        email: {
            type: String,
            required: [true, "Please provide a email"],
            unique: [true, "This email is already in use"],
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
        },
        githubUsername: {
            type: String,
        },
        Bio: {
            type: String
        },
        Department: {
            type: String
        },
        profile: {
            type: String,
            default: "https://safesiren.vercel.app/static/media/login.665ff9176f5ac11ac2e6.png"
        },
        notesUploaded: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Note",
            },
        ],
        notesBought: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Note",
            }
        ],
        notesLiked: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Note",
            }
        ],
        notesBookMarked: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Note",
            }
        ],
        todos: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Todo",
            },
        ],
        coins: {
            type: Number,
            default: 100,
        },
        role: {
            type: String,
            enum: ["user", "superuser"],
            default: "user",
        },
        skills: [
            {
                type: String
            }
        ],
        is_active: {
            type: Boolean,
            default: "true",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
        },
        lastPlayedLottery: {
            type: Date
        }
    },
    { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = { User, userSchema };
