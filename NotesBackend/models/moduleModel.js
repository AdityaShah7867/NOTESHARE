const mongoose = require("mongoose");

const moduleSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "subject name must be provided"]
    },
    subject: {
        type: mongoose.Types.ObjectId,
        ref: "Subject",
        required: [true, "Subject must be mentioned"]
    },
});

const ModuleName = mongoose.model("ModuleName", moduleSchema);
module.exports = { ModuleName, moduleSchema }