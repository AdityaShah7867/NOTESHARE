
const mongoose = require('mongoose')
const { Note } = require('../models/noteModel')

const CommentSchema = mongoose.Schema({
    noteId: {
        type: mongoose.Types.ObjectId,
        ref: "Note"
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    comment: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = { Comment, CommentSchema }