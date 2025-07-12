const PropertyImage = require('../models/PropertyImage');
const Property = require('../models/propertyModel');

exports.uploadImage = async (req, res) => {
  try {
    const { property, caption } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const imageUrl = `/uploads/${req.file.filename}`;

    const newImage = new PropertyImage({ property, imageUrl, caption });
    await newImage.save();

    const prop = await Property.findById(property);
    if (prop && !prop.coverImage) {
      prop.coverImage = imageUrl;
      await prop.save();
    }

    res.status(201).json({ message: "Image uploaded", imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllForProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const images = await PropertyImage.find({ property: propertyId });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const image = await PropertyImage.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
