import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Package, MapPin, Heart, LogOut, CheckCircle2, ChevronRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function UserProfileModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'profile'
  const { wishlistCount } = useWishlist();
  const [orders, setOrders] = useState([]);

  React.useEffect(() => {
    if (isOpen) {
      const storedOrders = JSON.parse(localStorage.getItem('jj_orders') || '[]');
      setOrders(storedOrders);
    }
  }, [isOpen]);

  if (!isOpen) return null;



  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100 max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* User Profile Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#AEE6FF] to-[#E6D6FF] text-slate-900 font-black text-xl flex items-center justify-center border-2 border-white shadow-md">
              A
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Ananya Sharma</h3>
              <p className="text-xs text-slate-500 font-semibold">ananya.sharma@example.com • +91 98765 43210</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-100 mb-6 text-xs sm:text-sm font-extrabold text-slate-500 space-x-6">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'orders' ? 'border-[#EF4A45] text-[#EF4A45]' : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" /> My Orders ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'addresses' ? 'border-[#EF4A45] text-[#EF4A45]' : 'border-transparent hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4" /> Saved Addresses
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 flex items-center gap-1.5 transition-colors border-b-2 ${
                activeTab === 'profile' ? 'border-[#EF4A45] text-[#EF4A45]' : 'border-transparent hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" /> Account Info
            </button>
          </div>

          {/* Tab Contents */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#FFF8EC] border border-amber-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{order.id}</span>
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-white text-slate-700 shadow-xs">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 line-clamp-1">{order.items}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-amber-200/50 text-xs">
                      <span className="text-slate-500 font-semibold">Ordered: {order.date}</span>
                      <span className="font-black text-slate-900 text-sm">{order.total}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Package className="w-6 h-6 text-slate-400" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800">No orders yet</h4>
                  <p className="text-xs text-slate-500 mt-1">When you place an order, it will appear here.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-xs">Home Address</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#AEE6FF] text-slate-900">Default</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    Flat 402, Sunshine Heights, MG Road, Bandra West, Mumbai, Maharashtra - 400050
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                <span>Phone Number</span>
                <span className="text-slate-900">+91 98765 43210</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                <span>Saved Wishlist Items</span>
                <span className="text-slate-900">{wishlistCount} Products</span>
              </div>
              <button
                onClick={onClose}
                className="w-full mt-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-black flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
