// models/Lead.js
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, default: '' },
    company: { type: String, default: '' },
    industry: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin_bio: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'scored'], default: 'pending' },
    rule_score: { type: Number, default: 0 },
    ai_score: { type: Number, default: 0 },
    total_score: { type: Number, default: 0 },
    intent: { type: String, enum: ['High', 'Medium', 'Low', ''], default: '' },
    reasoning: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);