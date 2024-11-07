import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Input from '../components/input';
import Header from '../components/header';
import Footer from '../components/footer';

function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [shippingDetails, setShippingDetails] = useState({
        first_name: '', last_name: '', email: '', phone: '', street: '', city: '',
        apt: '', country: '', post_code: '',
    });

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);

        // Calculate total price
        const total = storedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setTotalPrice(total);
    }, []);

    const handleCheckout = async () => {
        if (!shippingDetails.first_name || !shippingDetails.email || !shippingDetails.street) {
            alert('Please fill in all shipping details');
            return;
        }

        const orderData = {
            cartItems,
            shippingDetails,
        };

        try {
            const response = await axios.post('http://localhost:3000/checkout', orderData);
            alert('Order placed successfully!');
        } catch (error) {
            console.error('Checkout error:', error);
            alert('There was an error placing your order.');
        }
    };

    return (
        <div>
            <Header />
            <h1>Checkout</h1>
            <div>
                <h2>Order Summary</h2>
                <p>Total: ${totalPrice.toFixed(2)}</p>
            </div>
            <h2>Shipping Details</h2>
            <Input type="text" placeholder="First Name" value= {shippingDetails.first_name} onChange={(e) => setShippingDetails({ ...shippingDetails, first_name: e.target.value })} />
            <Input type="text" placeholder="Last Name" value={shippingDetails.last_name} onChange={(e) => setShippingDetails({ ...shippingDetails, last_name: e.target.value })} />
            <Input type="email" placeholder="Email" value={shippingDetails.email} onChange={(e) => setShippingDetails({ ...shippingDetails, email: e.target.value })} />
            <Input type="text" placeholder="Phone" value={shippingDetails.phone} onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })} />
            <Input type="text" placeholder="Street" value={shippingDetails.street} onChange={(e) => setShippingDetails({ ...shippingDetails, street: e.target.value })} />
            <Input type="text" placeholder="City" value={shippingDetails.city} onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })} />
            <Input type="text" placeholder="Appartment" value={shippingDetails.apt} onChange={(e) => setShippingDetails({ ...shippingDetails, apt: e.target.value })} />
            <Input type="text" placeholder="Country" value={shippingDetails.country} onChange={(e) => setShippingDetails({ ...shippingDetails, country: e.target.value })} />
            <Input type="text" placeholder="Postcode/Zip" value={shippingDetails.post_code} onChange={(e) => setShippingDetails({ ...shippingDetails, post_code: e.target.value })} />

            <button onClick={handleCheckout}>Place Order</button>
            <Footer />
        </div>
    );
}

export default Checkout;