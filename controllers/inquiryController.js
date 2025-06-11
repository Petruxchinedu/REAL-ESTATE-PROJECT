const Inquiry = require('../models/Inquiry');

// Create Inquiry
exports.create = async (req, res) => {
  try {
    const { user, property, message, status } = req.body;

    if (!user || !property || !message) {
      return res.status(400).json({ error: 'User, property, and message are required.' });
    }

    const inquiry = new Inquiry({ user, property, message, status });
    await inquiry.save();
    res.status(201).json(inquiry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Inquiries
exports.getAll = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().populate('user property');
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Inquiry By ID
exports.getById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate('user property');
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Inquiry Status
exports.updateStatus = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });

    inquiry.status = req.body.status || inquiry.status;
    await inquiry.save();
    res.json(inquiry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Inquiry
exports.delete = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found' });
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
