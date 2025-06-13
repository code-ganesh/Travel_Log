const express = require('express');
const router = express.Router();
const {
  createBucketItem,
  getUserBucketItems,
  updateBucketItem,
  deleteBucketItem,
  getSingleItem,
  toggleCompletion,
} = require('../controllers/bucketController'); // Removed markVisited
const protect = require('../middleware/auth');

// Routes: routes/bucketRoutes.js
router.post('/', protect, createBucketItem); // Create a new bucket list item
router.get('/me', protect, getUserBucketItems); // Get all bucket list items for the authenticated user
router.get('/item/:id', protect, getSingleItem); // Get a single bucket list item by ID
router.put('/item/:id', protect, updateBucketItem); // Update a bucket list item (general update, including notes/images)
router.put('/item/:id/complete', protect, toggleCompletion); // Toggle completion status of an item
router.delete('/item/:id', protect, deleteBucketItem); // Delete a bucket list item

// NOTE: The '/item/:id/visit' route for 'markVisited' has been removed.
// Its functionality is now handled by the general 'updateBucketItem' for diary/images
// and 'toggleCompletion' for the 'completed' status.

module.exports = router;
