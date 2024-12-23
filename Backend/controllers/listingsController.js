import ListingSchema from "../model/ListingSchema.js";
import OrderListingSchema from "../model/OrderListingSchema.js";
import UsersSchema from "../model/UsersSchema.js";
import { addNotification } from "./userController.js";

export const getAllListingOrder = async (req, res) => {
  try {
    const { id } = req.body; // Extract listing UID from the request body

    if (!id) {
      return res.status(400).json({ message: "Listing ID is required" }); // Handle missing ID
    }

    // Fetch orders for the listing
    const listingOrder = await OrderListingSchema.find({ listing_uid: id });

    // If no orders found, respond with an empty array or a message
    if (!listingOrder || listingOrder.length === 0) {
      return res
        .status(200)
        .json({ message: "No orders found for this listing", success: false });
    }

    // Send back the orders found
    return res.status(200).json({ orders: listingOrder, success: true });
  } catch (error) {
    console.error("Error fetching orders:", error); // Log the error for debugging
    // Send a 500 internal server error if something goes wrong
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status, courierName, trackingId } = req.body;
    console.log(orderId);
    // Validate required fields
    if (!orderId || !status) {
      return res
        .status(400)
        .json({ message: "Order ID and status are required" });
    }

    // Find the order
    const order = await OrderListingSchema.findOne({ order_uuid: orderId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order is already delivered
    if (order.orderStatus === "delivered" && order.has_shipped) {
      return res
        .status(400)
        .json({ message: "Order is already delivered and cannot be updated" });
    }

    // Update the order status
    order.orderStatus = status;

    // Handle "shipped" status logic
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
    // Save the updated order

    const buyer = await UsersSchema.findOne({ uid: order.buyer_uuid });
    const seller = await UsersSchema.findOne({ uid: order.seller_uuid });

    if (!buyer || !seller) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const buyerMessage = `Dear ${buyer.name}, your order with ID ${orderId} has been updated to status: "${status}".`;
    await addNotification(
      order.buyer_uuid, // user_uuid (buyer)
      buyerMessage, // message
      "info", // type (informational)
      "order-status-icon", // bgIcon (icon for order status updates)
      "#2196f3" // bgColor (blue for order updates)
    );

    // Notify the seller about the order status update
    const sellerMessage = `Dear ${seller.name}, the order with ID ${orderId} for your product has been updated to status: "${status}".`;
    await addNotification(
      order.seller_uuid, // user_uuid (seller)
      sellerMessage, // message
      "info", // type (informational)
      "order-status-icon", // bgIcon (icon for order status updates)
      "#2196f3" // bgColor (blue for order updates)
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

export const sendUserBoughtListingController = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    // Find the user based on the provided ID
    const user = await UsersSchema.findOne({ uid: id });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Fetch all orders where the user is the buyer
    const listingsOrders = await OrderListingSchema.find({ buyer_uuid: id });

    console.log("Listings Orders:", listingsOrders); // Log listings orders

    if (!Array.isArray(listingsOrders) || listingsOrders.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No purchases found" });
    }

    // Fetch details of the listings and sellers based on the orders
    const boughtListings = await Promise.all(
      listingsOrders.map(async (order) => {
        // Fetch the listing details
        const listing = await ListingSchema.findOne({
          listing_uid: order.listing_uid,
        });

        if (!listing) return null;

        // Fetch the seller details
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

    // Filter out null values in case of missing listings or sellers
    const filteredListings = boughtListings.filter(
      (listing) => listing !== null
    );

    console.log("Filtered Listings:", filteredListings); // Log the final listings

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
