const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    patient_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    doctor_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time_slot: {
        type: String,
        required: true
    },
    status: { 
        type: String, 
        enum: ["Pending", "Confirmed", "Completed", "Cancelled"], 
        default: "Pending" 
    }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
