const mongoose = require('mongoose');

const TransferCoinHistory = new mongoose.Schema({
    sender: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

    },
    receiver: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

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
