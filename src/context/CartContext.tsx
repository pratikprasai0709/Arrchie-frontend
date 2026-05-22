import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message: string };
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('bottle_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        localStorage.removeItem('bottle_cart');
      }
    }
  }, []);

  // Save to localStorage whenever cart state shifts
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('bottle_cart', JSON.stringify(items));
  };

  const addToCart = (product: Product, quantity: number): { success: boolean; message: string } => {
    if (product.stockQuantity <= 0) {
      return { success: false, message: 'This item is currently out of stock.' };
    }

    const existingIndex = cartItems.findIndex((item) => item.product._id === product._id);
    let updatedCart = [...cartItems];

    if (existingIndex > -1) {
      const currentQty = updatedCart[existingIndex].quantity;
      const targetQty = currentQty + quantity;

      if (targetQty > product.stockQuantity) {
        return {
          success: false,
          message: `Cannot purchase more than available stock (${product.stockQuantity}). You already have ${currentQty} in cart.`,
        };
      }

      updatedCart[existingIndex].quantity = targetQty;
    } else {
      if (quantity > product.stockQuantity) {
        return {
          success: false,
          message: `Cannot purchase more than available stock limit (${product.stockQuantity}).`,
        };
      }
      updatedCart.push({ product, quantity });
    }

    saveCart(updatedCart);
    return { success: true, message: `Successfully added ${quantity}x "${product.name}" to your cart.` };
  };

  const removeFromCart = (productId: string) => {
    const filtered = cartItems.filter((item) => item.product._id !== productId);
    saveCart(filtered);
  };

  const updateQuantity = (productId: string, quantity: number): { success: boolean; message: string } => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true, message: 'Item removed from cart.' };
    }

    const item = cartItems.find((ci) => ci.product._id === productId);
    if (!item) {
      return { success: false, message: 'Item not found in cart.' };
    }

    if (quantity > item.product.stockQuantity) {
      return {
        success: false,
        message: `Oops! We only have ${item.product.stockQuantity} matching units available in stock.`,
      };
    }

    const updated = cartItems.map((ci) =>
      ci.product._id === productId ? { ...ci, quantity } : ci
    );
    saveCart(updated);
    return { success: true, message: 'Quantity updated successfully.' };
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartItemCount = (): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
