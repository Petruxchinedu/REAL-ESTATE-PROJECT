const SavedProperty = require('../models/savedModel');
const Property = require('../models/propertyModel');

exports.saveProperty = async (req, res) => {
  try {
    const { propertyId } = req.body;
    if (!propertyId) return res.status(400).json({ message: 'propertyId required' });

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const existing = await SavedProperty.findOne({ user: req.user._id, property: propertyId });
    if (existing) return res.status(400).json({ message: 'Property already saved' });

    const savedProperty = new SavedProperty({
      user: req.user._id,
      property: propertyId
    });

    await savedProperty.save();
    res.json({ message: 'Property saved' });
  } catch (error) {
    res.status(500).json({ message: 'Save failed', error: error.message });
  }
};

exports.getSavedProperties = async (req, res) => {
  try {
    const savedProperties = await SavedProperty.find({ user: req.user._id })
      .populate({
        path: 'property',
        populate: { path: 'agent', select: 'username email' }
      });

    res.json(savedProperties.map(sp => sp.property));
  } catch (error) {
    res.status(500).json({ message: 'Fetch saved properties failed', error: error.message });
  }
};
exports.unsaveProperty = async (req, res) => {
  try {
    const { propertyId } = req.body;
    if (!propertyId) return res.status(400).json({ message: 'propertyId required' });

    const deleted = await SavedProperty.findOneAndDelete({ user: req.user._id, property: propertyId });
    if (!deleted) return res.status(404).json({ message: 'Saved property not found' });

    res.json({ message: 'Property unsaved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Unsave failed', error: error.message });
  }
};
