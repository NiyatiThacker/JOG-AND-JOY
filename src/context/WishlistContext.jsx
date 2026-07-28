import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migrate old string arrays to object arrays
        return parsed.map(item => typeof item === 'string' ? { id: item, size: null, color: null } : item);
      }
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kids_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const toggleWishlist = (productId, size = null, color = null) => {
    setWishlist((prev) => {
      const exists = prev.some(item => item.id === productId && item.size === size && item.color === color);
      if (exists) {
        return prev.filter(item => !(item.id === productId && item.size === size && item.color === color));
      } else {
        return [...prev, { id: productId, size, color }];
      }
    });
  };

  const clearWishlist = () => setWishlist([]);

  const isInWishlist = (productId, size = null, color = null) => {
    return wishlist.some(item => item.id === productId && item.size === size && item.color === color);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        clearWishlist,
        isInWishlist,
        wishlistCount: wishlist.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
