import ListingSchema from "../model/ListingSchema.js";
import OrderListingSchema from "../model/OrderListingSchema.js";
import UsersSchema from "../model/UsersSchema.js";
import { addNotification } from "./userController.js";

// Get all orders for a listing (excluding deleted listings)
export const getAllListingOrder = async (req, res) => {
  try {
    const { id } = req.body; // Extract listing UID from the request body

    if (!id) {
      return res.status(400).json({ message: "Listing ID is required" }); // Handle missing ID
    }

    // Fetch orders for the listing that are not deleted
    const listingOrder = await OrderListingSchema.find({
      listing_uid: id,
      is_deleted: false,
    });

    if (!listingOrder || listingOrder.length === 0) {
      return res
        .status(200)
        .json({ message: "No orders found for this listing", success: false });
    }

    return res.status(200).json({ orders: listingOrder, success: true });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Update order status and ensure deleted listings are not shown
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, courierName, trackingId } = req.body;

    if (!orderId || !status) {
      return res
        .status(400)
        .json({ message: "Order ID and status are required" });
    }

    const order = await OrderListingSchema.findOne({ order_uuid: orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus === "delivered" && order.has_shipped) {
      return res
        .status(400)
        .json({ message: "Order is already delivered and cannot be updated" });
    }

    order.orderStatus = status;

    if (status === "shipped") {
      if (!courierName || !trackingId) {
        return res.status(400).json({
          message:
            "Courier name and tracking ID are required when marking the order as shipped.",
        });
      }
      order.courierName = courierName;
      order.trackingId = trackingId;
      order.has_shipped = true;
    }

    if (status === "cancelled") {
      order.has_shipped = true;
    }

    // Find the buyer and seller
    const buyer = await UsersSchema.findOne({ uid: order.buyer_uuid });
    const seller = await UsersSchema.findOne({ uid: order.seller_uuid });

    if (!buyer || !seller) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const buyerMessage = `Dear ${buyer.name}, your order with ID ${orderId} has been updated to status: "${status}".`;
    await addNotification(
      order.buyer_uuid,
      buyerMessage,
      "info",
      "order-status-icon",
      "#2196f3"
    );

    const sellerMessage = `Dear ${seller.name}, the order with ID ${orderId} for your product has been updated to status: "${status}".`;
    await addNotification(
      order.seller_uuid,
      sellerMessage,
      "info",
      "order-status-icon",
      "#2196f3"
    );

    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Fetch bought listings for a user (ensuring deleted listings are not shown)
export const sendUserBoughtListingController = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UsersSchema.findOne({ uid: id });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const listingsOrders = await OrderListingSchema.find({ buyer_uuid: id });

    if (!Array.isArray(listingsOrders) || listingsOrders.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No purchases found" });
    }

    const boughtListings = await Promise.all(
      listingsOrders.map(async (order) => {
        // Fetch listing, ensuring deleted ones are excluded
        const listing = await ListingSchema.findOne({
          listing_uid: order.listing_uid,
          is_deleted: false, // Ensure we exclude deleted listings here
        });

        if (!listing) return null;

        // Fetch the seller
        const seller = await UsersSchema.findOne({ uid: order.seller_uuid });

        return {
          order_id: order.order_uuid,
          orderStatus: order.orderStatus,
          orderAddressName: order.shippingAddress.name,
          orderAddress: order.shippingAddress.address,
          orderAddressCity: order.shippingAddress.city,
          orderAddressPC: order.shippingAddress.postalCode,
          orderPhoneNumber: order.phoneNumber,
          listing: {
            name: listing.name,
            description: listing.description,
            price: listing.price,
            images: listing.images,
            category: listing.category,
          },
          seller: seller
            ? {
                seller_uuid: seller.uid,
                seller_name: seller.name,
                seller_email: seller.email,
                seller_profile_image: seller.profile_img,
              }
            : null,
        };
      })
    );

    const filteredListings = boughtListings.filter(
      (listing) => listing !== null
    );

    res.status(200).json({
      success: true,
      message: "Bought listings fetched successfully",
      userData: {
        user_uuid: user.uid,
        user_name: user.name,
        user_email: user.email,
        user_profile_image: user.profile_img,
      },
      boughtListings: filteredListings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Soft delete listing
export const removeMyListController = async (req, res) => {
  try {
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({ message: "Listing ID is required" });
    }

    const listing = await ListingSchema.findOne({ listing_uid: listingId });
    console.log("hhhd", listing);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Mark the listing as deleted (soft delete)
    listing.is_deleted = true;
    await listing.save();

    console.log(`Listing with ID: ${listingId} marked as deleted`);

    return res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error removing listing:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
