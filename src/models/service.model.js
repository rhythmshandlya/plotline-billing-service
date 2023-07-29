const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  duration: { type: Number, required: true },
  serviceProvider: { type: String, required: true },
  serviceLocation: { type: String },
  availableTimeSlots: { type: [String] },
  serviceAddOns: { type: [String] }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
