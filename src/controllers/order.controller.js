const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const CartItem = require('../models/cartItem.model');
const AppError = require('../util/AppError');
const { catchAsync } = require('../util/catchAsync');

// Create a new order
exports.createOrder = catchAsync(async (req, res, next) => {
  // Find the user's cart
  const cart = await Cart.findOne({ userId: req.user._id }).populate({
    path: 'items',
    populate: {
      path: 'item'
    }
  });

  // If the cart doesn't exist or is empty, return an error
  if (!cart || cart.items.length === 0) {
    return next(
      new AppError(
        'Your cart is empty. Add items to your cart before placing an order.',
        400
      )
    );
  }

  // Extract items and total from the cart
  const { items, total = cart.total } = cart;

  // Create the order using the cart items
  const newOrder = await Order.create({
    user: req.user._id,
    items,
    total
  });

  // Remove the corresponding CartItem documents for the items in the cart
  await CartItem.deleteMany({ _id: { $in: cart.items } });

  // Clear the items in the cart
  cart.items = [];
  await cart.save();

  res.status(201).json({
    status: 'success',
    order: newOrder
  });
});

// View all orders for the authenticated user or all orders for admin
exports.getAllOrders = catchAsync(async (req, res, next) => {
  // Check if the authenticated user is an admin
  if (req.user.role === 'admin') {
    // If user is an admin, retrieve all orders from the database
    const orders = await Order.find();
    res.status(200).json({
      status: 'success',
      orders
    });
  } else {
    // If user is not an admin, retrieve orders for the authenticated user
    const userId = req.user._id;
    const orders = await Order.find({ user: userId });
    res.status(200).json({
      status: 'success',
      orders
    });
  }
});

// View details of a specific order
exports.getOrder = catchAsync(async (req, res, next) => {
  const orderId = req.params.orderId;

  // Find the order by its ID
  const order = await Order.findById({ user: req.user._id, _id: orderId });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  res.status(200).json({
    status: 'success',
    order
  });
});

// Cancel an order
exports.cancelOrder = catchAsync(async (req, res, next) => {
  const orderId = req.params.orderId;

  // Find the order by its ID
  const order = await Order.findById(orderId);

  if (!order) {
    return next(new AppError(404, 'Order not found'));
  }

  // Check if the order is already cancelled
  if (order.status === 'cancelled') {
    return next(new AppError('Order is already cancelled', 400));
  }

  // Update the status of the order to 'cancelled'
  order.status = 'cancelled';
  await order.save();

  res.status(200).json({
    status: 'success',
    message: 'Order has been cancelled successfully',
    order
  });
});
