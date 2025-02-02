const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    courseName: { type: String, required: true },
    price: { type: Number, required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String, default: null },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
