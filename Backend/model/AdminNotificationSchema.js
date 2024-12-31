// models/product.model.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const notificationSchema = new Schema({
  message: { type: String, required: false },
  type: { type: String, required: false },
  bgIcon: { type: String, required: false },
  bgColor: { type: String, required: false },
  date: { type: Date, default: Date.now },

  read: { type: Boolean, default: false },
});

const NotificationSchema = model("AdminNotification", notificationSchema);

export default NotificationSchema;
