const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true  
    },
    specialization: {
        type: String,
        default: 'General Physician'
    },
    role: {
        type: String,
        default: 'doctor'
    },
    schedule: {
        type: Map,
        of: [String],
        default: new Map()
    },
    bookedSlots: {
        type: Map,
        of: [String],
        default: new Map()
    },
    unavailability: [{
        fromDate: Date,
        toDate: Date,
        reason: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { 
    timestamps: true,
    collection: 'doctor'
});

module.exports = mongoose.model('Doctor', doctorSchema);