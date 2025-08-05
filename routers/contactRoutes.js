const express = require('express');
const {
  submitMessage,
  getAllMessages,
  getMessageById,
} = require('../controllers/contactMessageController');

const router = express.Router();

// POST a new contact message
router.post('/', submitMessage);

// GET all messages
router.get('/', getAllMessages);

// GET a single message by ID
router.get('/:id', getMessageById);

module.exports = router;
