// models/factoryApplication.model.ts
const mongoose = require('mongoose');

const factoryApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    business_idea: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    required_amount: {
      type: String,
      required: true,
    },
    past_experience: {
      type: String,
      default: '',
    },
    supporting_document: {
      type: String, // File URL or filename
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);



const FactoryApplication = mongoose.model('FactoryApplication', factoryApplicationSchema);
module.exports = FactoryApplication;