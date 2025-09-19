// controllers/offer.controller.js
const Offer = require('../models/Offer');

exports.saveOffer = async (req, res) => {
    try {
        const { name, value_props, ideal_use_cases } = req.body;
        if (!name || !value_props || !ideal_use_cases) {
            return res.status(400).json({ message: "Missing required offer fields." });
        }

        // Use findOneAndUpdate with upsert to create or replace the single active offer
        const offer = await Offer.findOneAndUpdate(
            { active: true },
            { name, value_props, ideal_use_cases, active: true },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(201).json({ message: 'Offer saved successfully.', offer });
    } catch (error) {
        res.status(500).json({ message: 'Error saving offer.', error: error.message });
    }
};  ``