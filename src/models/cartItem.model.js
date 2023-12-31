const mongoose = require('mongoose');

// Cart Item Schema
const cartItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Catalog'
    },
    quantity: {
      type: Number,
      default: 1
    }
  },
  {
    versionKey: false // Disable the versionKey (__v) field
  }
);

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;
