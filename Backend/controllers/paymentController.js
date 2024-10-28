import Stripe from 'stripe';
import OrderSchema from '../model/OrderSchema.js';

const stripe = new Stripe("sk_test_51QEAyCDXhLNMePK38XsmXHetQpFZw5ezaRXORDTmnNXzFb5p4E75spzEuo2UfFhqMuZT7PMcCLmxQMby29C1rdpP00HX17UELO");

export const getPubKeyController = async(req,res)=>{
    try {
        res.status(200).json({key:"pk_test_51QEAyCDXhLNMePK3PvH2O6ippr9EhlWpG30UGj7tHYS9PgwuHIFJFNXB7Ybn4HWnN0lNHXuHVse3P0zNe4PTJrdJ00OrnbrsW0"})
    } catch (error) {
        
    }

}

export const initPaymentSheetController = async(req,res)=>{
    try {
        const customer = await stripe.customers.create();
        const { total } = req.body;
    
        const formattedTotal = parseInt(total.replace(".", "")); 
        console.log("Total amount (in subunits):", formattedTotal);
    
        const ephemeralKey = await stripe.ephemeralKeys.create(
          { customer: customer.id },
          { apiVersion: '2024-09-30.acacia' }
        );
      
        const paymentIntent = await stripe.paymentIntents.create({
          amount: formattedTotal,
          currency: 'PKR',
          customer: customer.id,
        });
      
        res.status(200).json({
          paymentIntent: paymentIntent.client_secret,
          ephemeralKey: ephemeralKey.secret,
          customer: customer.id,
          publishableKey: 'pk_test_51QEAyCDXhLNMePK3PvH2O6ippr9EhlWpG30UGj7tHYS9PgwuHIFJFNXB7Ybn4HWnN0lNHXuHVse3P0zNe4PTJrdJ00OrnbrsW0',
        });
      } catch (error) {
        console.error("Error initializing payment sheet:", error);
        res.status(500).json({ error: "Failed to initialize payment sheet" });
      }

}

export const saveOrderInfo =async(req, res)=>{
    try {
        console.log(req.body);
        const { customer, items, totalAmount, shippingAddress,phoneNumber, paymentDetails } = req.body;
    
        // Create a new order
        const newOrder = new OrderSchema({
          customer,
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            name: item.name,
            price: item.price,
          })),
          totalAmount,
          currency: 'pkr',
          shippingAddress:{
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
          orderStatus: 'processing',
        });
    
        // Save the order to the database
        await newOrder.save();
        res.status(200).json({ message: 'Order saved successfully', orderId: newOrder._id });
      } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ error: 'Failed to save order' });
      }
}