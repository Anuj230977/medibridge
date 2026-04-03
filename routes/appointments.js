const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User"); 
const auth = require("../middleware/auth");
const { sendAppointmentSMS } = require("../services/smsService");
const mongoose = require('mongoose');

// Book appointment
router.post("/book", auth, async (req, res) => {
  try {
    const { date, time_slot, patient_id } = req.body;
    console.log("Booking request:", { date, time_slot, patient_id }); // Debug log

    // Find the doctor 
    const doctor = await Doctor.findOne({ email: "doctor@gmail.com" });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
      doctor_id: doctor._id,
      date,
      time_slot,
      status: { $ne: "Cancelled" },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    // Create new appointment
    const appointment = new Appointment({
      patient_id,
      doctor_id: doctor._id,
      date,
      time_slot,
      status: "Pending",
    });

    await appointment.save();

    // Update doctor's booked slots
    if (!doctor.bookedSlots) {
      doctor.bookedSlots = new Map();
    }
    if (!doctor.bookedSlots.get(date)) {
      doctor.bookedSlots.set(date, []);
    }
    doctor.bookedSlots.get(date).push(time_slot);
    await doctor.save();

    console.log("Appointment booked:", appointment); // Debug log

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while booking appointment",
    });
  }
});

// Get patient appointments
router.get("/my/:patient_id", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient_id: req.params.patient_id,
    })
      .populate("doctor_id", "name email")
      .sort({ date: 1, time_slot: 1 });
    res.json({ success: true, appointments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Cancel appointment
router.put("/cancel/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient_id', 'name phone email')
      .populate('doctor_id', 'name email');

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Update status
    appointment.status = "Cancelled";
    await appointment.save();

    // Send SMS notification to patient
    if (appointment.patient_id && appointment.patient_id.phone) {
      const smsResult = await sendAppointmentSMS(
        appointment.patient_id.phone,
        "Cancelled",
        {
          date: appointment.date,
          time_slot: appointment.time_slot,
          doctorName: appointment.doctor_id.name
        }
      );

      console.log(`SMS notification sent for appointment cancellation:`, smsResult);
    }

    res.json({ 
      success: true, 
      message: "Appointment cancelled successfully. SMS notification sent to patient.", 
      appointment 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update appointment status (doctor)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Confirmed", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    // Fetch appointment with patient and doctor details
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient_id', 'name phone email')
      .populate('doctor_id', 'name email');

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Store old status for logging
    const oldStatus = appointment.status;

    // Update status
    appointment.status = status;
    await appointment.save();

    // Send SMS notification to patient
    if (appointment.patient_id && appointment.patient_id.phone) {
      const smsResult = await sendAppointmentSMS(
        appointment.patient_id.phone,
        status,
        {
          date: appointment.date,
          time_slot: appointment.time_slot,
          doctorName: appointment.doctor_id.name
        }
      );

      console.log(`SMS notification sent for appointment ${req.params.id}:`, smsResult);
    } else {
      console.warn(`No phone number found for patient ${appointment.patient_id._id}`);
    }

    res.json({ 
      success: true, 
      message: `Appointment ${status.toLowerCase()} successfully. SMS notification sent to patient.`,
      appointment 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// New route to get pending appointments
router.get('/pending', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({
            status: 'Pending'
        }).sort({ date: 1, time_slot: 1 });

        res.json({ 
            success: true, 
            appointments 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching pending appointments' 
        });
    }
});

router.get('/status/:status', auth, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Get appointments for requested status
        const appointments = await Appointment.find({ status: req.params.status })
            .sort({ date: 1, time_slot: 1 })
            .populate('patient_id', 'name phone email dob gender address');

        // Get counts for all statuses
        const counts = await Appointment.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const countsObject = {
            Pending: 0,
            Confirmed: 0,
            Completed: 0,
            Cancelled: 0
        };
        
        counts.forEach(item => {
            countsObject[item._id] = item.count;
        });

        res.json({
            success: true,
            appointments: appointments.map(apt => ({
                _id: apt._id,
                patient_id: apt.patient_id._id, // Include patient ID
                patient_name: apt.patient_id.name,
                patient_phone: apt.patient_id.phone,
                date: apt.date,
                time_slot: apt.time_slot,
                status: apt.status
            })),
            counts: countsObject
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments'
        });
    }
});

// Add this new route
router.get('/patient/:id', auth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid patient ID format' });
        }

        const patient = await User.findById(req.params.id)
            .select('name email phone dob gender address');
        
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        if (req.user.role !== 'doctor') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        res.json({
            success: true,
            patient: {
                name: patient.name,
                email: patient.email,
                phone: patient.phone || 'Not provided',
                dob: patient.dob,
                gender: patient.gender,
                address: patient.address || 'Not provided'
            }
        });

    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching patient information' 
        });
    }
});

module.exports = router;
