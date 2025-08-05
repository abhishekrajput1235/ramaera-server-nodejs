const express = require('express');
const router = express.Router();

// Import multer upload middleware
const upload = require('../config/multer');

// Import controller functions
const {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
} = require('../controllers/factoryApplicationController');

// Route to submit a new application with file upload
router.post('/', upload.single('supporting_document'), submitApplication);

// Other application routes
router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.patch('/:id/status', updateApplicationStatus);

module.exports = router;
