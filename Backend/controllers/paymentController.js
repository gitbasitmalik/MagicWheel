import Stripe from "stripe";
import OrderSchema from "../model/OrderSchema.js";
import OrderListingSchema from "../model/OrderListingSchema.js";
import { v4 as uuid } from "uuid";
const stripe = new Stripe(
  "sk_test_51QEAyCDXhLNMePK38XsmXHetQpFZw5ezaRXORDTmnNXzFb5p4E75spzEuo2UfFhqMuZT7PMcCLmxQMby29C1rdpP00HX17UELO"
);

export const getPubKeyController = async (req, res) => {
  try {
    console.log("object");
    return res.status(200).json({
      key: "pk_test_51QEAyCDXhLNMePK3PvH2O6ippr9EhlWpG30UGj7tHYS9PgwuHIFJFNXB7Ybn4HWnN0lNHXuHVse3P0zNe4PTJrdJ00OrnbrsW0",
    });
  } catch (error) {}
};

export const initPaymentSheetController = async (req, res) => {
  try {
    const { total, userUid } = req.body;
    const formatTotal = (total) => {
      // If total is a valid number and not NaN
      if (typeof total === "number" && !isNaN(total)) {
        // If it's an integer, just return it as paisa
        if (Number.isInteger(total)) {
          return total;
        } else {
          // If it's a float, convert it to integer by removing the decimal
          const formattedTotal = parseInt(
            total.toString().replace(".", ""),
            10
          );
          return formattedTotal;
        }
      }
      return total; // If it's not a valid number, return as is
    };
    const formattedTotal = formatTotal(total);

    // Check if customer already exists
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: userUid,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      // Create a new customer if none exists
      customer = await stripe.customers.create({
        email: userUid,
      });
    }

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-09-30.acacia" }
    );

    // Create a SetupIntent for saving the card
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["card"],
      usage: "off_session", // This allows the card to be used for future payments
    });

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: formattedTotal * 100,
      currency: "PKR",
      customer: customer.id,
      setup_future_usage: "off_session", // This tells Stripe to save the card
    });

    res.status(200).json({
      paymentIntent: paymentIntent.client_secret,
      setupIntent: setupIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey:
        "pk_test_51QEAyCDXhLNMePK3PvH2O6ippr9EhlWpG30UGj7tHYS9PgwuHIFJFNXB7Ybn4HWnN0lNHXuHVse3P0zNe4PTJrdJ00OrnbrsW0",
    });
  } catch (error) {
    console.error("Error initializing payment sheet:", error);
    res.status(500).json({ error: "Failed to initialize payment sheet" });
  }
};

export const saveOrderInfo = async (req, res) => {
  try {
    console.log(req.body);
    const {
      customer,
      items,
      totalAmount,
      shippingAddress,
      phoneNumber,
      paymentDetails,
      user_uuid,
    } = req.body;

    // Create a new order
    const newOrder = new OrderSchema({
      customer,
      user_uuid,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
      })),
      totalAmount,
      currency: "pkr",
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        name: shippingAddress.name,
      },
      phoneNumber: phoneNumber,
      paymentDetails: {
        paymentIntentId: paymentDetails.paymentIntentId || "",
        customerId: paymentDetails.customerId || "",
        paymentMethod: paymentDetails.paymentMethod,
        status: paymentDetails.status,
      },
      orderStatus: "pending",
    });

    // Save the order to the database
    await newOrder.save();
    res
      .status(200)
      .json({ message: "Order saved successfully", orderId: newOrder._id });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
};

export const saveOrderInfoListing = async (req, res) => {
  try {
    console.log(req.body);
    const {
      customer,
      items,
      totalAmount,
      shippingAddress,
      phoneNumber,
      paymentDetails,
      buyer_uuid,
      seller_uuid,
      listing_uid,
      quantity,
      name,
      price,
    } = req.body;

    // Create a new order
    const newOrder = new OrderListingSchema({
      order_uuid: uuid(),
      customer,
      buyer_uuid,
      seller_uuid,
      listing_uid,

      quantity,
      name,
      price,

      totalAmount,
      currency: "pkr",
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        name: shippingAddress.name,
      },
      phoneNumber: phoneNumber,
      paymentDetails: {
        paymentIntentId: paymentDetails.paymentIntentId,
        customerId: paymentDetails.customerId,
        paymentMethod: paymentDetails.paymentMethod,
        status: paymentDetails.status,
      },
      orderStatus: "pending",
    });

    // Save the order to the database
    await newOrder.save();
    res
      .status(200)
      .json({ message: "Order saved successfully", orderId: newOrder._id });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ error: "Failed to save order" });
  }
};

export const fetchSavedCardsController = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // First, find the Stripe customer ID associated with the user
    const existingCustomers = await stripe.customers.list({
      email: userId,
      limit: 1,
    });

    if (existingCustomers.data.length === 0) {
      // No customer found
      return res.status(200).json({ cards: [] });
    }

    const customerId = existingCustomers.data[0].id;

    // Fetch all payment methods for the customer
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    // Format the cards data
    const cards = paymentMethods.data.map((pm) => ({
      id: pm.id,
      brand: pm.card.brand,
      last4: pm.card.last4,
      expiryMonth: pm.card.exp_month,
      expiryYear: pm.card.exp_year,
      isDefault: pm.id === existingCustomers.data[0].default_source,
    }));

    res.status(200).json({ cards });
  } catch (error) {
    console.error("Error fetching saved cards:", error);
    res.status(500).json({
      error: "Failed to fetch saved cards",
      details: error.message,
    });
  }
};

// Controller to delete a saved card
export const deleteCardController = async (req, res) => {
  try {
    const { userId, paymentMethodId } = req.body;

    if (!userId || !paymentMethodId) {
      return res
        .status(400)
        .json({ error: "User ID and payment method ID are required" });
    }

    // Find the customer
    const existingCustomers = await stripe.customers.list({
      email: userId,
      limit: 1,
    });

    if (existingCustomers.data.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Detach the payment method
    await stripe.paymentMethods.detach(paymentMethodId);

    res.status(200).json({ message: "Card successfully deleted" });
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({
      error: "Failed to delete card",
      details: error.message,
    });
  }
};

// Controller to set a card as default
export const setDefaultCardController = async (req, res) => {
  try {
    const { userId, paymentMethodId } = req.body;

    if (!userId || !paymentMethodId) {
      return res
        .status(400)
        .json({ error: "User ID and payment method ID are required" });
    }

    // Find the customer
    const existingCustomers = await stripe.customers.list({
      email: userId,
      limit: 1,
    });

    if (existingCustomers.data.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const customerId = existingCustomers.data[0].id;

    // Update the customer's default payment method
    await stripe.customers.update(customerId, {
      default_source: paymentMethodId,
    });

    res.status(200).json({ message: "Default card updated successfully" });
  } catch (error) {
    console.error("Error setting default card:", error);
    res.status(500).json({
      error: "Failed to set default card",
      details: error.message,
    });
  }
};
