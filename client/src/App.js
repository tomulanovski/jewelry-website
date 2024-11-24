import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import Cart from './pages/Cart';
import Shop from './pages/Shop/Shop';
import CheckoutPage from './pages/Checkout';
import Product from './pages/ProductPage';
import { CartProvider } from './contexts/CartContext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function App() {
  const paypalOptions = {
    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
    debug: true  // Add this for development
  };

  // Add this to debug
  console.log('PayPal Options:', {
    ...paypalOptions,
    "client-id": paypalOptions["client-id"]?.substring(0, 10) + '...'
  });

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <BrowserRouter>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </PayPalScriptProvider>
  );
}

export default App;