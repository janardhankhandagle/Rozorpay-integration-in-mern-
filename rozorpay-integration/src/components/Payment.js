import React, { useState } from 'react';
import './Payment.css'

const Payment = () => {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [courseName, setCourseName] = useState('');
    const [price, setPrice] = useState('');

    const initiatePayment = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseName, price }),
            });

            const orderData = await response.json();

            if (!response.ok) throw new Error(orderData.message);

            const options = {
                key: 'rzp_test_bzKW5WF1aXXozl',  
                amount: orderData.amount * 100,  
                currency: orderData.currency,
                name: 'Course Payment',
                order_id: orderData.id,
                description: 'Payment for course',
                handler: async function (response) {
                    console.log('Razorpay response:', response);

                    await verifyPayment(response);
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (error) {
            setPaymentStatus(`Error: ${error.message}`);
        }
    };

    const verifyPayment = async (response) => {
        try {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
    
            const verifyResponse = await fetch('http://localhost:5000/api/payment/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    razorpay_payment_id,
                    razorpay_order_id,
                    razorpay_signature,
                    courseName,  
                    price        
                }),
            });
    
            const result = await verifyResponse.json();
            setPaymentStatus(result.message);
            alert(result.message);
        } catch (error) {
            setPaymentStatus('Payment verification failed');
        }
    };
    

    return (
        <div className="payment-container">

            <h1>Course Payment</h1>
            
        <label htmlFor=""> Course Name </label>
        <input
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={e => setCourseName(e.target.value)}
        />
        <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
        />
        <button className='payment-button' onClick={initiatePayment}>Pay Now</button>
        {paymentStatus && <p>{paymentStatus}</p>}
    </div>
    );
};

export default Payment;
