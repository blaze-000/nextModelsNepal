"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartItem {
  contestant_id: string;
  votes: number;
}

interface CartData {
  [seasonId: string]: {
    items: CartItem[];
    expiry: number;
  };
}

interface CartContextType {
  cart: CartData;
  addToCart: (seasonId: string, contestant_id: string, votes: number) => void;
  removeFromCart: (seasonId: string, contestant_id: string) => void;
  updateVotes: (seasonId: string, contestant_id: string, votes: number) => void;
  clearCart: (seasonId?: string) => void;
  getCartItems: (seasonId: string) => CartItem[];
  getTotalPrice: (seasonId: string, pricePerVote?: number) => number;
  getTotalVotes: (seasonId: string) => number;
  isInCart: (seasonId: string, contestant_id: string) => boolean;
  filterEliminatedContestants: (seasonId: string, eliminatedContestantIds: string[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'voting_cart';
const CART_EXPIRY_HOURS = 24; // Cart expires after 24 hours

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartData>({});

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Clean expired carts
        const now = Date.now();
        const cleanedCart: CartData = {};

        Object.keys(parsedCart).forEach(seasonId => {
          if (parsedCart[seasonId].expiry > now) {
            cleanedCart[seasonId] = parsedCart[seasonId];
          }
        });

        setCart(cleanedCart);
        // Update localStorage with cleaned cart
        if (JSON.stringify(cleanedCart) !== JSON.stringify(parsedCart)) {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cleanedCart));
        }
      } catch (error: unknown) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (seasonId: string, contestant_id: string, votes: number) => {
    setCart(prevCart => {
      const now = Date.now();
      const expiry = now + (CART_EXPIRY_HOURS * 60 * 60 * 1000);

      const existingSeason = prevCart[seasonId];
      const existingItems = existingSeason?.items || [];

      // Check if contestant already exists in cart
      const existingItemIndex = existingItems.findIndex(item => item.contestant_id === contestant_id);

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = [...existingItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          votes: newItems[existingItemIndex].votes + votes
        };
      } else {
        // Add new item
        newItems = [...existingItems, {
          contestant_id,
          votes
        }];
      }

      return {
        ...prevCart,
        [seasonId]: {
          items: newItems,
          expiry
        }
      };
    });
  };

  const removeFromCart = (seasonId: string, contestant_id: string) => {
    setCart(prevCart => {
      const existingSeason = prevCart[seasonId];
      if (!existingSeason) return prevCart;

      const newItems = existingSeason.items.filter(item => item.contestant_id !== contestant_id);

      if (newItems.length === 0) {
        // Remove season if no items left
        const { [seasonId]: _omitted, ...rest } = prevCart;
        return rest;
      }

      return {
        ...prevCart,
        [seasonId]: {
          ...existingSeason,
          items: newItems
        }
      };
    });
  };

  const updateVotes = (seasonId: string, contestant_id: string, votes: number) => {
    setCart(prevCart => {
      const existingSeason = prevCart[seasonId];
      if (!existingSeason) return prevCart;

      const newItems = existingSeason.items.map(item =>
        item.contestant_id === contestant_id
          ? { ...item, votes }
          : item
      );

      return {
        ...prevCart,
        [seasonId]: {
          ...existingSeason,
          items: newItems
        }
      };
    });
  };

  const clearCart = (seasonId?: string) => {
    if (seasonId) {
      setCart(prevCart => {
        const { [seasonId]: _omitted, ...rest } = prevCart;
        return rest;
      });
    } else {
      setCart({});
    }
  };

  const getCartItems = (seasonId: string): CartItem[] => {
    return cart[seasonId]?.items || [];
  };

  const getTotalPrice = (seasonId: string, pricePerVote: number = 0): number => {
    const items = getCartItems(seasonId);
    return items.reduce((total, item) => {
      return total + (item.votes * pricePerVote);
    }, 0);
  };

  const getTotalVotes = (seasonId: string): number => {
    const items = getCartItems(seasonId);
    return items.reduce((total, item) => total + item.votes, 0);
  };

  const isInCart = (seasonId: string, contestant_id: string): boolean => {
    const items = getCartItems(seasonId);
    return items.some(item => item.contestant_id === contestant_id);
  };

  const filterEliminatedContestants = (seasonId: string, eliminatedContestantIds: string[]) => {
    setCart(prevCart => {
      const existingSeason = prevCart[seasonId];
      if (!existingSeason) return prevCart;

      const newItems = existingSeason.items.filter(item =>
        !eliminatedContestantIds.includes(item.contestant_id)
      );

      if (newItems.length === 0) {
        // Remove season if no items left
        const { [seasonId]: _omitted, ...rest } = prevCart;
        return rest;
      }

      return {
        ...prevCart,
        [seasonId]: {
          ...existingSeason,
          items: newItems
        }
      };
    });
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateVotes,
    clearCart,
    getCartItems,
    getTotalPrice,
    getTotalVotes,
    isInCart,
    filterEliminatedContestants
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
