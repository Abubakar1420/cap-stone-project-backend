const Favorite = require('../models/favorite');
const WatchList = require('../models/watchlist');
const User = require('../models/user');

const SaveToCategory = async (req, res) => {
  try {
    const { movieId, title, posterPath, releaseDate, voteAverage, category } = req.body;

    if (category === 'favorite') {
      const exists = await Favorite.findOne({ userId: req.user.id, movieId });
      if (exists) return res.status(400).json({ error: 'Movie already in favorites' });

      const favorite = new Favorite({
        userId: req.user.id,
        movieId,
        title,
        posterPath,
        releaseDate,
        voteAverage,
        category
      });
      await favorite.save();
      return res.status(201).json(favorite);
    }

    if (category === 'watchLater') {
      const exists = await WatchList.findOne({ userId: req.user.id, movieId });
      if (exists) return res.status(400).json({ error: 'Movie already in watch later' });

      const watchLater = new WatchList({
        userId: req.user.id,
        movieId,
        title,
        posterPath,
        releaseDate,
        voteAverage,
        category
      });
      await watchLater.save();
      return res.status(201).json(watchLater);
    }

    return res.status(400).json({ error: 'Invalid category' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save movie' });
  }
};

const getAllFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};
const getAllWatchList = async (req, res) => {
  try {
    const watchLater = await WatchList.find({ userId: req.user.id });
    res.json(watchLater);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch watch later movies' });
  }
}

const likedWatchList = async (req, res) => {
  const { liked, rating } = req.body;

  try {
    // 1. Update WatchList
    const updatedWatchList = await WatchList.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { ...(liked !== undefined && { liked }), ...(rating !== undefined && { rating }) } },
      { new: true }
    );

    if (!updatedWatchList) {
      return res.status(404).json({ error: "WatchLater movie not found" });
    }

    // 2. Sync to Favorite if movie exists there
    await Favorite.findOneAndUpdate(
      { userId: req.user.id, movieId: updatedWatchList.movieId },
      { $set: { ...(liked !== undefined && { liked }), ...(rating !== undefined && { rating }) } }
    );

    res.json(updatedWatchList);
  } catch (err) {
    console.error("Sync like/rating error:", err);
    res.status(500).json({ error: "Failed to update like/rating" });
  }
}

const likedFavorites = async (req, res) => {
  const { liked, rating } = req.body;

  try {
    // 1. Update Favorite
    const updatedFavorite = await Favorite.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { ...(liked !== undefined && { liked }), ...(rating !== undefined && { rating }) } },
      { new: true }
    );

    if (!updatedFavorite) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    // 2. Sync to WatchList if movie exists there
    await WatchList.findOneAndUpdate(
      { userId: req.user.id, movieId: updatedFavorite.movieId },
      { $set: { ...(liked !== undefined && { liked }), ...(rating !== undefined && { rating }) } }
    );

    res.json(updatedFavorite);
  } catch (err) {
    console.error("Sync like/rating error:", err);
    res.status(500).json({ error: "Failed to update like/rating" });
  }
};

const deleteFavorite = async (req, res) => {
  try {
    const deleted = await Favorite.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ error: 'Favorite not found' });
    res.json({ message: 'Favorite deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete favorite' });
  }
};

const deleteWatchList = async (req, res) => {
  try {
    const deleted = await WatchList.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ error: 'Watch later movie not found' });
    res.json({ message: 'Watch later movie deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete watch later movie' });
  }
}
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    res.json({
      id: user._id,
      username: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
}



module.exports = {SaveToCategory, getAllFavorites, getAllWatchList, likedWatchList, likedFavorites, deleteFavorite, deleteWatchList, getUserProfile, updateUserProfile };
