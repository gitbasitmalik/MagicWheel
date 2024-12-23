import OrderListingSchema from "../model/OrderListingSchema.js";

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
