const express = require('express');
const {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById
} = require('../controllers/subscriptionController');

const router = express.Router();

router.post('/', createSubscription);
router.get('/', getAllSubscriptions);
router.get('/:id', getSubscriptionById);

module.exports = router;
