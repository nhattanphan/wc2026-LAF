const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  predictions: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prediction'
  },
  totalScore: {
    type: Number,
    default: 0
  },
  breakdown: [{
    nationName: String,
    nationRank: Number,
    matchesPlayed: Number,
    wins: Number,
    draws: Number,
    losses: Number,
    points: Number
  }],
  rank: Number,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Score', scoreSchema);
