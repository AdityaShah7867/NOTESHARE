const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        lowercase: true,
        trim: true,
        minLength: 5,
        maxLength: 50,
    },
    uploadedAt: {
        type: Date,
        default: Date.now()
    },
    acceptedStatus: {
        type: Boolean,
        default: false
    },
    subject: {
        type: mongoose.Types.ObjectId,
        ref: "Subject",
    },
    module: {
        type: Number,
        required: [false, "Module must be provided"]
    },
    type: {
        type: String,
        required: true
    },
    purchased: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    comments: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Comment"
        }
    ],
    desc: {
        type: String,
        minLength: 10,
        maxLength: 250,
        required: [true, "Desc must be provided"]
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    file: {
        type: String,
        required: [true, "Can't upload a note without a file"]
    },
    fileMimeType: {
        type: String,
        // required: [true, "Can't upload a note without a file"]
    },
    uploadedToS3: {
        type: Boolean,
        default: false
    },
    year:{
        type:String,
        enum: ['FE','SE','TE','BE'],
        required:true
    },
    branch:{
        type:String,
        required:true
    }
});

const Note = mongoose.model("Note", noteSchema);
module.exports = { Note, noteSchema }