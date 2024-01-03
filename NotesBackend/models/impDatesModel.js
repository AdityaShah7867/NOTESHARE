const mongoose = require('mongoose')

const impDatesSchema = mongoose.Schema({
    title: {
        type: String,
    },
    date: {
        type: Date,
        
    },
    description: {
        type: String,
    },
})

const ImpDate = mongoose.model('IMPDATE', impDatesSchema);

module.exports = { ImpDate };