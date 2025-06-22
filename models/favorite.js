const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: String, required: true },
  title: String,
  posterPath: String,
  releaseDate: String,
  voteAverage: Number,
  liked: { type: Boolean, default: false },        // ✅ New field for like status
  rating: { type: Number, min: 1, max: 10 },        // ✅ New field for user rating
  category: {
    type: String,
    enum: ['favorite', 'watchLater', 'watched'],
    default: 'favorite'
  },
});

module.exports = mongoose.model('Favorite', favoriteSchema);
