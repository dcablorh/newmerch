import { useState, useCallback } from "react";
import type { Product } from "@/types/store";

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

// Simple global cart state
let cartItems: CartItem[] = [];
let listeners: Array<() => void> = [];

function notify() {
  listeners.forEach((l) => l());
}

export function useCart() {
  const [, setTick] = useState(0);

  const subscribe = useCallback(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  // Subscribe on mount
  useState(() => {
    const unsub = subscribe();
    return unsub;
  });

  const addToCart = useCallback((product: Product, quantity = 1, size?: string) => {
    const existing = cartItems.find(
      (i) => i.product.objectId === product.objectId && i.size === size
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      cartItems.push({ product, quantity, size });
    }
    cartItems = [...cartItems];
    notify();
  }, []);

  const removeFromCart = useCallback((objectId: string, size?: string) => {
    cartItems = cartItems.filter(
      (i) => !(i.product.objectId === objectId && i.size === size)
    );
    notify();
  }, []);

  const updateQuantity = useCallback((objectId: string, quantity: number, size?: string) => {
    const item = cartItems.find(
      (i) => i.product.objectId === objectId && i.size === size
    );
    if (item) {
      item.quantity = Math.max(0, quantity);
      if (item.quantity === 0) {
        cartItems = cartItems.filter((i) => i !== item);
      } else {
        cartItems = [...cartItems];
      }
      notify();
    }
  }, []);

  const clearCart = useCallback(() => {
    cartItems = [];
    notify();
  }, []);

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items: cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
  };
}
