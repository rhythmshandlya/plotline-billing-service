const mongoose = require('mongoose');

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the 'Product' model
    required: true
  },
  itemType: { type: String, enum: ['product', 'service'], required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 }
});

// Cart Schema
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the 'User' model
    required: true,
    unique: true
  },
  items: { type: [cartItemSchema], default: [] }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
