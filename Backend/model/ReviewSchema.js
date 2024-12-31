import mongoose from "mongoose";

// Review Schema
const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    order_id: {
      type: String,
      required: true,
    },
    listing_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Rating between 1 and 5
    },
    review_message: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create the Review model
const ReviewSchema = mongoose.model("Review", reviewSchema);

export default ReviewSchema;
