const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');

router.post('/', inquiryController.create);
router.get('/', inquiryController.getAll);
router.get('/:id', inquiryController.getById);
router.patch('/:id/status', inquiryController.updateStatus);
router.delete('/:id', inquiryController.delete);

module.exports = router;
