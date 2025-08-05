const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const { protectUserRoute } = require('../middleware/authMiddleware');
const upload = require('../config/multer'); // multer config
const Permission = require('../models/PermissionModal');
const Blog = require('../models/Blogschema'); // ✅ Import Blog model

// GET /user/:id/blog-count
router.get('/blog/:id/blog-count', async (req, res) => {
  try {
    const userId = req.params.id;
    const count = await Blog.countDocuments({ author: userId });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('Error fetching blog count:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// POST /user/blog - submit a blog
router.post('/blog', protectUserRoute, upload.single('coverImage'), async (req, res) => {
  try {
    const user = req.user;
    console.log(user);

    // ✅ Safe check
    if (!user || !user.permission) {
      return res.status(403).json({ success: false, message: 'User permission not assigned.' });
    }

    // ✅ Fetch and check permission
    const allowedPermission = await Permission.findById(user.permission);
    if (!allowedPermission || !allowedPermission.permissions?.postBlog) {
      return res.status(403).json({ success: false, message: 'You are not allowed to post a blog.' });
    }

    const { title, category, content, publicationDate } = req.body;

    if (!title || !category || !content || !publicationDate) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const blog = new Blog({
      title,
      category,
      content,
      publicationDate,
      coverImageUrl: req.file ? req.file.path : null,
      author: user._id
    });

    const savedBlog = await blog.save();

    res.status(201).json({
      success: true,
      message: 'Blog posted successfully!',
      blog: savedBlog
    });
  } catch (error) {
    console.error('Error uploading blog:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// PUT or PATCH - Update blog by ID
// ✅ Update blog
router.put('/blog/:id', protectUserRoute, upload.single('coverImage'), async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid blog ID' });
  }

  try {
    const updateData = {
      title: req.body.title,
      content: req.body.content,
      publicationDate: req.body.publicationDate,
      readTime: req.body.readTime,
      category: req.body.category,
    };

    if (req.file) {
      // updateData.coverImageUrl = req.file.filename; // ✅ store only filename
      updateData.coverImageUrl= `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      blog: updatedBlog,
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// GET all blogs
router.get('/blog', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'email')
      .sort({ publicationDate: -1 });

    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// GET blog by ID
router.get('/blog/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'email');
    console.log(blog)
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Delete blog by ID
router.delete('/blog/:id', async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid blog ID' });
  }

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
      blog: deletedBlog,
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});




module.exports = router;
