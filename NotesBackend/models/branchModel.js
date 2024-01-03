const mongoose = require("mongoose")

const branchSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Branch name must be provided"]
    },
    year: {
        type: Number,
        required: [true, "Branch year must be provided"]
    },
    subjects: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Subject"
        }
    ]
});

const Branch = mongoose.model("Branch", branchSchema);
module.exports = { Branch, branchSchema };