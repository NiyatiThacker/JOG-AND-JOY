import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function BottomNav({ onOpenProfile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartTotalCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Shop', path: '/products', icon: Grid },
    { label: 'Wishlist', path: '/wishlist', icon: Heart, badge: wishlistCount },
    { label: 'Bag', action: () => navigate('/cart'), icon: ShoppingBag, badge: cartTotalCount },
    { label: 'Profile', action: onOpenProfile, icon: User }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-100 py-2 px-3 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.path ? location.pathname === item.path : false;

          const content = (
            <div className="flex flex-col items-center justify-center py-1 relative">
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'text-[#EF4A45] scale-110' : 'text-slate-500'
                }`}
              />
              <span
                className={`text-[10px] font-extrabold mt-0.5 ${
                  isActive ? 'text-[#EF4A45]' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>

              {item.badge > 0 && (
                <span className="absolute -top-0.5 right-3 w-4 h-4 rounded-full bg-[#EF4A45] text-white text-[9px] font-black flex items-center justify-center border border-white">
                  {item.badge}
                </span>
              )}
            </div>
          );

          if (item.path) {
            return (
              <Link key={index} to={item.path}>
                {content}
              </Link>
            );
          }

          return (
            <button key={index} onClick={item.action} className="w-full">
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
}
