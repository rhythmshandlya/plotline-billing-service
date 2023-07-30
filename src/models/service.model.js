const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  duration: { type: Number, required: true },
  serviceProvider: { type: String, required: true },
  price: { type: Number, default: 0 },
  serviceLocation: { type: String },
  availableTimeSlots: { type: [String] },
  serviceAddOns: { type: [String] },
  tax: { type: Number, default: 0 } // Tax amount will be calculated and set before saving
});

// Pre-save middleware to calculate and set the tax amount for services
serviceSchema.pre('save', function (next) {
  const { price } = this;

  if (price > 1000 && price <= 8000) {
    this.tax = price * 0.1; // Tax SA - 10% of the price
  } else if (price > 8000) {
    this.tax = price * 0.15; // Tax SB - 15% of the price
  } else {
    this.tax = 100; // Tax SC - Flat tax amount of 100
  }

  next();
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
