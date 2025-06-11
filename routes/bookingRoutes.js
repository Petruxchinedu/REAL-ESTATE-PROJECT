const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.create);
router.get('/', bookingController.getAll);
router.get('/:id', bookingController.getById);
router.patch('/:id/status', bookingController.updateStatus);
router.delete('/:id', bookingController.delete);

module.exports = router;
