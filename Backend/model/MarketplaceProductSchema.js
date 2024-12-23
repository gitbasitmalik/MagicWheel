// models/Product.js
import mongoose from "mongoose";
const MarketplaceProductSchema = new mongoose.Schema({
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
});

const MarketplaceProduct = mongoose.model(
  "MarketplaceProduct",
  MarketplaceProductSchema
);

export default MarketplaceProduct;


