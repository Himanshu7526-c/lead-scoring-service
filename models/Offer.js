// models/Offer.js
const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value_props: { type: [String], required: true },
    ideal_use_cases: { type: [String], required: true },
    // For simplicity, we'll store the active offer with a unique key
    active: { type: Boolean, default: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);