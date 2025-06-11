const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/', notificationController.create);
router.get('/user/:userId', notificationController.getAll);
router.patch('/:id/read', notificationController.markRead);

module.exports = router;
