const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');

router.post('/', approvalController.create);
router.get('/', approvalController.getAll);
router.patch('/:id/status', approvalController.updateStatus);

module.exports = router;
