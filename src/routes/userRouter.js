const express = require('express');
const userController = require('../controllers/userController.js');
const { protect, restrictTo } = require('../controllers/authController.js');

const router = express.Router();

router.route('/').get(userController.getAllUsers);

router.route('/:id').get(userController.getUser);
router
  .route('/:id')
  .patch(protect, restrictTo('admin'), userController.updateUser);
router
  .route('/:id')
  .delete(protect, restrictTo('admin'), userController.deleteUser);

module.exports = router;
