const express = require('express');
const router = express.Router();
const savedController = require('../controllers/savedController');
const { authenticateToken } = require('../middlewares/authmiddleware');

router.post('/', authenticateToken, savedController.saveProperty);
router.get('/', authenticateToken, savedController.getSavedProperties);
router.delete('/', authenticateToken, savedController.unsaveProperty); 

module.exports = router;

