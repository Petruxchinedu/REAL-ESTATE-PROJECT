const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Public or protected — your auth middleware can be added here
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.get('/agents', userController.getAllAgents);
router.put('/users/role', userController.updateUserRole);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
