const PropertyImage = require('../models/PropertyImage');
const Property = require('../models/propertyModel');

exports.create = async (req, res) => {
  try {
    const { property, imageUrl, caption } = req.body;

    if (!property || !imageUrl) {
      return res.status(400).json({ error: 'Property and image URL are required.' });
    }

    // 1. Save image to PropertyImage model
    const propertyImage = new PropertyImage({ property, imageUrl, caption });
    await propertyImage.save();

    // 2. Check if property already has a coverImage
    const prop = await Property.findById(property);

    if (prop && !prop.coverImage) {
      // 3. Set the first image as the coverImage
      prop.coverImage = imageUrl;
      await prop.save();
    }

    res.status(201).json({
      message: 'Image uploaded',
      image: propertyImage,
      coverImageUpdated: !prop.coverImage ? imageUrl : undefined
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Images for a Property
exports.getAllForProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const images = await PropertyImage.find({ property: propertyId });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Property Image
exports.delete = async (req, res) => {
  try {
    const image = await PropertyImage.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
