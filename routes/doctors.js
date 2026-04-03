const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

router.get('/', auth, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ email: "doctor@gmail.com" });
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.json({
            success: true,
            doctor: {
                name: doctor.name,
                email: doctor.email,
                phone: doctor.phone,
                specialization: doctor.specialization
            }
        });
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching doctor information'
        });
    }
});

router.get('/admin', auth, async (req, res) => {
    try {
        console.log('Fetching admin doctor...');
        const doctor = await Doctor.findOne({role: 'doctor'});
        console.log('Found doctor:', doctor);

        if (!doctor) {
            return res.status(404).json({ 
                success: false, 
                message: 'Doctor not found' 
            });
        }

        res.json({ 
            success: true, 
            doctor: {
                name: doctor.name,
                email: doctor.email,
                phone: doctor.phone,
                specialization: doctor.specialization
            }
        });
    } catch (error) {
        console.error('Error in /doctor/admin:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching doctor information'
        });
    }
});

router.post('/schedule/update', auth, async (req, res) => {
    try {
        const { availableDates, timeSlots } = req.body;
        // Update doctor's schedule
        await Doctor.findOneAndUpdate(
            { role: 'doctor' },
            { $set: { availableDates, timeSlots } }
        );
        res.json({ success: true, message: 'Schedule updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating schedule' });
    }
});

// Add route to get all appointments for doctor
router.get('/appointments', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({
            doctor_id: req.user.id,
            status: { $ne: 'Cancelled' }
        }).sort({ date: 1, time_slot: 1 });

        res.json({ success: true, appointments });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error fetching appointments' });
    }
});

// Add route to update appointment status
router.put('/appointments/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json({ success: true, appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating appointment' });
    }
});

// Get doctor's schedule
router.get('/schedule', auth, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ email: "doctor@gmail.com" });
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Send both schedule and bookedSlots
        res.json({
            success: true,
            schedule: doctor.schedule || {},
            bookedSlots: doctor.bookedSlots || {}
        });
    } catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching schedule'
        });
    }
});

// Save doctor's schedule
router.post('/schedule', auth, async (req, res) => {
    try {
        const { schedule } = req.body;
        console.log('Received schedule data:', schedule);

        // Find doctor by email (since we know it)
        const doctor = await Doctor.findOne({ email: "doctor@gmail.com" });

        if (!doctor) {
            console.log('Doctor not found');
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Update the schedule
        doctor.schedule = schedule;
        await doctor.save();

        console.log('Updated doctor schedule:', doctor.schedule);

        res.json({
            success: true,
            message: 'Schedule updated successfully',
            schedule: doctor.schedule
        });
    } catch (error) {
        console.error('Error saving schedule:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving schedule'
        });
    }
});

// Mark unavailability
router.post('/doctor/unavailable', auth, async (req, res) => {
    try {
        const { fromDate, toDate, reason } = req.body;
        await Doctor.findByIdAndUpdate(req.user.id, {
            $push: {
                unavailability: { fromDate, toDate, reason }
            }
        });
        
        res.json({
            success: true,
            message: 'Unavailability marked successfully'
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking unavailability'
        });
    }
});

module.exports = router;