const mongoose = require('mongoose');

const solvedproblemsSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        problem: {
            type: String,
            required: true,
        },
        questionId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Solvedproblems = mongoose.model('Solvedproblems', solvedproblemsSchema);
module.exports = Solvedproblems;