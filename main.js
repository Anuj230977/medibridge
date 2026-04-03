require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
const doctorRoutes = require('./routes/doctors');
const path = require('path');
const app = express();

// Enable CORS for development
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctor', doctorRoutes);

// Serve static frontend files
app.use(express.static('public'));

// Redirect root to login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});

const PORT = process.env.PORT || 5000;

// Update MongoDB URI to point to medibridge database
mongoose.connect('mongodb://localhost:27017/MediBridge', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('✅ Connected to MediBridge database');
    
    // Update doctor document to include schedule
    try {
        const result = await mongoose.connection.db.collection('doctor').updateOne(
            { email: "doctor@gmail.com" },
            { $set: { schedule: {}, bookedSlots: {} } }
        );
        console.log('Doctor update result:', result);
    } catch (error) {
        console.error('Error updating doctor:', error);
    }

    // Log the available collections
    mongoose.connection.db.listCollections().toArray((err, collections) => {
        if (err) {
            console.error('Error listing collections:', err);
        } else {
            console.log('📁 Available collections:', collections.map(c => c.name));
        }
    });
    
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => console.error('MongoDB connection error:', err));

require('./models/Doctor');