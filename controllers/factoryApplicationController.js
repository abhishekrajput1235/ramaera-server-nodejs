const FactoryApplication = require('../models/factoryApplication');

// @desc    Submit a new factory application
// @route   POST /api/factory-applications
const submitApplication = async (req, res) => {
  try {
    const {
      name,
      business_idea,
      location,
      required_amount,
      past_experience,
    } = req.body;

    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newApplication = new FactoryApplication({
      name,
      business_idea,
      location,
      required_amount,
      past_experience,
      supporting_document: filePath,
    });

    await newApplication.save();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Factory application submission error:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};


// @desc    Get all factory applications
// @route   GET /api/factory-applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await FactoryApplication.find().sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error('Fetch all applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// @desc    Get application by ID
// @route   GET /api/factory-applications/:id
const getApplicationById = async (req, res) => {
  try {
    const application = await FactoryApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (error) {
    console.error('Fetch application by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
};

// @desc    Update application status
// @route   PATCH /api/factory-applications/:id/status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await FactoryApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json({ message: 'Status updated', application: updated });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};

module.exports = {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
};
