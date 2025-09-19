// routes/offer.routes.js
const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offer.controller');

router.post('/', offerController.saveOffer);

module.exports = router;