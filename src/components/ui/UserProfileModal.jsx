import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Package, MapPin, User, Edit2, 
  LogOut, Plus, Mail, Calendar, 
  Smartphone, ChevronRight, ChevronLeft, ChevronDown, Lock, Check,
  Loader2, ShieldCheck, Sparkles, ArrowRight
} from 'lucide-react';
import CustomDropdown from './CustomDropdown';

export default function UserProfileModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'profile'
  const [orders, setOrders] = useState([]);
  
  // Profile State
  const [profileData, setProfileData] = useState({
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98765 43210',
    birthday: '1990-10-14',
    gender: 'Female'
  });

  const [draftData, setDraftData] = useState(profileData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Custom Dropdown & Calendar Popover states
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Date picker month & year navigation state
  const [calendarMonth, setCalendarMonth] = useState(9); // 0-indexed (9 = Oct)
  const [calendarYear, setCalendarYear] = useState(1990);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Address Management State
  const defaultAddresses = [
    {
      id: 'addr-1',
      type: 'Home',
      name: 'Ananya Sharma',
      street: 'Flat 402, Sunshine Heights, MG Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      isDefault: true
    }
  ];

  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('jj_addresses');
    return saved ? JSON.parse(saved) : defaultAddresses;
  });

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    type: 'Home',
    name: 'Ananya Sharma',
    street: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  const [addressErrors, setAddressErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      const storedOrders = JSON.parse(localStorage.getItem('jj_orders') || '[]');
      setOrders(storedOrders);
      setIsEditing(false);
      setShowPasswordModal(false);
      setShowAddressModal(false);
      setIsGenderOpen(false);
      setIsCalendarOpen(false);
      setErrors({});
      setPasswordErrors({});
      setAddressErrors({});
    }
  }, [isOpen]);

  const saveAddressesToStorage = (newAddresses) => {
    setAddresses(newAddresses);
    localStorage.setItem('jj_addresses', JSON.stringify(newAddresses));
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressFormData({
      type: 'Home',
      name: profileData.fullName || 'Ananya Sharma',
      street: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: addresses.length === 0
    });
    setAddressErrors({});
    setShowAddressModal(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressFormData({
      type: addr.type || 'Home',
      name: addr.name || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      isDefault: !!addr.isDefault
    });
    setAddressErrors({});
    setShowAddressModal(true);
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter(a => a.id !== id);
    if (updated.length > 0 && !updated.some(a => a.isDefault)) {
      updated[0].isDefault = true;
    }
    saveAddressesToStorage(updated);
    triggerToast('Address deleted successfully');
  };

  const validateAddressForm = () => {
    const errs = {};
    if (!addressFormData.name.trim()) errs.name = 'Recipient name is required';
    if (!addressFormData.street.trim()) errs.street = 'Street address is required';
    if (!addressFormData.city.trim()) errs.city = 'City is required';
    if (!addressFormData.state.trim()) errs.state = 'State is required';
    if (!addressFormData.pincode.trim()) {
      errs.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(addressFormData.pincode.trim())) {
      errs.pincode = 'Pincode must be 6 digits';
    }

    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!validateAddressForm()) return;

    let newAddresses = [...addresses];

    if (addressFormData.isDefault) {
      newAddresses = newAddresses.map(a => ({ ...a, isDefault: false }));
    }

    if (editingAddressId) {
      newAddresses = newAddresses.map(a => {
        if (a.id === editingAddressId) {
          return {
            ...a,
            ...addressFormData,
            id: editingAddressId
          };
        }
        return a;
      });
      triggerToast('Address updated successfully');
    } else {
      const newAddr = {
        id: 'addr-' + Date.now(),
        ...addressFormData
      };
      newAddresses.push(newAddr);
      triggerToast('New address added successfully');
    }

    saveAddressesToStorage(newAddresses);
    setShowAddressModal(false);
  };

  useEffect(() => {
    if (draftData.birthday) {
      const parts = draftData.birthday.split('-');
      if (parts.length === 3) {
        setCalendarYear(parseInt(parts[0], 10) || 1990);
        setCalendarMonth((parseInt(parts[1], 10) - 1) || 0);
      }
    }
  }, [draftData.birthday, isCalendarOpen]);

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'Select date';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${day} ${months[monthIdx] || ''} ${year}`;
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleStartEdit = () => {
    setDraftData({ ...profileData });
    setErrors({});
    setIsGenderOpen(false);
    setIsCalendarOpen(false);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraftData({ ...profileData });
    setErrors({});
    setIsGenderOpen(false);
    setIsCalendarOpen(false);
    setIsEditing(false);
  };

  const validateProfileForm = () => {
    const newErrors = {};
    if (!draftData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!draftData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draftData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!draftData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (draftData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }
    if (!draftData.birthday) {
      newErrors.birthday = 'Birthday is required';
    }
    if (!draftData.gender) {
      newErrors.gender = 'Gender selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();
    if (!validateProfileForm()) return;

    setIsSaving(true);
    setTimeout(() => {
      setProfileData({ ...draftData });
      setIsSaving(false);
      setIsEditing(false);
      triggerToast('Profile updated successfully');
    }, 600);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const pErrors = {};
    if (!passwordData.currentPassword) {
      pErrors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      pErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      pErrors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(pErrors);
    if (Object.keys(pErrors).length > 0) return;

    setIsSavingPassword(true);
    setTimeout(() => {
      setIsSavingPassword(false);
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      triggerToast('Password changed successfully');
    }, 600);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-[8px]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Floating Success Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] bg-slate-900/95 text-white px-6 py-3.5 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.2)] flex items-center gap-3 border border-slate-700/60 backdrop-blur-md"
            >
              <div className="w-7 h-7 rounded-full bg-[#8DD67C] flex items-center justify-center text-slate-900 flex-shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full sm:w-[760px] md:w-[820px] bg-[#FFFDF9] rounded-t-3xl sm:rounded-[24px] overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-[#ECECEC]"
        >
          {/* Header Section (Sticky) */}
          <div className="sticky top-0 bg-[#FFFDF9]/95 backdrop-blur-md z-20 px-4 sm:px-8 pt-5 sm:pt-8 pb-4 border-b border-[#ECECEC]">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100/90 hover:bg-[#FFF3EE] text-slate-600 flex items-center justify-center transition-all duration-200 hover:rotate-90 hover:scale-105 hover:text-[#FF7A59] z-30"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Profile Avatar & Details Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-10 sm:pr-12">
              <div className="flex items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
                <div className="relative group shrink-0">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#FF7A59] to-[#FFD5A1] flex items-center justify-center border-2 sm:border-4 border-white shadow-md transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,122,89,0.4)] group-hover:scale-105">
                    <User className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
                  </div>
                </div>
                
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-2xl lg:text-[28px] font-bold text-slate-900 tracking-tight leading-tight truncate">
                    {profileData.fullName}
                  </h2>
                  <p className="text-xs sm:text-base font-semibold text-slate-500 mt-0.5">Welcome back 👋</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1.5 text-xs sm:text-[14px] text-slate-500 font-medium truncate">
                    <span className="flex items-center gap-1.5 truncate"><Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {profileData.email}</span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {profileData.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Responsive Equal 3-Column Grid) */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 mt-4 sm:mt-6 w-full bg-slate-100/80 p-1.5 rounded-2xl">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2.5 w-full z-10
                      ${isActive ? 'text-[#FF7A59] bg-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}
                    `}
                  >
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Main Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#FFFDF9] scroll-smooth">
            
            {/* 1. ORDERS TAB */}
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="py-4"
              >
                {orders.length > 0 ? (
                  <div className="space-y-5">
                    {orders.map((order, i) => (
                      <div key={i} className="p-5 rounded-[20px] bg-white border border-[#ECECEC] shadow-xs hover:shadow-md transition-all duration-300 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900">{order.id}</span>
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#8DD67C]/10 text-green-700">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-600 line-clamp-1">{order.items}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-sm">
                          <span className="text-slate-500 font-medium">Ordered: {order.date}</span>
                          <span className="font-bold text-slate-900">{order.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-12 sm:py-16">
                    {/* Empty Package Illustration */}
                    <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FFF3EE] to-[#FFD5A1]/40 animate-pulse" />
                      <div className="relative w-20 h-20 rounded-full bg-white border-2 border-[#FFE8DE] flex items-center justify-center text-[#FF7A59] shadow-sm">
                        <Package className="w-10 h-10 stroke-[1.5]" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No orders yet</h3>
                    <p className="text-[16px] text-slate-500 mb-8 max-w-sm font-medium leading-relaxed">
                      Start shopping our latest collection!
                    </p>
                    
                    <button 
                      onClick={onClose}
                      className="px-8 py-3.5 bg-gradient-to-r from-[#FF7A59] to-[#FF9075] text-white rounded-full font-bold text-[16px] shadow-[0_8px_20px_rgba(255,122,89,0.3)] hover:shadow-[0_12px_25px_rgba(255,122,89,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center gap-2"
                    >
                      Shop Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* 2. ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5 py-2"
              >
                {addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.id}
                        className="p-5 sm:p-6 rounded-[24px] bg-white border border-[#ECECEC] shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative"
                      >
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#FFF3EE] flex items-center justify-center flex-shrink-0 text-[#FF7A59]">
                            <MapPin className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-[18px] font-bold text-slate-900">{addr.type}</h4>
                              {addr.isDefault && (
                                <span className="px-2.5 py-0.5 rounded-md bg-[#A7D8FF]/20 text-[#0066B2] text-[11px] font-bold uppercase tracking-wider">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[15px] font-semibold text-slate-700 mb-0.5">{addr.name}</p>
                            <p className="text-[14px] text-slate-500 font-medium leading-relaxed max-w-md">
                              {addr.street},<br />
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-3 pl-16 sm:pl-0">
                          <button 
                            onClick={() => handleOpenEditAddress(addr)}
                            className="text-sm font-bold text-slate-500 hover:text-[#FF7A59] transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-sm font-bold text-rose-400 hover:text-rose-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500 font-medium mb-4">No saved addresses found.</p>
                  </div>
                )}

                <button 
                  onClick={handleOpenAddAddress}
                  className="w-full p-6 rounded-[24px] border-2 border-dashed border-[#ECECEC] bg-white hover:border-[#FF7A59] hover:bg-[#FFF3EE]/30 transition-all duration-300 group flex items-center justify-center gap-3 hover:-translate-y-0.5"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-[#FF7A59] group-hover:text-white text-slate-400 transition-all duration-300 flex items-center justify-center group-hover:rotate-90">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-[16px] font-bold text-slate-600 group-hover:text-[#FF7A59] transition-colors">
                    Add New Address
                  </span>
                </button>
              </motion.div>
            )}

            {/* 3. PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-8 py-2"
              >
                {/* Personal Information Card */}
                <div className="bg-white rounded-[24px] border border-[#ECECEC] p-6 sm:p-8 shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FFF3EE] text-[#FF7A59] flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Personal Information</h3>
                        <p className="text-xs font-semibold text-slate-400">Update your account personal details</p>
                      </div>
                    </div>

                    {!isEditing && (
                      <button 
                        onClick={handleStartEdit}
                        className="text-xs font-bold text-[#FF7A59] bg-[#FFF3EE] px-3.5 py-1.5 rounded-full hover:bg-[#FF7A59] hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                    )}
                  </div>

                  {/* Form Fields */}
                  <form onSubmit={handleSaveProfile} className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          disabled={!isEditing}
                          value={isEditing ? draftData.fullName : profileData.fullName}
                          onChange={(e) => setDraftData({ ...draftData, fullName: e.target.value })}
                          placeholder="Enter your full name"
                          className={`w-full px-4 py-3.5 rounded-2xl border-2 font-semibold text-[15px] transition-all duration-300 focus:outline-none ${
                            isEditing 
                              ? 'bg-white border-slate-200 text-slate-900 focus:border-[#FF7A59] focus:ring-4 focus:ring-[#FF7A59]/15 shadow-xs' 
                              : 'bg-slate-50/70 border-transparent text-slate-800 cursor-default'
                          } ${errors.fullName ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15' : ''}`}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                      </div>
                      {errors.fullName && <p className="mt-1.5 text-xs font-bold text-rose-500 flex items-center gap-1">⚠️ {errors.fullName}</p>}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          disabled={!isEditing}
                          value={isEditing ? draftData.email : profileData.email}
                          onChange={(e) => setDraftData({ ...draftData, email: e.target.value })}
                          placeholder="Enter your email address"
                          className={`w-full px-4 py-3.5 rounded-2xl border-2 font-semibold text-[15px] transition-all duration-300 focus:outline-none ${
                            isEditing 
                              ? 'bg-white border-slate-200 text-slate-900 focus:border-[#FF7A59] focus:ring-4 focus:ring-[#FF7A59]/15 shadow-xs' 
                              : 'bg-slate-50/70 border-transparent text-slate-800 cursor-default'
                          } ${errors.email ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15' : ''}`}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                      </div>
                      {errors.email && <p className="mt-1.5 text-xs font-bold text-rose-500 flex items-center gap-1">⚠️ {errors.email}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          disabled={!isEditing}
                          value={isEditing ? draftData.phone : profileData.phone}
                          onChange={(e) => setDraftData({ ...draftData, phone: e.target.value })}
                          placeholder="Enter your phone number"
                          className={`w-full px-4 py-3.5 rounded-2xl border-2 font-semibold text-[15px] transition-all duration-300 focus:outline-none ${
                            isEditing 
                              ? 'bg-white border-slate-200 text-slate-900 focus:border-[#FF7A59] focus:ring-4 focus:ring-[#FF7A59]/15 shadow-xs' 
                              : 'bg-slate-50/70 border-transparent text-slate-800 cursor-default'
                          } ${errors.phone ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15' : ''}`}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Smartphone className="w-4 h-4" />
                        </div>
                      </div>
                      {errors.phone && <p className="mt-1.5 text-xs font-bold text-rose-500 flex items-center gap-1">⚠️ {errors.phone}</p>}
                    </div>

                    {/* Birthday & Gender Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Birthday Field */}
                      <div className="relative">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Birthday
                        </label>
                        
                        <div
                          onClick={() => {
                            if (isEditing) {
                              setIsCalendarOpen(!isCalendarOpen);
                              setIsGenderOpen(false);
                            }
                          }}
                          className={`w-full px-4 py-3.5 rounded-2xl border-2 font-semibold text-[15px] flex items-center justify-between transition-all duration-300 ${
                            isEditing 
                              ? 'bg-white border-slate-200 text-slate-900 cursor-pointer hover:border-[#FF7A59]/60 shadow-xs' 
                              : 'bg-slate-50/70 border-transparent text-slate-800 cursor-default'
                          } ${isCalendarOpen ? 'border-[#FF7A59] ring-4 ring-[#FF7A59]/15 shadow-md' : ''} ${
                            errors.birthday ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15' : ''
                          }`}
                        >
                          <span className={draftData.birthday ? 'text-slate-900' : 'text-slate-400'}>
                            {formatDisplayDate(isEditing ? draftData.birthday : profileData.birthday)}
                          </span>
                          <Calendar className={`w-4.5 h-4.5 transition-colors ${isCalendarOpen ? 'text-[#FF7A59]' : 'text-slate-400'}`} />
                        </div>

                        {/* Custom Theme Calendar Popover */}
                        <AnimatePresence>
                          {isEditing && isCalendarOpen && (
                            <>
                              {/* Backdrop overlay */}
                              <div 
                                className="fixed inset-0 z-30" 
                                onClick={() => setIsCalendarOpen(false)} 
                              />
                              
                              <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className="absolute top-full left-0 right-0 sm:right-auto sm:w-[320px] mt-2.5 z-40 bg-[#FFFDF9] rounded-[24px] border border-[#ECECEC] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.15)] space-y-4"
                              >
                                {/* Calendar Header */}
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (calendarMonth === 0) {
                                        setCalendarMonth(11);
                                        setCalendarYear(prev => prev - 1);
                                      } else {
                                        setCalendarMonth(prev => prev - 1);
                                      }
                                    }}
                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#FFF3EE] hover:text-[#FF7A59] text-slate-600 flex items-center justify-center transition-colors"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </button>

                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-slate-900 text-sm">
                                      {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][calendarMonth]}
                                    </span>
                                    
                                    <CustomDropdown
                                      options={Array.from({ length: 90 }, (_, i) => 2026 - i).map(y => ({ label: String(y), value: y }))}
                                      value={calendarYear}
                                      onChange={(val) => setCalendarYear(Number(val))}
                                      buttonClassName="py-1 px-3 bg-[#FFF3EE] border-[#FFE0D6] rounded-full text-xs font-black text-[#FF7A59]"
                                    />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (calendarMonth === 11) {
                                        setCalendarMonth(0);
                                        setCalendarYear(prev => prev + 1);
                                      } else {
                                        setCalendarMonth(prev => prev + 1);
                                      }
                                    }}
                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#FFF3EE] hover:text-[#FF7A59] text-slate-600 flex items-center justify-center transition-colors"
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>

                                {/* Days of Week Header */}
                                <div className="grid grid-cols-7 gap-1 text-center">
                                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
                                    <span key={i} className="text-[11px] font-bold text-slate-400 uppercase">
                                      {day}
                                    </span>
                                  ))}
                                </div>

                                {/* Days Grid */}
                                <div className="grid grid-cols-7 gap-1 text-center">
                                  {Array.from({ length: new Date(calendarYear, calendarMonth, 1).getDay() }).map((_, i) => (
                                    <div key={`blank-${i}`} className="w-8 h-8" />
                                  ))}

                                  {Array.from({ length: new Date(calendarYear, calendarMonth + 1, 0).getDate() }).map((_, i) => {
                                    const dayNum = i + 1;
                                    const formattedCurrent = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                                    const isSelected = draftData.birthday === formattedCurrent;

                                    return (
                                      <button
                                        key={dayNum}
                                        type="button"
                                        onClick={() => {
                                          setDraftData({ ...draftData, birthday: formattedCurrent });
                                          setIsCalendarOpen(false);
                                        }}
                                        className={`w-8 h-8 rounded-full mx-auto text-xs font-bold transition-all duration-150 flex items-center justify-center ${
                                          isSelected
                                            ? 'bg-[#FF7A59] text-white shadow-[0_4px_12px_rgba(255,122,89,0.4)] scale-110'
                                            : 'hover:bg-[#FFF3EE] hover:text-[#FF7A59] text-slate-700'
                                        }`}
                                      >
                                        {dayNum}
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Quick Actions */}
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const today = new Date();
                                      const year = today.getFullYear();
                                      const month = String(today.getMonth() + 1).padStart(2, '0');
                                      const day = String(today.getDate()).padStart(2, '0');
                                      setDraftData({ ...draftData, birthday: `${year}-${month}-${day}` });
                                      setIsCalendarOpen(false);
                                    }}
                                    className="font-bold text-[#FF7A59] hover:underline"
                                  >
                                    Today
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setIsCalendarOpen(false)}
                                    className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
                                  >
                                    Done
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>

                        {errors.birthday && <p className="mt-1.5 text-xs font-bold text-rose-500 flex items-center gap-1">⚠️ {errors.birthday}</p>}
                      </div>

                      {/* Gender Field */}
                      <div className="relative">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Gender
                        </label>
                        
                        <div
                          onClick={() => {
                            if (isEditing) {
                              setIsGenderOpen(!isGenderOpen);
                              setIsCalendarOpen(false);
                            }
                          }}
                          className={`w-full px-4 py-3.5 rounded-2xl border-2 font-semibold text-[15px] flex items-center justify-between transition-all duration-300 ${
                            isEditing 
                              ? 'bg-white border-slate-200 text-slate-900 cursor-pointer hover:border-[#FF7A59]/60 shadow-xs' 
                              : 'bg-slate-50/70 border-transparent text-slate-800 cursor-default'
                          } ${isGenderOpen ? 'border-[#FF7A59] ring-4 ring-[#FF7A59]/15 shadow-md' : ''} ${
                            errors.gender ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15' : ''
                          }`}
                        >
                          <span>{isEditing ? draftData.gender : profileData.gender}</span>
                          <ChevronDown className={`w-4.5 h-4.5 transition-transform duration-200 ${isGenderOpen ? 'rotate-180 text-[#FF7A59]' : 'text-slate-400'}`} />
                        </div>

                        {/* Custom Theme Dropdown Menu */}
                        <AnimatePresence>
                          {isEditing && isGenderOpen && (
                            <>
                              {/* Backdrop overlay */}
                              <div 
                                className="fixed inset-0 z-30" 
                                onClick={() => setIsGenderOpen(false)} 
                              />
                              
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                transition={{ duration: 0.18, ease: 'easeOut' }}
                                className="absolute top-full left-0 right-0 mt-2 z-40 bg-[#FFFDF9] rounded-[20px] border border-[#ECECEC] p-2 shadow-[0_15px_35px_rgba(0,0,0,0.12)] space-y-1"
                              >
                                {['Female', 'Male', 'Non-binary', 'Prefer not to say'].map((option) => {
                                  const isSelected = draftData.gender === option;
                                  return (
                                    <button
                                      key={option}
                                      type="button"
                                      onClick={() => {
                                        setDraftData({ ...draftData, gender: option });
                                        setIsGenderOpen(false);
                                      }}
                                      className={`w-full px-4 py-3 rounded-xl font-semibold text-[15px] flex items-center justify-between transition-colors duration-150 ${
                                        isSelected 
                                          ? 'bg-[#FFF3EE] text-[#FF7A59] font-bold shadow-xs' 
                                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                      }`}
                                    >
                                      <span>{option}</span>
                                      {isSelected && <Check className="w-4 h-4 stroke-[3] text-[#FF7A59]" />}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>

                        {errors.gender && <p className="mt-1.5 text-xs font-bold text-rose-500 flex items-center gap-1">⚠️ {errors.gender}</p>}
                      </div>
                    </div>

                    {/* Buttons Below Form (When editing) */}
                    {isEditing && (
                      <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="px-8 py-3.5 bg-gradient-to-r from-[#FF7A59] to-[#FF9075] text-white rounded-full font-bold text-[15px] shadow-[0_8px_20px_rgba(255,122,89,0.3)] hover:shadow-[0_12px_25px_rgba(255,122,89,0.4)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 stroke-[3]" /> Save Changes
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-full font-bold text-[15px] hover:bg-slate-200 transition-colors duration-200 disabled:opacity-70"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </form>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-slate-200/80 my-8" />

                {/* Security Section */}
                <div className="bg-white rounded-[24px] border border-[#ECECEC] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[18px] font-bold text-slate-900">Security</h4>
                      <p className="text-xs font-semibold text-slate-400">Manage your password & login security</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-6 py-3 rounded-full bg-slate-900 text-white hover:bg-slate-800 font-bold text-sm shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 self-start sm:self-center"
                  >
                    🔒 Change Password
                  </button>
                </div>

                {/* Sign Out Action */}
                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl font-bold text-[15px] text-slate-400 flex items-center justify-center gap-2 hover:text-rose-500 hover:bg-rose-50/50 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </motion.div>
            )}

          </div>
        </motion.div>

        {/* Change Password Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md bg-[#FFFDF9] rounded-[24px] p-6 sm:p-8 shadow-2xl border border-[#ECECEC] relative"
              >
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
                  aria-label="Close password modal"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF3EE] text-[#FF7A59] flex items-center justify-center">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Change Password</h3>
                    <p className="text-xs font-semibold text-slate-400">Keep your account secure</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className={`w-full px-4 py-3 rounded-2xl border-2 bg-white text-slate-900 font-semibold text-sm transition-all focus:border-[#FF7A59] focus:ring-4 focus:ring-[#FF7A59]/15 focus:outline-none ${
                        passwordErrors.currentPassword ? 'border-rose-400' : 'border-slate-200'
                      }`}
                      placeholder="••••••••"
                    />
                    {passwordErrors.currentPassword && <p className="text-xs font-bold text-rose-500 mt-1">⚠️ {passwordErrors.currentPassword}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className={`w-full px-4 py-3 rounded-2xl border-2 bg-white text-slate-900 font-semibold text-sm transition-all focus:border-[#FF7A59] focus:ring-4 focus:ring-[#FF7A59]/15 focus:outline-none ${
                        passwordErrors.newPassword ? 'border-rose-400' : 'border-slate-200'
                      }`}
                      placeholder="At least 6 characters"
                    />
                    {passwordErrors.newPassword && <p className="text-xs font-bold text-rose-500 mt-1">⚠️ {passwordErrors.newPassword}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className={`w-full px-4 py-3 rounded-2xl border-2 bg-white text-slate-900 font-semibold text-sm transition-all focus:border-[#FF7A59] focus:ring-4 focus:ring-[#FF7A59]/15 focus:outline-none ${
                        passwordErrors.confirmPassword ? 'border-rose-400' : 'border-slate-200'
                      }`}
                      placeholder="Re-enter new password"
                    />
                    {passwordErrors.confirmPassword && <p className="text-xs font-bold text-rose-500 mt-1">⚠️ {passwordErrors.confirmPassword}</p>}
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="flex-1 py-3.5 rounded-full font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingPassword}
                      className="flex-1 py-3.5 rounded-full font-bold text-sm bg-gradient-to-r from-[#FF7A59] to-[#FF9075] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      {isSavingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Add / Edit Address Modal */}
        <AnimatePresence>
          {showAddressModal && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-lg bg-[#FFFDF9] rounded-[24px] p-6 sm:p-8 shadow-2xl border border-[#ECECEC] relative max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
                  aria-label="Close address modal"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF3EE] text-[#FF7A59] flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {editingAddressId ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400">Save address for faster checkout</p>
                  </div>
                </div>

                <form onSubmit={handleSaveAddress} className="space-y-4">
                  {/* Address Type Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Address Type
                    </label>
                    <div className="flex items-center gap-3">
                      {['Home', 'Work', 'Other'].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setAddressFormData({ ...addressFormData, type: t })}
                          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all border-2 ${
                            addressFormData.type === t
                              ? 'border-[#FF7A59] bg-[#FFF3EE] text-[#FF7A59] shadow-xs'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {t === 'Home' ? '🏠 Home' : t === 'Work' ? '💼 Work' : '📍 Other'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Full Name / Recipient
                    </label>
                    <input
                      type="text"
                      value={addressFormData.name}
                      onChange={(e) => setAddressFormData({ ...addressFormData, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border-2 bg-white text-slate-900 font-semibold text-sm transition-all focus:border-[#FF7A59] focus:ring-4 focus:ring-[#FF7A59]/15 focus:outline-none ${
                        addressErrors.name ? 'border-rose-400' : 'border-slate-200'
                      }`}
                      placeholder="e.g. Ananya Sharma"
                    />
                    {addressErrors.name && <p className="text-xs font-bold text-rose-500 mt-1">⚠️ {addressErrors.name}</p>}
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Flat, House No, Street Address
                    </label>
                    <textarea
                      rows={2}
                      value={addressFormData.street}
                      onChange={(e) => setAddressFormData({ ...addressFormData, street: e.target.value })}
                      className={`w-full px-4 py-3 rounded-2xl border-2 bg-white text-slate-900 font-semibold text-sm transition-all focus:border-[#FF7A59] focus:ring-4 focus:ring-[#FF7A59]/15 focus:outline-none ${
                        addressErrors.street ? 'border-rose-400' : 'border-slate-200'
                      }`}
                      placeholder="e.g. Flat 402, Sunshine Heights, MG Road"
                    />
                    {addressErrors.street && <p className="text-xs font-bold text-rose-500 mt-1">⚠️ {addressErrors.street}</p>}
                  </div>

                  {/* City & State Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        value={addressFormData.city}
                        onChange={(e) => setAddressFormData({ ...addressFormData, city: e.target.value })}
                        className={`w-full px-4 py-3 rounded-2xl border-2 bg-white text-slate-900 font-semibold text-sm transition-all focus:border-[#FF7A59] focus:ring-4 focus:ring-[#FF7A59]/15 focus:outline-none ${
                          addressErrors.city ? 'border-rose-400' : 'border-slate-200'
                        }`}
                        placeholder="e.g. Mumbai"
                      />
                      {addressErrors.city && <p className="text-xs font-bold text-rose-500 mt-1">⚠️ {addressErrors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        State
                      </label>
                      <input
                        type="text"
                        value={addressFormData.state}
                        onChange={(e) => setAddressFormData({ ...addressFormData, state: e.target.value })}
                        className={`w-full px-4 py-3 rounded-2xl border-2 bg-white text-slate-900 font-semibold text-sm transition-all focus:border-[#FF7A59] focus:ring-4 focus:ring-[#FF7A59]/15 focus:outline-none ${
                          addressErrors.state ? 'border-rose-400' : 'border-slate-200'
                        }`}
                        placeholder="e.g. Maharashtra"
                      />
                      {addressErrors.state && <p className="text-xs font-bold text-rose-500 mt-1">⚠️ {addressErrors.state}</p>}
                    </div>
                  </div>

                  {/* Pincode & Default Checkbox */}
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Pincode
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={addressFormData.pincode}
                        onChange={(e) => setAddressFormData({ ...addressFormData, pincode: e.target.value })}
                        className={`w-full px-4 py-3 rounded-2xl border-2 bg-white text-slate-900 font-semibold text-sm transition-all focus:border-[#FF7A59] focus:ring-4 focus:ring-[#FF7A59]/15 focus:outline-none ${
                          addressErrors.pincode ? 'border-rose-400' : 'border-slate-200'
                        }`}
                        placeholder="400050"
                      />
                      {addressErrors.pincode && <p className="text-xs font-bold text-rose-500 mt-1">⚠️ {addressErrors.pincode}</p>}
                    </div>

                    <div className="pt-5">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addressFormData.isDefault}
                          onChange={(e) => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                          className="w-4 h-4 rounded text-[#FF7A59] focus:ring-[#FF7A59] cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-700">Set as default address</span>
                      </label>
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="flex-1 py-3.5 rounded-full font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 rounded-full font-bold text-sm bg-gradient-to-r from-[#FF7A59] to-[#FF9075] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all"
                    >
                      {editingAddressId ? 'Update Address' : 'Save Address'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </AnimatePresence>
  );
}
