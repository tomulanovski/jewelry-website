import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';
import { useNavigate } from 'react-router-dom';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchCartItems = async () => {
            if (email) {
                try {
                    const response = await axios.get(`http://localhost:3000/cart?email=${email}`);
                    setCartItems(response.data);
                } catch (error) {
                    console.error('Error loading cart items:', error);
                }
            } else {
                const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
                setCartItems(storedCart);
            }
        };
        fetchCartItems();
    }, [email]);

    const addItemToCart = async (productId, quantity) => {
        const updatedCart = cartItems.map(item => item.productId === productId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item);

        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeItemFromCart = async (productId) => {
        const updatedCart = cartItems.filter(item => item.productId !== productId);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
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
                            <button onClick={() => addItemToCart(item.productId, 1)}>Add</button>
                            <button onClick={() => removeItemFromCart(item.productId)}>Remove</button>
                        </div>
                    ))
                )}
            </div>
            <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
            <Footer />
        </div>
    );
}

export default Cart;