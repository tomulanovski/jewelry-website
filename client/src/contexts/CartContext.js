import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a Context for the Cart
const CartContext = createContext();

// Custom hook to use the Cart Context
export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
    }, []);

    const addItemToCart = (productId, quantity) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.map(item =>
                item.productId === productId
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
            if (!updatedItems.some(item => item.productId === productId)) {
                updatedItems.push({ productId, quantity });
            }
            localStorage.setItem('cart', JSON.stringify(updatedItems));
            return updatedItems;
        });
    };

    const removeItemFromCart = (productId) => {
        setCartItems((prevItems) => {
            const updatedItems = prevItems.filter(item => item.productId !== productId);
            localStorage.setItem('cart', JSON.stringify(updatedItems));
            return updatedItems;
        });
    };

    return (
        <CartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart }}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContext;