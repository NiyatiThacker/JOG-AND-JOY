import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Package, MapPin, Heart, LogOut, CheckCircle2, ChevronRight, RotateCcw, Edit2, Save, Loader2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useOrdersList, useUpdateOrder } from '../../queries/useOrders';
import { useAuth } from '../../context/AuthContext';

export default function UserProfileModal({ isOpen, onClose }) {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'profile'
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', address: '' });
  const [isSaving, setIsSaving] = useState(false);
  const { wishlistCount } = useWishlist();
  const [orders, setOrders] = useState([]);
  
  // Use the actual logged-in user's ID to fetch orders
  const { data: ordersData, refetch } = useOrdersList(user ? { customerId: user.id } : {});
  const updateOrder = useUpdateOrder();

  React.useEffect(() => {
    if (isOpen && ordersData?.data) {
      const formattedOrders = ordersData.data.map(o => ({
        id: o.id,
        orderNumber: o.orderNumber || `#${o.id.substring(0,8).toUpperCase()}`,
        date: new Date(o.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        items: o.items || [],
        total: `₹${o.total}`,
        status: o.status,
        trackingId: o.trackingId,
        carrier: o.carrier,
        shippingAddress: o.shippingAddress,
        paymentStatus: o.paymentStatus || 'paid',
        paymentMethod: o.paymentMethod || 'online',
      }));
      setOrders(formattedOrders);
    }
  }, [isOpen, ordersData]);

  React.useEffect(() => {
    if (user) {
      setEditForm({ name: user.name || '', phone: user.phone || '', address: user.address || '' });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSaveProfile = async () => {
    if (!editForm.name?.trim()) {
      alert("Name is required.");
      return;
    }
    if (!editForm.phone?.trim() || editForm.phone.length !== 10) {
      alert("Valid 10-digit Phone Number is required.");
      return;
    }
    if (!editForm.address?.trim()) {
      alert("Address is required.");
      return;
    }
    if (editForm.name && !/^[A-Za-z\s]+$/.test(editForm.name)) {
      alert("Name can only contain letters and spaces.");
      return;
    }
    if (editForm.phone && !/^[0-9]{10}$/.test(editForm.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }
    setIsSaving(true);
    await updateUser({ name: editForm.name, phone: editForm.phone, address: editForm.address });
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleRequestReturn = async (orderId) => {
    if (window.confirm('Are you sure you want to request a return for this order?')) {
      await updateOrder.mutateAsync({
        id: orderId,
        patch: {
          status: 'RETURN_REQUESTED',
          statusHistory: [{ status: 'RETURN_REQUESTED', timestamp: new Date().toISOString(), note: 'Customer requested return' }]
        }
      });
      refetch();
    }
  };

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
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 shadow-sm border border-slate-200 text-xl font-black uppercase">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              {!isEditing ? (
                <>
                  <h3 className="text-xl font-black text-slate-900">
                    {user?.name || 'Jog & Joy Member'}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">{user?.email}</p>
                </>
              ) : (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value.replace(/[^A-Za-z\s]/g, '') }))}
                  className="text-xl font-black text-slate-900 bg-slate-50 border border-slate-200 rounded px-2 py-1 w-full focus:outline-none focus:border-[#EF4A45]"
                  placeholder="Your Name"
                />
              )}
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
                  <div key={i} className="p-5 rounded-3xl bg-[#FFF8EC] border border-amber-100 shadow-sm flex flex-col gap-3">
                    {/* Header: Order Number & Status */}
                    <div className="flex items-start justify-between border-b border-amber-200/50 pb-3">
                      <div>
                        <span className="text-sm font-black text-slate-900 block">{order.orderNumber}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5 block">Ordered: {order.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white text-slate-700 shadow-xs inline-block mb-1 border border-slate-100">
                          {order.status}
                        </span>
                        <span className="block text-sm font-black text-[#EF4A45]">{order.total}</span>
                      </div>
                    </div>
                    
                    {/* Items List */}
                    <div className="space-y-1.5 py-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs text-slate-700 font-semibold">
                           <span className="flex-1 truncate pr-4">
                             <span className="text-slate-400 mr-2">{item.quantity}x</span> 
                             {item.titleSnapshot || item.name || 'Item'}
                           </span>
                           <span className="font-bold">₹{item.unitPrice * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping & Payment Grid */}
                    <div className="bg-white/80 rounded-2xl p-4 text-xs grid grid-cols-2 gap-4 border border-white">
                       <div>
                          <p className="font-black text-slate-400 uppercase text-[9px] tracking-widest mb-1.5 flex items-center gap-1"><MapPin className="w-3 h-3"/> Shipping To</p>
                          <p className="font-bold text-slate-800 line-clamp-1">{order.shippingAddress?.name || user?.name || 'Customer'}</p>
                          <p className="text-slate-500 font-medium leading-tight mt-0.5 line-clamp-2">
                            {order.shippingAddress ? `${order.shippingAddress.line1}, ${order.shippingAddress.city}` : 'Standard Shipping'}
                          </p>
                       </div>
                       <div>
                          <p className="font-black text-slate-400 uppercase text-[9px] tracking-widest mb-1.5 flex items-center gap-1"><Package className="w-3 h-3"/> Payment</p>
                          <p className="font-bold text-slate-800">
                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'} 
                            <span className="text-slate-400 font-medium ml-1 capitalize">({order.paymentStatus})</span>
                          </p>
                       </div>
                    </div>
                    
                    {/* Order Status Timeline */}
                    <div className="mt-2 pt-4 border-t border-amber-200/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Order Status</p>
                      <div className="relative flex items-center justify-between px-2">
                        {/* Connecting Line */}
                        <div className="absolute left-4 right-4 top-[7px] h-0.5 bg-amber-100 z-0"></div>
                        <div className="absolute left-4 right-4 top-[7px] h-0.5 bg-[#EF4A45] z-0 transition-all duration-500" style={{ width: order.status === 'DELIVERED' ? '100%' : order.status === 'SHIPPED' ? '50%' : '0%' }}></div>
                        
                        {/* Processing Node */}
                        <div className="relative z-10 flex flex-col items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-[#EF4A45] ring-4 ring-red-50' : 'bg-amber-100'}`}>
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                          <span className={`text-[10px] font-black ${['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? 'text-slate-800' : 'text-slate-400'}`}>Processing</span>
                        </div>
                        
                        {/* Shipped Node */}
                        <div className="relative z-10 flex flex-col items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${['SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-[#EF4A45] ring-4 ring-red-50' : 'bg-amber-100'}`}>
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                          <span className={`text-[10px] font-black ${['SHIPPED', 'DELIVERED'].includes(order.status) ? 'text-slate-800' : 'text-slate-400'}`}>Shipped</span>
                        </div>
                        
                        {/* Delivered Node */}
                        <div className="relative z-10 flex flex-col items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${order.status === 'DELIVERED' ? 'bg-[#EF4A45] ring-4 ring-red-50' : 'bg-amber-100'}`}>
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          </div>
                          <span className={`text-[10px] font-black ${order.status === 'DELIVERED' ? 'text-slate-800' : 'text-slate-400'}`}>Delivered</span>
                        </div>
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {(order.trackingId || order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                      <div className="bg-white border border-amber-200 rounded-xl p-3 flex items-center gap-3 mt-1">
                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-[#EF4A45]" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Tracking Info</p>
                          <p className="text-xs font-black text-slate-800 leading-none mt-1.5">{order.carrier || 'Shipping Partner'}: {order.trackingId || 'Pending Tracking ID'}</p>
                        </div>
                      </div>
                    )}

                    {/* Footer Actions */}
                    {order.status === 'DELIVERED' && (
                      <div className="pt-2 flex justify-end">
                        <button onClick={() => handleRequestReturn(order.id)} className="flex items-center gap-1.5 text-xs text-[#EF4A45] hover:text-red-700 font-bold transition-colors bg-white px-3 py-1.5 rounded-lg border border-red-100 shadow-sm">
                          <RotateCcw className="w-3.5 h-3.5" /> Request Return
                        </button>
                      </div>
                    )}
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
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-extrabold text-slate-900 text-xs">Home Address</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#AEE6FF] text-slate-900">Default</span>
                  </div>
                  {!isEditing ? (
                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      {user?.address || 'No address provided yet.'}
                    </p>
                  ) : (
                    <textarea
                      value={editForm.address}
                      onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl p-2 focus:outline-none focus:border-[#EF4A45]"
                      rows={3}
                      placeholder="Enter your full address"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                <span>Phone Number</span>
                {!isEditing ? (
                  <span className="text-slate-900">{user?.phone || 'Not provided'}</span>
                ) : (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value.replace(/[^0-9]/g, '') }))}
                    className="text-slate-900 bg-white border border-slate-200 rounded px-2 py-1 w-1/2 focus:outline-none focus:border-[#EF4A45] text-right"
                    placeholder="Enter phone number"
                    maxLength={10}
                  />
                )}
              </div>
              <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                <span>Saved Wishlist Items</span>
                <span className="text-slate-900">{wishlistCount} Products</span>
              </div>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center gap-2 transition-colors"
                >
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="w-full mt-4 py-3 rounded-2xl bg-[#EF4A45] hover:bg-red-600 text-white font-black flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              )}

              <button
                onClick={async () => {
                  await logout();
                  onClose();
                }}
                className="w-full mt-2 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-black flex items-center justify-center gap-2 transition-colors"
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
