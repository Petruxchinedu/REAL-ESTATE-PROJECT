const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/', transactionController.create);
router.get('/', transactionController.getAll);

module.exports = router;
