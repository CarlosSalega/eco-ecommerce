"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import {
  type Cart,
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem as updateCart,
  clearCart as clearCartLib,
} from "@/lib/cart";

interface CartContextType {
  cart: Cart;
  addItem: (
    product: { id: string; title: string; price: number; image?: string },
    quantity?: number,
  ) => void;
  removeItem: (productId: string) => void;
  updateItem: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialCart = getCart();
    setCart(initialCart);
    setIsLoading(false);
  }, []);

  const handleAddItem = (
    product: { id: string; title: string; price: number; image?: string },
    quantity = 1,
  ) => {
    const updatedCart = addToCart(product, quantity);
    setCart(updatedCart);
  };

  const handleRemoveItem = (productId: string) => {
    const updatedCart = removeFromCart(productId);
    setCart(updatedCart);
  };

  const handleUpdateItem = (productId: string, quantity: number) => {
    const updatedCart = updateCart(productId, quantity);
    setCart(updatedCart);
  };

  const handleClearCart = () => {
    clearCartLib();
    setCart({ items: [], total: 0 });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem: handleAddItem,
        removeItem: handleRemoveItem,
        updateItem: handleUpdateItem,
        clearCart: handleClearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
