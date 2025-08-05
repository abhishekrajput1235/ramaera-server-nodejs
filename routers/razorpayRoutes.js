// routes/razorpayRoutes.js
const express = require("express");
const router = express.Router();
const { createRazorpayOrder } = require("../controllers/razorpayController");

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const order = await createRazorpayOrder(amount);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

module.exports = router;
