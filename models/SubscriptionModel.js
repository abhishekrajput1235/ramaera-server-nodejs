// models/Subscription.js
const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  level: { type: String, enum: ['Share Holder', 'Individual User'], required: true },
  rmPwId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  pin: { type: String, required: true },
  mobile: { type: String, required: true },
  altMobile: { type: String },
  combo: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  paymentMethod: {
    type: String,
    enum: ["upi", "razorpay", "cod"], // Make sure "cod" is here
    required: true,
  },  upiId: { type: String },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});


const Subscription = mongoose.model('Subscription', SubscriptionSchema);
module.exports = Subscription;