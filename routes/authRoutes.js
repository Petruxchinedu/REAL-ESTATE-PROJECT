const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authmiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/verifyOtp', authController.verifyOtp);
router.post('/resetPassword', authController.resetPassword);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
