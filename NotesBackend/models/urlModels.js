
const mongoose = require('mongoose');


const urlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    metadata: {
        type: String,
       
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date,
    }
}, { timestamps: true })

const Url = mongoose.model('Url', urlSchema);

module.exports = {Url};