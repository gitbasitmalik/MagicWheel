import { v4 as uuid } from "uuid";
import UsersSchema from "../model/UsersSchema.js";
import mongoose from "mongoose";

export const addNewUserController = async (req, res) => {
  try {
    const { name, email, uid } = req.body;

    await UsersSchema.create({
      id: uuid(),
      name,
      email,
      uid,
      profile_img:
        "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    });

    res.status(201).json({ message: "User Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const findUserByEmailController = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await UsersSchema.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user is found, return user data
    res.status(200).json({ message: "User found", ...user });
    console.log("user found");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Controller to handle requests for getting shipping details
export const getShippingDetailsController = async (req, res) => {
  try {
    console.log("asd", req.body);
    const { userId } = req.body;

    // Debug log for received userId
    console.log("Received userId:", userId);

    // Check if userId is provided
    if (!userId) {
      return res
        .status(400)
        .json({ message: "userId is required", success: false });
    }

    // Fetch shipping details using helper function
    const { shipping, success } = await getShippingDetails(userId);

    // If successful, send shipping details
    if (success) {
      const data = {
        ...shipping,
        success,
      };
      return res.status(200).json({ message: "Shipping found", data });
    }

    // If no shipping details found, send 404 response
    return res
      .status(404)
      .json({ message: "Shipping details not found", success: false });
  } catch (error) {
    // Log error and send internal server error response
    console.error("Error in getShippingDetailsController:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// Helper function to fetch shipping details of a user
export const getShippingDetails = async (userId) => {
  try {
    // Query database for user by userId
    const user = await UsersSchema.findOne({ uid: userId });

    // If user not found, throw an error
    if (!user) {
      console.error("User not found for userId:", userId);
      throw new Error("User not found");
    }

    // If user has shipping info, return it
    if (user.has_shipping_info) {
      return { shipping: user.shipping_info, success: true };
    }

    // If no shipping info, return empty object and success as false
    return { shipping: {}, success: false };
  } catch (error) {
    // Log error and rethrow
    console.error("Error in getShippingDetails:", error.message);
    throw new Error(`Error fetching shipping details: ${error.message}`);
  }
};

export const updateShippingDetails = async (req, res) => {
  try {
    let { userId, shippingInfo } = req.body;

    // Attempt to update the user's shipping info
    const user = await UsersSchema.findOneAndUpdate(
      { uid: userId },
      {
        $set: {
          shipping_info: shippingInfo,
          has_shipping_info: true,
        },
      },
      { new: true }
    );

    // If user not found, throw error to be caught in the catch block
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // If user is found, return updated shipping info
    return res.status(200).json({
      success: true,
      shipping_info: user.shipping_info,
    });
  } catch (error) {
    console.error("Error updating shipping details:", error);
    // Ensure no further responses are sent if an error occurs
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: `Error updating shipping details: ${error.message}`,
      });
    }
  }
};

// Get notifications of a user
export const getNotifications = async (userId) => {
  try {
    const user = await UsersSchema.findOne({ uid: userId });
    if (!user) {
      throw new Error("User not found");
    }
    return user.notifications;
  } catch (error) {
    throw new Error(`Error fetching notifications: ${error.message}`);
  }
};

// Add a new notification to the user
export const addNotification = async (
  userId,
  message,
  type = "info",
  bgIcon = "default-icon",
  bgColor = "#ffffff" // Default background color
) => {
  try {
    const user = await UsersSchema.findOneAndUpdate(
      { uid: userId },
      {
        $push: {
          notifications: {
            message,
            type,
            bgIcon,
            bgColor,
            date: new Date(),
            read: false,
          },
        },
      },
      { new: true }
    );
    if (!user) {
      throw new Error("User not found");
    }
    return user.notifications;
  } catch (error) {
    throw new Error(`Error adding notification: ${error.message}`);
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (userId, notificationId) => {
  try {
    const user = await UsersSchema.findOneAndUpdate(
      { id: userId, "notifications._id": notificationId },
      {
        $set: {
          "notifications.$.read": true,
        },
      },
      { new: true }
    );
    if (!user) {
      throw new Error("User or notification not found");
    }
    return user.notifications;
  } catch (error) {
    throw new Error(`Error marking notification as read: ${error.message}`);
  }
};

export const getNotificationController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const user = await UsersSchema.findOne({ uid: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sortedNotifications = user.notifications.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.status(200).json({
      success: true,
      notifications: sortedNotifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};
