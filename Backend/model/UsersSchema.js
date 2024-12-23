import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  orders: { type: Array, required: false },
  cart_items: { type: Array, required: false },
  wishlist: { type: Array, required: false },
  profile_img: { type: String, required: true },
  uid: { type: String, required: true },
  shipping_info: {
    fullName: { type: String, required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    phone: { type: String, required: false },
    postalCode: { type: String, required: false },
  },
  has_shipping_info: { type: Boolean, default: false },
  card_info: {
    cardNumber: { type: String, required: false },
    cardHolderName: { type: String, required: false },
    expiryDate: { type: String, required: false },
    cvv: { type: String, required: false },
  },
  has_card_info: { type: Boolean, default: false },
  notifications: [
    {
      message: { type: String, required: false },
      date: { type: Date, default: Date.now },
      read: { type: Boolean, default: false },
    },
  ],
});

const UsersSchema = model("User", userSchema);

export default UsersSchema;


