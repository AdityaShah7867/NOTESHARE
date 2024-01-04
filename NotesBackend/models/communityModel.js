const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],

    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },

    password: {
        type: String,
        required: false,
        default: null
    },

    image: {
        type: String,
        default: null
    }


}, { timestamps: true });

const Community = mongoose.model('Community', communitySchema);
module.exports = Community;