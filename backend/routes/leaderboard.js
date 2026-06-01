const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// Get leaderboard with pagination
router.get('/', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;

    const leaderboard = await Score.find()
      .sort({ totalScore: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Score.countDocuments();

    res.json({
      leaderboard,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get top 10
router.get('/top10', async (req, res) => {
  try {
    const top10 = await Score.find()
      .sort({ totalScore: -1 })
      .limit(10);
    res.json(top10);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
