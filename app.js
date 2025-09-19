
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const offerRoutes = require('./routes/offer.routes');
const leadRoutes = require('./routes/lead.routes');
const connectDB = require('./config/db.connect');
 

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection

// API Routes
app.get('/', (req, res) => {
    res.send('Lead Scoring API is running...');
});
app.use('/api/offer', offerRoutes);
app.use('/api/leads', leadRoutes);

// Global Error Handler (Simple)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});