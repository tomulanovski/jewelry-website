import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';
import Input from '../components/input';
import { Button } from '@mui/material';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(''); // Set this after user login
    const [shippingDetails, setShippingDetails] = useState({
        first_name: '', last_name: '', email: '', phone: '', street: '', city: '',
        apt: '', country: '', post_code: '',
    });

    // Load cart items from backend or localStorage
    useEffect(() => {
        const fetchCartItems = async () => {
            if (userId) {
                // Registered user: fetch cart from backend
                try {
                    const response = await axios.get(`http://localhost:3000/cart?userId=${userId}`);
                    setCartItems(response.data);
                } catch (error) {
                    console.error('Error loading cart items:', error);
                }
            } else {
                // Guest user: load cart from localStorage
                const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
                setCartItems(storedCart);
            }
        };

        fetchCartItems();
    }, [userId]);

    // Add an item to the cart
    const addItemToCart = async (productId, quantity) => {
        const newCartItem = { productId, quantity };
        if (userId) {
            try {
                // Registered user: send request to backend
                await axios.post('http://localhost:3000/cart/add', { userId, ...newCartItem });
                // Fetch updated cart from backend
                const response = await axios.get(`http://localhost:3000/cart?userId=${userId}`);
                setCartItems(response.data);
            } catch (error) {
                console.error('Error adding item to cart:', error);
            }
        } else {
            // Guest user: update cart in localStorage
            const updatedCart = [...cartItems];
            const existingItemIndex = updatedCart.findIndex(item => item.productId === productId);

            if (existingItemIndex >= 0) {
                updatedCart[existingItemIndex].quantity += quantity;
            } else {
                updatedCart.push(newCartItem);
            }

            setCartItems(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    // Remove item from the cart
    const removeItemFromCart = async (productId) => {
        if (userId) {
            try {
                // Registered user: send delete request to backend
                await axios.delete('http://localhost:3000/cart/remove', { data: { userId, productId } });
                // Fetch updated cart from backend
                const response = await axios.get(`http://localhost:3000/cart?userId=${userId}`);
                setCartItems(response.data);
            } catch (error) {
                console.error('Error removing item from cart:', error);
            }
        } else {
            // Guest user: update cart in localStorage
            const updatedCart = cartItems.filter(item => item.productId !== productId);
            setCartItems(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
        }
    };

    // Handle checkout and pass shipping details
    const handleCheckout = async () => {
        if (!shippingDetails.first_name || !shippingDetails.street || !shippingDetails.email) {
            alert('Please fill in all shipping details');
            return;
        }

        const orderData = {
            userId,
            cartItems,
            shippingDetails,
        };

        try {
            const response = await axios.post('http://localhost:3000/checkout', orderData);
            console.log('Order successful:', response.data);
            alert('Order placed successfully!');
        } catch (error) {
            console.error('Checkout error:', error);
            alert('There was an error placing your order.');
        }
    };

    return (
        <div>
            <Header />
            <h1>Your Cart</h1>
            <div>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    cartItems.map(item => (
                        <div key={item.productId}>
                            <h3>Product {item.productId}</h3>
                            <p>Quantity: {item.quantity}</p>
                            <button onClick={() => removeItemFromCart(item.productId)}>Remove</button>
                        </div>
                    ))
                )}
            </div>
            <h2>Shipping Details</h2>
            <Input type="text" placeholder="First Name" value= {shippingDetails.first_name} onChange={(e) => setShippingDetails({ ...shippingDetails, first_name: e.target.value })} />
            <Input type="text" placeholder="Last Name" value={shippingDetails.last_name}  onChange={(e) => setShippingDetails({ ...shippingDetails, last_name: e.target.value })} />
            <Input type="email" placeholder="Email" value={shippingDetails.email}  onChange={(e) => setShippingDetails({ ...shippingDetails, email: e.target.value })} />
            <Input type="text" placeholder="Phone" value={shippingDetails.phone}  onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })} />
            <Input type="text" placeholder="Street" value={shippingDetails.street}  onChange={(e) => setShippingDetails({ ...shippingDetails, street: e.target.value })} />
            <Input type="text" placeholder="City" value={shippingDetails.city}   onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })} />
            <Input type="text" placeholder="Appartment" value={shippingDetails.apt}   onChange={(e) => setShippingDetails({ ...shippingDetails, apt: e.target.value })} />
            <Input type="text" placeholder="Country" value={shippingDetails.country}   onChange={(e) => setShippingDetails({ ...shippingDetails, country: e.target.value })} />
            <Input type="text" placeholder="Postcode/Zip" value={shippingDetails.post_code}   onChange={(e) => setShippingDetails({ ...shippingDetails, post_code: e.target.value })} />
                                                    
            <button onClick={handleCheckout}>Proceed to Checkout</button>
            <Footer />
        </div>
    );
}

export default Cart;