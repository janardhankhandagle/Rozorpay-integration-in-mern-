const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// CORS setup: Allow requests from frontend (localhost:3000)
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

// Routes for payment
app.use('/api/payment', paymentRoutes);

// ✅ MongoDB connection setup
const DB_URI = process.env.DB_URI;
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
