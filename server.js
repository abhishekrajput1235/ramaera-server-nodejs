const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");


const userRoute = require('./routers/userRouter');
const adminRoute = require('./routers/AdminRoute');
const blogRoute = require('./routers/blogRoute');
const colors = require("colors");
const contactRoutes = require("./routers/contactRoutes");
const factoryApplicationRoutes = require("./routers/factoryApplicationRoutes");
const subscriptionRoutes = require('./routers/subscriptionRoutes');
const razorpayRoutes = require('./routers/razorpayRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://192.168.1.44:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', async (req, res) => {
  res.send("API is running successfully");
});

// Routes Mount
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/blog', blogRoute);
app.use('/api/contact', contactRoutes)
app.use('/api/apply-factory',factoryApplicationRoutes);
app.use("/api/razorpay", razorpayRoutes);
app.use('/api/subscription', subscriptionRoutes);



// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack.red);
  res.status(500).send({ message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server Started on PORT ${PORT}`.yellow.bold)
);
