const mongoose = require('mongoose');

const sensitiveSchema = new mongoose.Schema({
    
    user_email:{
        
        type: String
    
    },

    ip_address:{
        type: String,
    },

    device_info:{
        type: String,
    },

    city:{
        type: String,
    },

    region:{
        type: String,
    },

    country:{
        type: String,
    },

    location:{
        type: String,
    },

    country: {
        type: String,
    },
    
    organisation:{
        type: String,
    },
    
    postal:{
        type: String,
    },
    timezone:{
        type: String,
    },
    

    lastLogin:{
        type: Date,
        default: Date.now
    },


},{timestamps: true});

const Sensitive = mongoose.model('Sensitive', sensitiveSchema);
module.exports = Sensitive;