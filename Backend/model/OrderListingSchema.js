// models/OrderSchema.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;
const orderSchema = new Schema({
  customer: {
    type: String,
    required: false,
  },
  order_uuid: { type: String, required: true },
  buyer_uuid: { type: String, required: true },
  seller_uuid: { type: String, required: true },
  listing_uid: { type: String, required: true },

  name: {
    type: String,
    required: true,
    min: 1,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "PKR",
  },
  shippingAddress: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  paymentDetails: {
    paymentMethod: { type: String, required: false },
    status: { type: String, default: "pending" },
  },
  orderStatus: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  courierName: {
    type: String,
    required: false,
  },
  trackingId: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  has_shipped: { type: Boolean, default: false },
  review_submitted: { type: Boolean, default: false },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const OrderListingSchema = model("OrderListing", orderSchema);

export default OrderListingSchema;
