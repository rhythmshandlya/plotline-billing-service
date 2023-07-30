const Cart = require('../models/cart.model');
const AppError = require('../util/AppError');
const { catchAsync } = require('../util/catchAsync');
const CartItem = require('../models/cartItem.model');

exports.getCart = catchAsync(async (req, res) => {
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
  // Extract item details from the request body
  const { itemId } = req.params;
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
  const itemId = req.params.itemId;

  // Find the cart for the current user
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items');

  if (
    !cart.items.find((item) => {
      return item.item == itemId;
    })
  ) {
    throw new AppError('Cart has no such item', 404);
  }

  // Decrement the quantity of the cart item in the database
  let newCartItem = await CartItem.findOneAndUpdate(
    { item: itemId },
    { $inc: { quantity: -1 } },
    { new: true }
  );

  console.log(newCartItem);

  // Remove the cart item from the cart if the quantity becomes 0
  if (newCartItem.quantity <= 0) {
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { $pull: { items: { item: itemId } } },
      { new: true }
    );
    await CartItem.findOneAndDelete({ item: itemId });
  }

  res.json({ success: true, cartItem: newCartItem });
});

exports.clearCart = catchAsync(async (req, res) => {
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
