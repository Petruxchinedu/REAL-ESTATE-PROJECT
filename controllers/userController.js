const User = require('../models/userModel');

// GET /api/users - get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshToken');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// GET /api/agents - get all agents
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password -refreshToken');
    res.status(200).json({ agents });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch agents', error: error.message });
  }
};

// PUT /api/users/role - update user role
exports.updateUserRole = async (req, res) => {
  const { id, role } = req.body;

  if (!['user', 'agent', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: `User role updated to ${role}`, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update role', error: error.message });
  }
};

// DELETE /api/users/:id - delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

// GET /api/users/:id - get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};
