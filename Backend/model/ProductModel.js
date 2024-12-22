// models/Product.js
import mongoose from 'mongoose';
const ProductModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ['New', 'Used'],
    default: 'Used',
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isSold: {
    type: Boolean,
    default: false,
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', ProductModel);
