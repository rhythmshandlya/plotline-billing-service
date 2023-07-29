const Cart = require('../models/cartModel');
const AppError = require('../util/AppError');
const catchAsync = require('../util/catchAsync');

// Get the user's cart
exports.getCart = catchAsync(async (req, res) => {
  // Check if the authenticated user is the same as the requested userId
  if (req.params.userId !== req.user._id.toString()) {
    throw new AppError('You are not authorized to view this cart', 403);
  }

  // Find the cart for the current user
  const cart = await Cart.findOne({ userId: req.user._id }).populate(
    'items.itemId'
  );

  res.json({ success: true, cart });
});

// Add a product or service to the cart
exports.addToCart = catchAsync(async (req, res) => {
  // Check if the authenticated user is the same as the requested userId
  if (req.params.userId !== req.user._id.toString()) {
    throw new AppError('You are not authorized to perform this action', 403);
  }

  // Extract item details from the request body
  const { itemId, itemType, name, price, quantity } = req.body;

  // Find the cart for the current user
  let cart = await Cart.findOne({ userId: req.user._id });

  // If the cart doesn't exist, create a new one
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id });
  }

  // Add the item to the cart
  cart.items.push({ itemId, itemType, name, price, quantity });
  await cart.save();

  res.json({ success: true, cart });
});

// Remove a product or service from the cart
exports.removeFromCart = catchAsync(async (req, res) => {
  // Check if the authenticated user is the same as the requested userId
  if (req.params.userId !== req.user._id.toString()) {
    throw new AppError('You are not authorized to perform this action', 403);
  }

  const itemId = req.params.itemId;

  // Find the cart for the current user
  const cart = await Cart.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { items: { itemId } } },
    { new: true }
  );

  res.json({ success: true, cart });
});

// Clear the cart
exports.clearCart = catchAsync(async (req, res) => {
  // Check if the authenticated user is the same as the requested userId
  if (req.params.userId !== req.user._id.toString()) {
    throw new AppError('You are not authorized to perform this action', 403);
  }

  // Find the cart for the current user and remove all items
  const cart = await Cart.findOneAndUpdate(
    { userId: req.user._id },
    { items: [] },
    { new: true }
  );

  res.json({ success: true, cart });
});
