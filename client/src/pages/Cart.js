import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/navbar';
import { useCart } from '../contexts/CartContext'; // Import useCart hook

function Cart() {
    const { cartItems, addItemToCart, removeItemFromCart } = useCart(); // Destructure cart state and functions
    const navigate = useNavigate();

    const handleAddItem = (productId, quantity) => {
        addItemToCart(productId, quantity);
    };

    const handleRemoveItem = (productId) => {
        removeItemFromCart(productId);
    };

    return (
        <div>
            <NavBar />
            <h1>Your Cart</h1>
            <div>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    cartItems.map(item => (
                        <div key={item.productId}>
                            {/* Render specific properties */}
                            <h3>Product: {item.title}</h3> {/* Assuming 'title' is part of your item */}
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${item.price}</p> {/* Assuming 'price' is part of your item */}
                            <button onClick={() => handleAddItem(item.productId, 1)}>Add</button>
                            <button onClick={() => handleRemoveItem(item.productId)}>Remove</button>
                        </div>
                    ))
                )}
            </div>
            <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
        </div>
    );
}

export default Cart;
