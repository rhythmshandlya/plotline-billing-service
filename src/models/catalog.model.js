const mongoose = require('mongoose');

// Catalog Schema
const catalogSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'itemType'
    },
    itemType: {
      type: String,
      enum: ['Product', 'Service'],
      required: true
    },
    name: { type: String, required: true },
    description: { type: String },
    category: {
      type: [String],
      default: function () {
        return [this.itemType === 'Product' ? 'Product' : 'Service'];
      }
    }
  },
  {
    versionKey: false // Disable the versionKey (__v) field
  }
);

const Catalog = mongoose.model('Catalog', catalogSchema);

module.exports = Catalog;
