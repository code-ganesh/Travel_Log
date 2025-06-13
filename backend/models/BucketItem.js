// models/BucketItem.js (Example - verify your actual schema)
const mongoose = require('mongoose');

const BucketItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  placeName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  travelDate: {
    type: Date,
  },
  tags: [String], // Array of strings for tags
  completed: { // This should be a boolean
    type: Boolean,
    default: false,
  },
  notes: { // New field for diary entry
    type: String,
    trim: true,
  },
  images: { // New field for image URLs
    type: [String], // Array of strings to store image URLs
    default: [],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('BucketItem', BucketItemSchema);