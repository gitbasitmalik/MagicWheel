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
export const getShippingDetailsController = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);
    const { shipping, success } = await getShippingDetails(userId);
  
    if (success) {
      const data = {
        ...shipping,
        success,
      };
      return res.status(200).json({ message: "Shipping found", data });
    }

    // If we get here, no shipping was found
    return res.status(200).json({ success: false });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get shipping details of a user
export const getShippingDetails = async (userId) => {
  try {
    const user = await UsersSchema.findOne({ uid: userId });
    if (!user) {
      throw new Error("User not found");
    }
    if (user.has_shipping_info) {
      return { shipping: user.shipping_info, success: true };
    }
    return { shipping: {}, success: false };
  } catch (error) {
    throw new Error(`Error fetching shipping details: ${error.message}`);
  }
};

export const updateShippingDetails = async (req, res) => {
  try {
    let { userUid, shippingInfo } = req.body;

    // Attempt to update the user's shipping info
    const user = await UsersSchema.findOneAndUpdate(
      { uid: userUid },
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
export const addNotification = async (userId, message) => {
  try {
    const user = await UsersSchema.findOneAndUpdate(
      { id: userId },
      {
        $push: {
          notifications: { message, date: new Date(), read: false },
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
