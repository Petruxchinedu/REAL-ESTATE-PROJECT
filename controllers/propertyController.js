const Property = require('../models/propertyModel');

exports.createProperty = async (req, res) => {
  try {
    const { title, location, price } = req.body;
    if (!title || !location || price == null)
      return res.status(400).json({ message: 'All fields required' });

    if (price < 0) return res.status(400).json({ message: 'Price must be positive' });

    const property = new Property({
      title,
      location,
      price,
      agent: req.user._id
    });

    await property.save();
    res.status(201).json({ message: 'Property listed', property });
  } catch (error) {
    res.status(500).json({ message: 'Create failed', error: error.message });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('agent', 'username email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Fetch failed', error: error.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('agent', 'username email');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Fetch failed', error: error.message });
  }
};
exports.updateUserRole = async (req, res) => {
  try {
    const { id, role } = req.body;

    if (!['user', 'admin', 'agent'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role type.' });
    }

    await Users.findByIdAndUpdate(id, { role });

    res.status(200).json({ msg: `User role updated to '${role}'.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
}
