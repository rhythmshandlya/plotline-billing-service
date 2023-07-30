const mongoose = require('mongoose');

// Cart Schema
const cartSchema = new mongoose.Schema(
  {
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
    ],
    price: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  {
    versionKey: false // Disable the versionKey (__v) field
  }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
