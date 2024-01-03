const mongoose = require("mongoose");

const subjectSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "subject name must be provided"],
        unique: true
    },
    branch: {
        type: mongoose.Types.ObjectId,
        ref: "Branch",
        required: [true, "Branch must be mentioned"]
    },
    Image: {
        type: String,

    },
    sem: {
        type: Number,
        required: [true, "Sem must be mentioned"]

    },
    module: [{
        type: mongoose.Types.ObjectId,
        ref: "Module",
    }],
    teacher: {
        type: String,
    }
});

const Subject = mongoose.model("Subject", subjectSchema);
module.exports = { Subject, subjectSchema };
