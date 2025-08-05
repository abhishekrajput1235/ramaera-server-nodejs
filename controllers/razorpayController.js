// // controllers/razorpayController.js
// const Razorpay = require("razorpay");
// const dotenv = require("dotenv");

// require('dotenv').config();


// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });
// console.log("Razorpay Key:", process.env.RAZORPAY_KEY_ID);
// console.log("Razorpay Secret:", process.env.RAZORPAY_KEY_SECRET);

// const createRazorpayOrder = async (amount) => {
//   const options = {
//     amount: amount * 100, // Razorpay takes paisa
//     currency: "INR",
//     receipt: `order_rcptid_${Math.floor(Math.random() * 10000)}`,
//   };

//   const order = await razorpayInstance.orders.create(options);
//   return order;
// };

// module.exports = { createRazorpayOrder };
