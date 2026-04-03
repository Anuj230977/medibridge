const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const auth = require('../middleware/auth'); 

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, dob, gender, address } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success:false, message: 'Missing fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success:false, message: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role,
      phone,
      dob,
      gender,
      address
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        console.log('Login attempt:', { email, role }); // Debug log

        let user;
        if (role === 'doctor') {
            user = await mongoose.connection.db.collection('doctor').findOne({ email });
        } else {
            user = await User.findOne({ email, role: 'patient' });
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Credentials. Try Again.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Credentials. Try Again.'
            });
        }

        const token = jwt.sign(
            { id: user._id, role: role },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get user profile
router.get('/profile/:userId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update profile
router.post('/profile/update/:userId', auth, async (req, res) => {
    try {
        const { name, phone, dob, address } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: { name, phone, dob, address } },
            { new: true }
        ).select('-password');

        res.json({ success: true, user });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update password
router.post('/password/update/:userId', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.params.userId);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
