const express = require('express');
const orderController = require('../controllers/order.controller.js');
const { protect, restrictTo } = require('../controllers/auth.controller');

const router = express.Router();

// Route to create a new order
router.post('/', protect, orderController.createOrder);

// Route to view all orders for the authenticated user
// If user is admin, view all orders
router.get('/', protect, orderController.getAllOrders);

// Route to view details of a specific order
router.get('/:orderId', protect, orderController.getOrder);

// Route to cancel an order
router.patch('/:orderId/cancel', protect, orderController.cancelOrder);

module.exports = router;
