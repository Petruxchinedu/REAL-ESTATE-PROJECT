const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { validEmail } = require('../validEmail');
const nodemailer = require('nodemailer');
dotenv.config(); 

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password )
      return res.status(400).json({ message: 'All fields are required' });
     if(!validEmail(email)){
      return res.status(400).json({ message: 'Invalid email format' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    if(password.length < 6)
                return res.status(400).json({msg: "Password must be at least 6 characters."})
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed, role });
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      message: 'Registered successfully',
      accessToken,
      refreshToken,
      user: { id: user?._id, username, email, role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'This email does not exist."' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Password is incorrect' });
      // const refresh_token = createRefreshToken({ id: user._id });
      // res.cookie('refreshtoken', refresh_token, {
      //   httpOnly: true,
      //   path: '/user/refresh_token',
      //   maxAge: 7 * 24 * 60 * 60 * 1000
      // });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: { id: user?._id, username: user?.username, email, role: user?.role }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if(!payload){
       return res.status(401).json({ message: 'please login' });
    }
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: 'Invalid refresh token' });

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP and expiration time
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now

    // Save to user model
    user.resetOtp = otp;
    user.resetOtpExpires = otpExpires;
    user.isOtpVerified = false;
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: 'Your OTP Code',
      html: `<p>Use this code to reset your password: <strong>${otp}</strong></p>`,
    });

    console.log('OTP Saved:', user.resetOtp);
    console.log('Expires:', user.resetOtpExpires.toISOString());

    res.status(200).json({ message: 'OTP sent to email' });

  } catch (err) {
    console.error('Error in forgotPassword:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP exists and is not expired
    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ message: 'No OTP request found. Please request a new OTP.' });
    }

    const now = new Date();

    if (
      String(user.resetOtp) !== String(otp) ||
      now > new Date(user.resetOtpExpires)
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark as verified
    user.isOtpVerified = true;
    await user.save();

    res.status(200).json({ message: 'OTP verified. Proceed to reset password.' });

  } catch (err) {
    console.error('Error in verifyOtp:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  try{
    const user = await User.findOne({email});

  if (!user || !user.isOtpVerified) return res.status(400).json({ message: 'OTP not verified' });
  if(newPassword !== confirmPassword){
    return res.status(400).json({ message: 'Passwords do not match' });
  }

    const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.resetOtpExpires = undefined;
  user.isOtpVerified = false;

  await user.save();
  res.json({ message: 'Password reset successful' });
} catch (err){
    console.error(err);
    res.status(500).json({message: 'Server error'})
  }
};

exports.logout = async (req, res) => {
  try {
    const user = req.user;
    user.refreshToken = null;
    await user.save();
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed' });
  }
};
