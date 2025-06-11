const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default:"user"},
  refreshToken: { type: String },
  resetOtp: String,
resetOtpExpires: Date,
isOtpVerified: {
  type: Boolean,
  default: false,
},

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

