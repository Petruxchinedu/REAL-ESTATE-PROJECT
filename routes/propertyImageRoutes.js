const express = require('express');
const router = express.Router();
const propertyImageController = require('../controllers/propertyImageController');

router.post('/', propertyImageController.create);
router.get('/property/:propertyId', propertyImageController.getAllForProperty);
router.delete('/:id', propertyImageController.delete);

module.exports = router;
