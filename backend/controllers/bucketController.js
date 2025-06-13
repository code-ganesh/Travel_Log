const BucketItem = require('../models/BucketItem');

// Create
exports.createBucketItem = async (req, res) => {
  try {
    const newItem = await BucketItem.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read all items for a user
exports.getUserBucketItems = async (req, res) => {
  try {
    const items = await BucketItem.find({ userId: req.user._id });
    res.json(items);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read a single item
exports.getSingleItem = async (req, res) => {
  try {
    const item = await BucketItem.findById(req.params.id);
    // Ensure item exists and belongs to the authenticated user
    if (!item || item.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }
    res.json(item);
  } catch (err) {
    // Handle invalid ID format
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid item ID format' });
    }
    res.status(500).json({ error: err.message });
  }
};

// Update an item (general purpose, including notes and images)
exports.updateBucketItem = async (req, res) => {
  try {
    const item = await BucketItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Ensure user is authorized to update this item
    if (!item.userId.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to update this item' });
    }

    // FindByIdAndUpdate will apply all fields present in req.body
    // This allows updating placeName, description, travelDate, tags, notes, images etc.
    const updated = await BucketItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // runValidators ensures schema validations are run on update
    );
    res.json(updated);
  } catch (err) {
    // Handle validation errors or other update errors
    res.status(400).json({ error: err.message });
  }
};

// Toggle item completion status
exports.toggleCompletion = async (req, res) => {
  try {
    const { completed } = req.body;
    const updatedItem = await BucketItem.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true, runValidators: false } // <- turn off full validation
    );

    if (!updatedItem || updatedItem.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Item not found or unauthorized' });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an item
exports.deleteBucketItem = async (req, res) => {
  try {
    const item = await BucketItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    // Ensure user is authorized to delete this item
    if (!item.userId.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized to delete this item' });
    }

    await BucketItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    // Handle invalid ID format or other delete errors
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid item ID format' });
    }
    res.status(500).json({ error: err.message });
  }
};

// NOTE: The 'markVisited' function has been removed as its functionality
// is now covered by 'updateBucketItem' (for diary/images) and 'toggleCompletion' (for status).
