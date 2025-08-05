const Admin = require("../models/AdminModal");
const User = require("../models/userModel");
const Permission = require("../models/PermissionModal");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ============================================================
// ✅ LOGIN
// ============================================================
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Admin.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_ADMIN, {
      expiresIn: "6d",
    });

    res.status(200).json({
      token,
      userId: user._id,
      email: user.email,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// ✅ REGISTER
// ============================================================
exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new Admin({ email, password });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_ADMIN, {
      expiresIn: "6d",
    });

    res.status(201).json({
      token,
      message: `${email} registered successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// ✅ ASSIGN PERMISSION
// ============================================================
exports.assignPermission = async (req, res) => {
  try {
    const { adminId, userId, permissions } = req.body;

    if (!userId || !permissions || typeof permissions !== "object") {
      return res
        .status(400)
        .json({ success: false, message: "userId and permissions object are required" });
    }

    const user = await User.findById(userId).populate("permission");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let permissionDoc;

    if (user.permission) {
      const updateFields = {};
      for (const key in permissions) {
        if (typeof permissions[key] === "boolean") {
          updateFields[`permissions.${key}`] = permissions[key];
        }
      }

      if (adminId) updateFields.grantedBy = adminId;

      permissionDoc = await Permission.findByIdAndUpdate(
        user.permission._id,
        { $set: updateFields },
        { new: true }
      );
    } else {
      if (Object.keys(permissions).length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "At least one permission field is required" });
      }

      permissionDoc = await Permission.create({
        grantedBy: adminId,
        permissions,
      });

      user.permission = permissionDoc._id;
      await user.save();
    }

    const updatedUser = await User.findById(user._id).populate("permission");

    return res.status(200).json({
      success: true,
      message: "Permissions updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ============================================================
// ✅ FETCH ADMIN INFO + ALL USERS WITH PERMISSION
// ============================================================
exports.fetchAdminInfoAndUsers = async (req, res) => {
  try {
    const admin = req.admin;

    const allUsers = await User.find({})
      .select("-password")
      .populate({
        path: "permission",
        populate: {
          path: "grantedBy",
          model: "User",
          select: "email _id",
        },
      });

    res.status(200).json({
      success: true,
      adminInfo: admin,
      users: allUsers,
    });
  } catch (err) {
    console.error("Error fetching user info:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ============================================================
// ✅ FORGOT PASSWORD
// ============================================================
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "No account with that email found." });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash and set to DB
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await admin.save();

    // Send email
    const resetUrl = `${FRONTEND_URL}/admin/reset-password/${resetToken}`;
    const subject = "Password Reset Request - Ramaera Industries";
    const html = `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password. This link is valid for 30 minutes:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <br /><br />
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail(admin.email, subject, "", html);

    res.status(200).json({ message: "Reset link sent to email." });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Error sending reset link." });
  }
};

// ============================================================
// ✅ RESET PASSWORD
// ============================================================
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;

    await admin.save(); // 🔒 pre-save hook will hash the password

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Error resetting password" });
  }
};

// ============================================================
// ✅ FETCH LOGGED-IN ADMIN PROFILE
// ============================================================
exports.getAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin?.id;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized: Admin ID not found in request." });
    }

    const admin = await Admin.findById(adminId).select("-password -resetPasswordToken -resetPasswordExpires");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching admin data",
    });
  }
};


