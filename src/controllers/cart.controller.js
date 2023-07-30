const Cart = require('../models/cart.model');
const AppError = require('../util/AppError');
const { catchAsync } = require('../util/catchAsync');
const CartItem = require('../models/cartItem.model');

exports.getCart = catchAsync(async (req, res) => {
  // Check if the authenticated user is the same as the requested userId
  if (req.params.userId !== req.user._id.toString()) {
    throw new AppError('You are not authorized to view this cart', 403);
  }

  const itemType = 'Service';
  // Find the cart for the current user and populate the 'items' array
  const cart = await Cart.findOne({ userId: req.user._id }).populate({
    path: 'items',
    populate: {
      path: 'item'
    }
  });

  res.json({ success: true, cart });
});

exports.addToCart = catchAsync(async (req, res) => {
  // Check if the authenticated user is the same as the requested userId
  if (req.params.userId !== req.user._id.toString()) {
    throw new AppError('You are not authorized to perform this action', 403);
  }

  // Extract item details from the request body
  const { itemId } = req.body;
  if (!itemId) throw new AppError('Item ID is required', 400);

  // Find the cart for the current user
  let cart = await Cart.findOne({ userId: req.user._id }).populate('items');

  // If the cart doesn't exist, create a new one
  if (!cart) {
    cart = await Cart.create({ userId: req.user._id });
  }

  // Check if the item already exists in the cart
  const existingCartItem = cart.items.find((item) => item.item.equals(itemId));

  let newCartItem;
  if (existingCartItem) {
    // If the item exists, update its quantity using findOneAndUpdate
    newCartItem = await CartItem.findOneAndUpdate(
      { item: itemId }, // Find the existing cart item by its ID
      { $inc: { quantity: 1 } }, // Increment the quantity by 1
      { new: true } // Return the updated cart item
    );
  } else {
    // If the item does not exist, create a new cartItem document and add its reference to the cart
    newCartItem = await CartItem.create({ item: itemId, quantity: 1 });
    cart.items.push(newCartItem._id);
    await cart.save();
  }

  res.json({ success: true, cartItem: newCartItem });
});

exports.removeFromCart = catchAsync(async (req, res) => {
  // Check if the authenticated user is the same as the requested userId
  if (req.params.userId !== req.user._id.toString()) {
    throw new AppError('You are not authorized to perform this action', 403);
  }
  const itemId = req.params.itemId;

  // Find the cart for the current user
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items');

  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  // Find the cart item with the specified itemId
  const cartItem = cart.items.find((item) => item.item.toString() === itemId);

  if (!cartItem) {
    throw new AppError('Item not found in the cart', 404);
  }

  // Decrement the quantity of the cart item
  cartItem.quantity--;

  // Remove the cart item if the quantity becomes 0
  if (cartItem.quantity <= 0) {
    cart.items = cart.items.filter((item) => item.item.toString() !== itemId);
  }

  await cart.save();

  res.json({ success: true, cart });
});

exports.clearCart = catchAsync(async (req, res) => {
  // Check if the authenticated user is the same as the requested userId
  if (req.params.userId !== req.user._id.toString()) {
    throw new AppError('You are not authorized to perform this action', 403);
  }

  // Find the cart for the current user
  const cart = await Cart.findOne({ userId: req.user._id });

  // If the cart doesn't exist or is already empty, there's nothing to clear
  if (!cart || cart.items.length === 0) {
    return res.json({ success: true, cart });
  }

  // Remove the corresponding CartItem documents for the items in the cart
  await CartItem.deleteMany({ _id: { $in: cart.items } });

  // Clear the items in the cart
  cart.items = [];
  await cart.save();

  res.json({ success: true, cart });
});
