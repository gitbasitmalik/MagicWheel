import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new mongoose.Schema({
  product_id: { type: String, required: true },
  comment_id: { type: String, required: true },
  user_uuid: { type: String, required: true },
  user_name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ReviewSchema = model("Review", reviewSchema);

export default ReviewSchema;
