const express = require("express");
const router = express.Router();
const Contact = require("../models/ContactForm"); // messageModel is your InternshipSchema
const { protectUserRoute ,protectAdminRoute} = require('../middleware/authMiddleware');
const Permission = require('../models/PermissionModal');
const User = require('../models/userModel');

const jwt = require('jsonwebtoken');


const Blog = require('../models/Blogschema');



const DeveloperGrant = require('../models/DevGrantModal')

// ================================================================
// User Authentication Part Come here
// ================================================================

const defaultPermissions = {
  user: { postBlog: false, replyMessage: true },
  admin: { postBlog: true, replyMessage: true, editBlog: true, deleteBlog: true, manageUsers: true },
  contentWriter: { postBlog: true, replyMessage: true, editBlog: true }
};

router.post('/register', async (req, res) => {
  const { email, password, role = 'user' } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ email, password, role });
    await newUser.save();

    // ✅ Create permission based on role
    const permission = await Permission.create({
      grantedBy: newUser._id, // Or assign the admin's ID if needed
      permissions: defaultPermissions[role] || {}
    });

    // ✅ Link permission to user
    newUser.permission = permission._id;
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET_USER, {
      expiresIn: '6d'
    });

    res.status(201).json({ token, message: 'Registered successfully', role: newUser.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// POST /login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET_USER,
        { expiresIn: '6d' }
      );
  
      res.status(200).json({ token, role: user.role, message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


// GET /all-User
router.get('/all-User', protectAdminRoute, async (req, res) => {
    try {
      const users = await User.find().select('-password'); // Exclude passwords
      res.status(200).json({ success: true, users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
     
  




// ================================================================
// Operation User Can Perform Authentication
// ================================================================





// GET /user/info — protected user info with permission
router.get('/info', protectUserRoute, async (req, res) => {
    try {
        const user = req.user;

        const allowedPermission = await Permission.findOne({ _id: user.permission });


        // res.status(200).json({
        //     success: true,
        //     user: {
        //         _id: user._id,
        //         email: user.email,
        //         permission: allowedPermission || {} // populated from Permission model
        //     }
        // });

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,  // ← add this if you want
                name: user.name,  // ← optional
                permission: user.permission  // or any custom permissions
            }
        });

    } catch (err) {
        console.error('Error fetching user info:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});








router.get("/view-message", protectUserRoute, async (req, res) => {
    try {
        const allMessages = await Contact.find({});

        res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data: allMessages
        });

        console.log("All contact messages fetched successfully.");
    } catch (error) {
        console.error("Error fetching contact messages:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
});



router.get("/view-applicant", protectUserRoute, async (req, res) => {
    try {
        const ViewApplicant = await DeveloperGrant.find({});

        res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data: ViewApplicant
        });

        console.log("All contact messages fetched successfully.");
    } catch (error) {
        console.error("Error fetching contact messages:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
});





// =================================================
// UnAuthorized User Activities
// =================================================


// Route: POST /api/user/contact
router.post("/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Basic validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // Save to DB
        const newMessage = new Contact({
            name,
            email,
            subject,
            message,
        });

        const savedMessage = await newMessage.save();

        res.status(201).json({
            success: true,
            message: "Message sent successfully!",
            data: savedMessage,
        });

        console.log("Contact message saved successfully:", savedMessage);
    } catch (error) {
        console.error("Error saving contact message:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
});


// POST /apply - Developer applies for grant
router.post('/apply', async (req, res) => {
    try {
        const { fullName, email, githubProfile, projectIdea, skills, experienceLevel } = req.body;

        if (!fullName || !email || !githubProfile || !projectIdea || !experienceLevel) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const newApplication = new DeveloperGrant({
            fullName,
            email,
            githubProfile,
            projectIdea,
            skills,
            experienceLevel
        });

        await newApplication.save();
        res.status(201).json({ success: true, message: 'Application submitted successfully.' });
    } catch (error) {
        console.error('Developer Grant Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
