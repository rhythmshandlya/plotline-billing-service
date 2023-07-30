const mongoose = require('mongoose');

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the 'User' model
    required: true,
    unique: true
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CartItem', // Reference to the 'CartItem' model
      default: []
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
