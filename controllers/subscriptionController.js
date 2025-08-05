// controllers/subscriptionController.js
const Subscription = require("../models/SubscriptionModel");
const { createRazorpayOrder } = require("./razorpayController");
const sendEmail = require("../utils/sendEmail");

const createSubscription = async (req, res) => {
  try {
    const {
      level,
      rmPwId,
      name,
      address,
      pin,
      mobile,
      altMobile,
      combo,
      quantity,
      paymentMethod,
      upiId,
      email,
    } = req.body;

    const comboPrices = {
      "₹100 Spice Pack": 100,
      "₹200 Premium Pack": 200,
      "₹300 Deluxe Pack": 300,
    };

    if (!comboPrices[combo]) {
      return res.status(400).json({ error: "Invalid combo selected" });
    }

    const total = comboPrices[combo] * quantity;

    // Case: Razorpay Payment – return order details
    if (paymentMethod === "razorpay") {
      const order = await createRazorpayOrder(total);

      return res.status(200).json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        razorpayKey: process.env.RAZORPAY_KEY_ID,
        message: "Razorpay order created",
      });
    }

    // Case: UPI / Offline – directly save
    const newSubscription = new Subscription({
      level,
      rmPwId: level === "Share Holder" ? rmPwId : "",
      name,
      address,
      pin,
      mobile,
      altMobile,
      email,
      combo,
      quantity,
      paymentMethod,
      upiId: paymentMethod === "upi" ? upiId : "",
      total,
    });

    await newSubscription.save();
    if (email) {
      await sendEmail(
        email,
        "🌶 Your Spice Subscription with Ramaera Industries is Confirmed!",
        `Hi ${name},
    
        Thank you for subscribing to our Special Pack of Spices – Monthly Subscription from Ramaera Industries Ltd.
    
        Combo Selected: ${combo}
        Quantity: ${quantity}
        Total Amount: ₹${total}
          
        Your order is being processed and will be shipped shortly.
          
        We appreciate your trust in us to bring authentic flavors to your kitchen every month!
          
        Warm regards,  
        Team Ramaera Industries Ltd.`,
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #d35400;">Hi ${name},</h2>
            <p>Thank you for subscribing to our <strong>Special Pack of Spices – Monthly Subscription</strong>.</p>
            <p><strong>Combo Selected:</strong> ${combo}<br/>
               <strong>Quantity:</strong> ${quantity}<br/>
               <strong>Total Amount:</strong> ₹${total}</p>
            <p>Your order is now being processed and will be shipped to you shortly.</p>
            <p>We’re thrilled to bring the taste of authenticity and rich Indian spices to your doorstep every month!</p>
            <br />
            <p>Best regards,<br/>
            <strong>Team Ramaera Industries Ltd.</strong></p>
          </div>
        `
      );
    }

    return res.status(201).json({ message: "Subscription successful", subscription: newSubscription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Export other methods
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().sort({ createdAt: -1 });
    res.status(200).json(subscriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
};

const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.status(200).json(subscription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch subscription" });
  }
};

module.exports = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
};
