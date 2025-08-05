const mongoose = require('mongoose');

const developerGrantSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    githubProfile: {
        type: String,
        required: true,
    },
    projectIdea: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        default: [],
    },
    experienceLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('DeveloperGrant', developerGrantSchema);
