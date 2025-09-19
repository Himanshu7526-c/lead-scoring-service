// routes/lead.routes.js
const express = require('express');
const multer = require('multer');
const router = express.Router();
const leadController = require('../controllers/lead.controller');

// Multer setup for CSV file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('leads_file'), leadController.uploadLeads);
router.post('/score', leadController.scoreLeads);
router.get('/results', leadController.getResults);
router.get('/results/export', leadController.exportResults); // Bonus endpoint

module.exports = router;