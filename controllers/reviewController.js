const Review = require('../models/Review');

exports.create = async (req, res) => {
  try {
    const { user, property, rating, comment } = req.body;

    // 🔒 Validate required fields
    if (!user) return res.status(400).json({ error: 'User ID is required' });
    if (!property) return res.status(400).json({ error: 'Property ID is required' });
    if (!rating && rating !== 0) return res.status(400).json({ error: 'Rating is required' });

    // Validate rating
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
    }

    // Validate comment if provided
    if (comment && (typeof comment !== 'string' || comment.length > 500)) {
      return res.status(400).json({ error: 'Comment must be under 500 characters' });
    }

    const review = new Review({ user, property, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllForProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    if (!propertyId) return res.status(400).json({ error: 'Property ID is required in URL' });

    const reviews = await Review.find({ property: propertyId }).populate('user');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
