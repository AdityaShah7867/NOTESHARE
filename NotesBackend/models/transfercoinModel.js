const mongoose = require('mongoose');

const TransferCoinHistory = new mongoose.Schema({
    sender: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        username: {
            type: String,
            required: true,
        }

    },
    receiver: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        username: {
            type: String,
            required: true,
        }
    },
    coins: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },


});

const TransferCoin = mongoose.model('TransferCoin', TransferCoinHistory);
module.exports = { TransferCoin };
