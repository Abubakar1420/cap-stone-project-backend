const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { SaveToCategory, getAllFavorites, getAllWatchList, likedWatchList, likedFavorites, deleteFavorite, deleteWatchList, getUserProfile, updateUserProfile } = require('../controllers/userController');

// POST: Save movie to category
router.post('/', authMiddleware, SaveToCategory);

// GET: All favorite movies
router.get('/', authMiddleware, getAllFavorites);

// GET: All watch later movies
router.get('/watchLater', authMiddleware, getAllWatchList);


// PUT: Like/Rate WatchLater AND sync with Favorites
router.put('/watchLater/:id/like', authMiddleware, likedWatchList);


// PUT: Like/Rate a Favorite movie AND sync with WatchList
router.put('/:id/like', authMiddleware, likedFavorites);


// DELETE: Remove a favorite movie
router.delete('/:id', authMiddleware, deleteFavorite);

// DELETE: Remove a movie from watch later
router.delete('/watchLater/:id', authMiddleware, deleteWatchList);

// GET: User profile
router.get('/profile', authMiddleware, getUserProfile);

// PUT: Update user profile
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router;
