// controllers/productController.js
import ListingSchema from "../model/ListingSchema.js";
import MarketplaceProduct from "../model/MarketplaceProductSchema.js";
import OrderListingSchema from "../model/OrderListingSchema.js";
import OrderSchema from "../model/OrderSchema.js";
import ProductSchema from "../model/ProductSchema.js";
import UsersSchema from "../model/UsersSchema.js";
import { v4 as uuid } from "uuid";
// Get all listings
export const getListings = async (req, res) => {
  try {
    // Fetch all listings
    const listings = await ListingSchema.find();

    // Handle if no listings are found
    if (!listings || listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No listings found",
      });
    }

    // Return listings
    res.status(200).json({
      success: true,
      listings: listings.map((listing) => ({
        id: listing.id,
        name: listing.name,
        description: listing.description,
        listing_uid: listing.listing_uid,
        price: listing.price,
        quantity: listing.quantity,
        category: listing.category,
        tags: listing.tags,
        user_uuid: listing.user_uuid,
        user_name: listing.user_name,
        user_email: listing.user_email,
        user_profile_image: listing.user_profile_image,
        images: listing.images,
        reviews: listing.reviews || [],
        createdAt: listing.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch listings",
      error,
    });
  }
};

// Create a new listing
export const addListing = async (req, res) => {
  try {
    const { user_uuid, ...listingData } = req.body;

    // Find the user based on the provided user_uuid
    const user = await UsersSchema.findOne({ uid: user_uuid });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Add user details to the listing
    const listing = new ListingSchema({
      ...listingData,
      listing_uid: uuid(),
      user_uuid: user.uid,
      user_name: user.name,
      user_email: user.email,
      user_profile_image: user.profile_img,
    });

    // Save the listing
    await listing.save();

    res.status(201).json({ success: true, listing });
  } catch (error) {
    console.error("Error adding listing:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create listing", error });
  }
};

// Update a listing
export const updateListing = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const product = await MarketplaceProduct.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a listing
export const deleteListing = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await MarketplaceProduct.findByIdAndDelete(id);
    res.status(200).json({ message: "Listing deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserListingsController = async (req, res) => {
  const { id } = req.params; // Get the user ID from the request params
  console.log(id);
  try {
    const user = await UsersSchema.findOne({ uid: id });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Use the id parameter to find listings for the user
    const listings = await ListingSchema.find({ user_uuid: id }); // Corrected variable to `id`
    const orders = await OrderSchema.find({ user_uuid: id });
    const listingsOrders = await OrderListingSchema.find({ buyer_uuid: id });
    console.log(listingsOrders);
    const userData = {
      user_uuid: user.uid,
      user_name: user.name,
      user_email: user.email,
      user_profile_image: user.profile_img,
    };

    const ordersWithImages = await Promise.all(
      orders.map(async (order) => {
        const itemsWithImages = await Promise.all(
          order.items.map(async (item) => {
            const product = await ProductSchema.findOne({
              id: item.productId,
            });
            const image = product.imageUrl || null; // Get the first image or null if none exists
            return { ...item, image }; // Add the image to the item
          })
        );
        return { ...order._doc, items: itemsWithImages }; // Combine updated items with the order
      })
    );

    const listingsOrdersWithImages = await Promise.all(
      listingsOrders.map(async (listingOrder) => {
        const listing = await ListingSchema.findOne({
          listing_uid: listingOrder.listing_uid,
        });
        const images = listing.images.map((img) => img.url); // Extract all images URLs
        return { ...listingOrder._doc, images }; // Combine the listing order with the images
      })
    );

    res.status(200).json({
      message: "Listing Fetched",
      listings,
      userData,
      orders: orders.length > 0 ? ordersWithImages : [],
      listingsOrders:
        listingsOrdersWithImages.length > 0 ? listingsOrdersWithImages : [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const manageUserInfo = async (uid, type, data, action) => {
  try {
    if (!["shipping", "card"].includes(type)) {
      throw new Error("Invalid type. Use 'shipping' or 'card'.");
    }

    if (!["add", "update", "delete"].includes(action)) {
      throw new Error("Invalid action. Use 'add', 'update', or 'delete'.");
    }

    const updateFields = {};
    const fieldKey = type === "shipping" ? "shipping_info" : "card_info";
    const hasFieldKey = type === "shipping" ? "has_shipping_info" : null;

    // Determine the update based on the action
    if (action === "add" || action === "update") {
      if (!data) throw new Error("Data is required for adding or updating.");
      updateFields[fieldKey] = data;

      // For shipping, update the flag
      if (hasFieldKey) updateFields[hasFieldKey] = true;
    } else if (action === "delete") {
      updateFields[fieldKey] = null;

      // For shipping, update the flag
      if (hasFieldKey) updateFields[hasFieldKey] = false;
    }

    // Update the user document
    const user = await UsersSchema.findOneAndUpdate(
      { uid },
      { $set: updateFields },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found.");
    }

    console.log(`Successfully performed ${action} on ${type} info.`, user);
    return user;
  } catch (error) {
    console.error(`Error managing ${type} info:`, error);
    throw error;
  }
};

export default manageUserInfo;
