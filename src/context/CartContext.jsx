import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePromotionsList } from '../queries/usePromotions';
import { useSettings } from '../queries/useSettings';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import ToastContainer from '../components/ui/ToastContainer';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync Cart to Supabase whenever it changes and user is logged in
  useEffect(() => {
    const syncToCloud = async () => {
      if (user?.id && !isSyncing) {
        await supabase.from('users').update({ cart }).eq('id', user.id);
      }
    };
    
    try {
      localStorage.setItem('kids_cart', JSON.stringify(cart));
    } catch {}
    
    syncToCloud();
  }, [cart, user?.id]);

  // Load and merge Cart from Supabase when user logs in
  useEffect(() => {
    const fetchAndMergeCart = async () => {
      if (!user?.id) {
        // User logged out, clear cart to prevent leakage
        setCart([]);
        localStorage.removeItem('kids_cart');
        return;
      }

      setIsSyncing(true);
      const { data, error } = await supabase
        .from('users')
        .select('cart')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        const remoteCart = data.cart || [];
        
        // Merge logic: Combine local cart (built while logged out) with remote cart
        setCart(prevLocal => {
          if (prevLocal.length === 0) return remoteCart;
          
          let merged = [...remoteCart];
          prevLocal.forEach(localItem => {
            const existingIdx = merged.findIndex(
              (item) => item.id === localItem.id && item.size === localItem.size && item.color === localItem.color
            );
            if (existingIdx > -1) {
               // If item exists in both, keep the highest quantity or sum them
               merged[existingIdx].quantity = Math.max(merged[existingIdx].quantity, localItem.quantity);
            } else {
               merged.push(localItem);
            }
          });
          
          // Save merged cart back to cloud immediately
          supabase.from('users').update({ cart: merged }).eq('id', user.id);
          return merged;
        });
      }
      setIsSyncing(false);
    };

    fetchAndMergeCart();
  }, [user?.id]);

  const showToast = (msg, type = 'success', description = '') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, msg, type, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };
  
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product, selectedSize = '4Y-5Y', selectedColor = '#AEE6FF') => {
    const rawPrice = product.price ?? 499;
    const numericPrice = typeof rawPrice === 'number'
      ? rawPrice
      : parseInt(String(rawPrice).replace(/[^0-9]/g, ''), 10) || 499;

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.id === product.id && item.size === selectedSize && item.color === selectedColor
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            category: product.category,
            price: rawPrice,
            numericPrice: numericPrice,
            image: product.image,
            size: selectedSize,
            color: selectedColor,
            quantity: 1
          }
        ];
      }
    });

    showToast(`Added ${product.name} to bag!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (id, size, color) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.size === size && item.color === color)));
  };

  const updateQuantity = (id, size, color, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id && item.size === size && item.color === color) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const { data: promosData } = usePromotionsList();
  const { data: settingsData } = useSettings();
  const settings = settingsData || {};
  const applyCoupon = (code) => {
    const promos = promosData?.data || [];
    const matchedPromo = promos.find(p => p.code?.toUpperCase() === code.trim().toUpperCase() && p.active === true);

    if (matchedPromo) {
      if (matchedPromo.discountType === 'percentage') {
        setAppliedCoupon({ code: matchedPromo.code, discountPercent: matchedPromo.value });
        showToast(`Coupon ${matchedPromo.code} applied! ${matchedPromo.value}% OFF`);
        return { success: true, message: `${matchedPromo.value}% discount applied!` };
      } else if (matchedPromo.discountType === 'fixed') {
        setAppliedCoupon({ code: matchedPromo.code, discountFixed: matchedPromo.value });
        showToast(`Coupon ${matchedPromo.code} applied! ₹${matchedPromo.value} OFF`);
        return { success: true, message: `₹${matchedPromo.value} discount applied!` };
      } else if (matchedPromo.discountType === 'free_shipping') {
        setAppliedCoupon({ code: matchedPromo.code, discountPercent: 0, freeShipping: true });
        showToast('Free shipping coupon applied!');
        return { success: true, message: 'Free shipping granted!' };
      }
    }

    return { success: false, message: 'Invalid or expired coupon code.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const clearCart = () => setCart([]);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.numericPrice * item.quantity, 0);
  
  const baseShippingRate = settings.baseShippingRate ?? 99;
  const freeShippingThreshold = settings.freeShippingThreshold ?? 999;
  const expressShippingRate = settings.expressShippingRate ?? 149;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = cartSubtotal * (appliedCoupon.discountPercent / 100);
    } else if (appliedCoupon.discountFixed) {
      discountAmount = Math.min(cartSubtotal, appliedCoupon.discountFixed);
    }
  }
  const shippingFee = cartSubtotal >= freeShippingThreshold || appliedCoupon?.freeShipping ? 0 : (cartSubtotal > 0 ? baseShippingRate : 0);
  const cartGrandTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotalCount,
        cartSubtotal,
        discountAmount,
        shippingFee,
        expressShippingRate,
        cartGrandTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        removeToast,
        showToast
      }}
    >
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} position="bottom-right" />
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
