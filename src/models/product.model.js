const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    brand: { type: String },
    SKU: { type: String },
    weight: { type: Number },
    price: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number }
    },
    colors: { type: [String] },
    warranty: { type: String },
    tax: { type: Number, default: 0 } // Tax amount will be calculated and set before saving
  },
  {
    versionKey: false // Disable the versionKey (__v) field
  }
);

// Pre-save middleware to calculate and set the tax amount
productSchema.pre('save', function (next) {
  const { price } = this;

  if (price > 1000 && price <= 5000) {
    this.tax = price * 0.12; // Tax PA - 12% of the price
  } else if (price > 5000) {
    this.tax = price * 0.18; // Tax PB - 18% of the price
  } else {
    this.tax = 200; // Tax PC - Flat tax amount of 200
  }

  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
