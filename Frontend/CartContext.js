import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const toggleCartItem = (product) => {
    if (isInCart(product.id)) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  const saveCart = async (newCart) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  const addToCart = (product) => {
    const updatedCart = [...cartItems, { ...product, quantity: 1 }];
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  // Update item in cart
  const updateCartItem = (updatedItem) => {
    const updatedCart = cartItems.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };


  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };
  const setUser = (userData) => {
    setUserInfo(userData); // Store user information in state
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, isInCart, toggleCartItem, updateCartItem,userInfo, setUser, }}>
      {children}
    </CartContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(CartContext);
};
