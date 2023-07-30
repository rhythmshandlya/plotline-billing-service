const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/auth.controller');
const cartController = require('../controllers/cart.controller.js');

router.get('/:userId', protect, cartController.getCart);

// Add a product or service to the cart
router.post('/:userId', protect, cartController.addToCart);

// Remove a product or service from the cart
router.delete('/:userId/:itemId', protect, cartController.removeFromCart);

// Clear the cart
router.delete('/:userId', protect, cartController.clearCart);

module.exports = router;
