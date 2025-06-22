const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: String, required: true },
  title: String,
  posterPath: String,
  releaseDate: String,
  voteAverage: Number,
  category: {
    type: String,
    enum: ['favorite', 'watchLater', 'watched'],
    default: 'watchLater'
  },
  liked: { type: Boolean, default: false },
  rating: { type: Number, min: 1, max: 10 }
});

watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('WatchList', watchlistSchema);
