import React, { useEffect, createContext, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFound from '../errors/NotFound';
import Cart from './Cart';
import CheckOut from './Checkout';
import CheckoutSuccess from './CheckoutSuccess';
import CheckoutPayment from './CheckoutPaymentForm';

const defaultCart = JSON.parse(sessionStorage.getItem('selectedItems')) || [];

export const CartContext = createContext(defaultCart);

export const CartProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
      const defaultCart = JSON.parse(sessionStorage.getItem('selectedItems')) || [];
      setSelectedItems(defaultCart);
      setLoading(false);
  }, []);

  useEffect(() => {
      sessionStorage.setItem('selectedItems', JSON.stringify(selectedItems));
  }, [selectedItems]);

  return (
      <CartContext.Provider value={{ selectedItems, setSelectedItems, loading }}>
          {children}
      </CartContext.Provider>
  );
};


function CartRoutes() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Cart />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/checkout/payment" element={<CheckoutPayment />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </CartProvider>
  );
}

export default CartRoutes;
