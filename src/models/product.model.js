const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  SKU: { type: String, required: true },
  quantityInStock: { type: Number, default: 0 },
  weight: { type: Number },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  },
  colors: { type: [String] },
  warranty: { type: String }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
