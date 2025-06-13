const express = require('express');
const router = express.Router();
const {
  getItinerary,
  getBestTime,
  getNearby
} = require('../controllers/aiController');

// POST /api/ai/itinerary
router.post('/itinerary', getItinerary);

// POST /api/ai/best-time
router.post('/best-time', getBestTime);

// POST /api/ai/nearby
router.post('/nearby', getNearby);

module.exports = router;
