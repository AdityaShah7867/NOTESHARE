const mongoose = require('mongoose')

const likeSchema = mongoose.Schema({
    noteId: {
        type: mongoose.Types.ObjectId,
        ref: "Note"
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

const Like = mongoose.model("Like", likeSchema);
module.exports = { Like, likeSchema }