const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  registerAdmin,
  assignPermission,
  fetchAdminInfoAndUsers,
  forgotPassword,
  getAdminProfile,
  resetPassword
} = require("../controllers/adminController");
const { protectAdminRoute } = require("../middleware/authMiddleware");

router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
router.put("/assign-permission", protectAdminRoute, assignPermission);
router.get("/info", protectAdminRoute, fetchAdminInfoAndUsers);
router.get("/profile", protectAdminRoute,getAdminProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


module.exports = router;
