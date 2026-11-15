const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Prize name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['physical', 'digital'],
      required: true,
    },
    retailValue: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    image: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: '', // e.g. "1st Prize", "2nd Prize", "3rd Prize", "Lucky Draw"
    },
    shortDescription: {
      type: String,
      required: true,
    },
    specifications: [
      {
        label: String,
        value: String,
      },
    ],
    stockQuantity: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Prize', prizeSchema);

