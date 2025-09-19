// controllers/lead.controller.js
const fs = require('fs');
const csv = require('csv-parser');
const { Parser } = require('json2csv');
const Lead = require('../models/Lead');
const Offer = require('../models/Offer');
const { calculateRuleScore } = require('../services/scoring.service');
const { getAiIntent } = require('../services/ai.service');

exports.uploadLeads = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No CSV file uploaded.' });
    }

    try {
        // Clear previous leads for a clean slate on each upload
        await Lead.deleteMany({});

        const leads = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => leads.push(data))
            .on('end', async () => {
                await Lead.insertMany(leads);
                fs.unlinkSync(req.file.path); // Clean up uploaded file
                res.status(201).json({ message: `${leads.length} leads uploaded successfully. Ready for scoring.` });
            });
    } catch (error) {
        res.status(500).json({ message: 'Error processing CSV file.', error: error.message });
    }
};

exports.scoreLeads = async (req, res) => {
    try {
        const offer = await Offer.findOne({ active: true });
        if (!offer) {
            return res.status(400).json({ message: 'No active offer found. Please post an offer first.' });
        }

        const pendingLeads = await Lead.find({ status: 'pending' });
        if (pendingLeads.length === 0) {
            return res.status(200).json({ message: 'No pending leads to score.' });
        }
        
        // Process leads in parallel for efficiency
        const scoringPromises = pendingLeads.map(async (lead) => {
            const rule_score = calculateRuleScore(lead);
            const { intent, reasoning, ai_score } = await getAiIntent(lead, offer);
            
            lead.rule_score = rule_score;
            lead.ai_score = ai_score;
            lead.total_score = rule_score + ai_score;
            lead.intent = intent;
            lead.reasoning = reasoning;
            lead.status = 'scored';
            
            return lead.save();
        });

        await Promise.all(scoringPromises);

        res.status(200).json({ message: `${pendingLeads.length} leads scored successfully.` });
    } catch (error) {
        res.status(500).json({ message: 'Error during scoring process.', error: error.message });
    }
};

exports.getResults = async (req, res) => {
    try {
        const results = await Lead.find({ status: 'scored' })
            .select('name role company intent total_score reasoning -_id')
            .sort({ total_score: -1 });
        
        // Rename total_score to score for the output
        const formattedResults = results.map(r => ({
            name: r.name,
            role: r.role,
            company: r.company,
            intent: r.intent,
            score: r.total_score,
            reasoning: r.reasoning
        }));
            
        res.status(200).json(formattedResults);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results.', error: error.message });
    }
};

// Bonus: Export results as CSV
exports.exportResults = async (req, res) => {
    try {
        const results = await Lead.find({ status: 'scored' })
            .select('name role company intent total_score reasoning -_id')
            .sort({ total_score: -1 });

        if (results.length === 0) {
            return res.status(404).send('No scored leads to export.');
        }

        const fields = ['name', 'role', 'company', 'intent', 'total_score', 'reasoning'];
        const opts = { fields, header: true };
        const json2csvParser = new Parser(opts);
        const csv = json2csvParser.parse(results);

        res.header('Content-Type', 'text/csv');
        res.attachment('scored_leads.csv');
        res.status(200).send(csv);

    } catch (error) {
        res.status(500).json({ message: 'Error exporting results.', error: error.message });
    }
};