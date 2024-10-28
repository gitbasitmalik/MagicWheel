// models/UsersSchema.js
import mongoose from 'mongoose';

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
});

const UsersSchema = model('User', userSchema);

export default UsersSchema;