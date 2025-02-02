const Razorpay = require('razorpay');
const crypto = require('crypto');
const Interview = require('../models/interview'); 
require('dotenv').config();

const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;

// Function to create an order (DOES NOT store in DB yet)
exports.createOrder = async (req, res) => {
    try {
        const { courseName, price } = req.body;

        if (!courseName || !price || price <= 0) {
            return res.status(400).json({ message: 'Invalid course name or price' });
        }

        const instance = new Razorpay({
            key_id: razorpayKeyId,
            key_secret: razorpayKeySecret,
        });

        // Order options for Razorpay
        const options = {
            amount: price * 100, 
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await instance.orders.create(options);

      
        res.status(200).json({
            id: order.id,
            amount: order.amount / 100,  
            currency: order.currency,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};

// Function to verify payment (Only stores successful payments)
exports.verifyPayment = async (req, res) => {
    try {
        console.log('Received verification request:', req.body);
        const { razorpay_payment_id, razorpay_signature, razorpay_order_id, courseName, price } = req.body;

        if (!razorpay_payment_id || !razorpay_signature || !razorpay_order_id || !courseName || !price) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

    
        const expectedSignature = crypto.createHmac('sha256', razorpayKeySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
          
            const newPayment = new Interview({
                courseName,
                price,
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                paymentStatus: 'Paid'
            });

            await newPayment.save();

            return res.status(200).json({ message: 'Payment successful', newPayment });
        } else {
            return res.status(400).json({ message: 'Payment verification failed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

