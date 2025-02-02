const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

const router = express.Router();

// Route for creating an order
router.post('/create-order', createOrder);

// Route for verifying payment
router.post('/verify-payment', verifyPayment);

module.exports = router;
