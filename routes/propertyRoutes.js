const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { authenticateToken, authorizeAgent } = require('../middlewares/authmiddleware');

router.post('/', authenticateToken, authorizeAgent, propertyController.createProperty);
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);

module.exports = router;
