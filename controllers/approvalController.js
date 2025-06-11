const Approval = require('../models/Approval');

exports.create = async (req, res) => {
  try {
    const { property, status, moderatorNotes } = req.body;
    const approval = new Approval({ property, status, moderatorNotes });
    await approval.save();
    res.status(201).json(approval);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

exports.getAll = async (req, res) => {
  try {
    const approvals = await Approval.find().populate('property');
    res.json(approvals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const approval = await Approval.findById(req.params.id).populate('property');
    if (!approval) return res.status(404).json({ error: 'Approval not found' });
    res.json(approval);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const approval = await Approval.findById(req.params.id);
    if (!approval) return res.status(404).json({ error: 'Approval not found' });

    approval.status = req.body.status || approval.status;
    approval.moderatorNotes = req.body.moderatorNotes || approval.moderatorNotes;

    await approval.save();
    res.json(approval);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const approval = await Approval.findByIdAndDelete(req.params.id);
    if (!approval) return res.status(404).json({ error: 'Approval not found' });
    res.json({ message: 'Approval deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
