
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const dotenv = require('dotenv');
dotenv.config();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Please login' });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if(!decoded){
      return res.status(401).json({message:"Please login"})
    }
    const user = await User.findById(decoded.id).select('-password');;
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const authorizeAgent = (req, res, next) => {
  if (req.user.role !== 'agent') {
    return res.status(403).json({ message: 'Access denied: Agents only' });
  }
  next();
};

module.exports = { authenticateToken, authorizeAgent };
