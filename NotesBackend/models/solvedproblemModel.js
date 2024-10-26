const mongoose = require('mongoose');

const solvedproblemsSchema = new mongoose.Schema(
    {
        solvedproblems: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },

    },
    { timestamps: true }
);

const Solvedproblems = mongoose.model('Solvedproblems', solvedproblemsSchema);
module.exports = Solvedproblems;