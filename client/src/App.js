import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { Login } from './pages/users/login';
import { Register } from './pages/users/register';
import './App.css';
import Cart from './pages/Cart';
import Shop from './pages/Shop/Shop';
import CheckoutPage from './pages/Checkout';
import Product from './pages/ProductPage';
import { CartProvider } from './contexts/CartContext';
import { ProductProvider } from './contexts/ProductContext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import OrderConfirmation from './pages/OrderConfirmation';
import { AuthProvider } from './contexts/AuthContext';
import { AdminRoute } from './components/AdminRoute';
import { AdminDashboard } from './pages/users/admindashboard';
import { AdminProducts } from './pages/Admin/AdminProducts';
import { AdminOrders } from './pages/Admin/AdminOrders';


function App() {
  const paypalOptions = {
    "client-id": process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PAYPAL_CLIENT_ID : process.env.REACT_APP_PAYPAL_TEST_ID,
    currency: "USD",
    intent: "capture",
    debug: true  // for development
  };

  //  to debug
  console.log('PayPal Options:', {
    ...paypalOptions,
    "client-id": paypalOptions["client-id"]?.substring(0, 10) + '...'
  });

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <BrowserRouter>
      <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                </Route>
          </Routes>
        </CartProvider>
        </ProductProvider>
        </AuthProvider>
      </BrowserRouter>
    </PayPalScriptProvider>
  );
}

export default App;