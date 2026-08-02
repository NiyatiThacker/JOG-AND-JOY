import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code: 'KIDS20', discountPercent: 20 }
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('kids_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const flyToCart = (event, imageUrl) => {
    if (!event || !imageUrl) return;
    try {
      const startRect = event.currentTarget.getBoundingClientRect();
      const desktopCart = document.getElementById('cart-icon-desktop');
      const mobileCart = document.getElementById('cart-icon-mobile');
      
      let targetEl = desktopCart;
      if (mobileCart && window.innerWidth < 768) {
         targetEl = mobileCart;
      }

      if (!targetEl) return;
      const targetRect = targetEl.getBoundingClientRect();

      const img = document.createElement('img');
      img.src = imageUrl;
      img.style.position = 'fixed';
      img.style.zIndex = '99999';
      img.style.left = `${startRect.left}px`;
      img.style.top = `${startRect.top}px`;
      img.style.width = `${startRect.width || 50}px`;
      img.style.height = `${startRect.height || 50}px`;
      img.style.objectFit = 'cover';
      img.style.borderRadius = '50%';
      img.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
      img.style.pointerEvents = 'none';
      img.style.transition = 'all 0.7s cubic-bezier(0.2, 1, 0.3, 1)';
      
      document.body.appendChild(img);

      // Trigger reflow
      img.getBoundingClientRect();

      img.style.left = `${targetRect.left + targetRect.width / 2 - 15}px`;
      img.style.top = `${targetRect.top + targetRect.height / 2 - 15}px`;
      img.style.width = '30px';
      img.style.height = '30px';
      img.style.opacity = '0.1';

      setTimeout(() => {
        if (document.body.contains(img)) document.body.removeChild(img);
        targetEl.style.transition = 'transform 0.2s ease-out';
        targetEl.style.transform = 'scale(1.2)';
        setTimeout(() => targetEl.style.transform = 'scale(1)', 200);
      }, 700);
    } catch (e) {
      console.warn("Fly animation failed", e);
    }
  };

  const addToCart = (product, selectedSize = '4Y-5Y', selectedColor = '#AEE6FF', event = null) => {
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

    if (event) {
      flyToCart(event, product.image);
    }
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

  const applyCoupon = (code) => {
    if (code.trim().toUpperCase() === 'KIDS20') {
      setAppliedCoupon({ code: 'KIDS20', discountPercent: 20 });
      showToast('Coupon KIDS20 applied! 20% OFF');
      return { success: true, message: '20% discount applied!' };
    } else if (code.trim().toUpperCase() === 'FREESHIP') {
      setAppliedCoupon({ code: 'FREESHIP', discountPercent: 0, freeShipping: true });
      showToast('Free shipping coupon applied!');
      return { success: true, message: 'Free shipping granted!' };
    } else {
      return { success: false, message: 'Invalid coupon code. Try KIDS20!' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const clearCart = () => setCart([]);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.numericPrice * item.quantity, 0);
  
  const discountAmount = appliedCoupon ? Math.round((cartSubtotal * (appliedCoupon.discountPercent || 0)) / 100) : 0;
  const shippingFee = cartSubtotal >= 999 || appliedCoupon?.freeShipping ? 0 : (cartSubtotal > 0 ? 99 : 0);
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
        cartGrandTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        toastMessage
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <span>✨ {toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
