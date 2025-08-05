const ContactMessage = require('../models/ContactMessage');

// post 
const submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = new ContactMessage({ name, email, subject, message });
    await newMessage.save();

    res.status(201).json({ message: 'Message Sent Successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

// get all messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Fetch all messages error:', error);
    res.status(500).json({ error: 'Unable to retrieve messages' });
  }
};

//get messages by Id
const getMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json(message);
  } catch (error) {
    console.error('Fetch message by ID error:', error);
    res.status(500).json({ error: 'Unable to retrieve message' });
  }
};

module.exports = {
  submitMessage,
  getAllMessages,
  getMessageById,
};
