const express = require('express');
const userController = require('../controllers/userController.js');

const router = express.Router();

router.route('/').get(userController.getAllUsers);

router.route('/:id').get(userController.getUser);
router.route('/:id').patch(userController.updateUser);
router.route('/:id').delete(userController.deleteUser);

module.exports = router;
