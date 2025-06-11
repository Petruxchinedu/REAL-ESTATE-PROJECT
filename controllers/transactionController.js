const Transaction = require('../models/Transaction');

exports.create = async (req, res) => {
  try {
    const { user, property, amount, paymentMethod, status } = req.body;

    // Validate required fields
    if (!user) return res.status(400).json({ error: 'User ID is required' });
    if (!property) return res.status(400).json({ error: 'Property ID is required' });
    if (amount === undefined || amount === null) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    //  Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    // Validate payment method
    const allowedMethods = ['card', 'bank_transfer', 'ussd', 'cash'];
    if (!paymentMethod || !allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({ error: `Payment method must be one of: ${allowedMethods.join(', ')}` });
    }

    // 📦 Optional: Validate status if provided
    const allowedStatuses = ['pending', 'completed', 'failed'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${allowedStatuses.join(', ')}` });
    }

    const transaction = new Transaction({ user, property, amount, paymentMethod, status });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('user property');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
