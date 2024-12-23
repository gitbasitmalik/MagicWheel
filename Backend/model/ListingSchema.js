import mongoose from "mongoose";

const { Schema, model } = mongoose;

const listingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  listing_uid: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  tags: { type: [String], maxItems: 5 },
  user_uuid: { type: String, required: true },
  user_name: { type: String, required: true },
  user_email: { type: String, required: true },
  user_profile_image: { type: String, required: true },
  is_deleted: { type: Boolean, default: false },
  images: [
    {
      url: { type: String, required: true },
      reference: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const ListingSchema = model("Listing", listingSchema);

export default ListingSchema;
