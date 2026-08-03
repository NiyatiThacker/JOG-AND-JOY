import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  Lock,
  ShieldCheck,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  UserCircle
} from 'lucide-react';
import { useCreateOrder } from '../queries/useOrders';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartSubtotal, discountAmount, shippingFee, expressShippingRate, cartGrandTotal, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const { user, isAuthenticated } = useAuth();
  
  // Try to grab the modal trigger if it was provided via Outlet
  const outletContext = useOutletContext();
  const setIsProfileOpen = outletContext?.setIsProfileOpen || (() => {});

  const [step, setStep] = useState(1); // 1: Address | 2: Shipping | 3: Payment | 4: Order Confirmed
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    pincode: '',
    shippingMethod: 'express', // 'standard' | 'express'
    paymentMethod: 'upi' // 'upi' | 'card' | 'cod'
  });

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showManualAddress, setShowManualAddress] = useState(true);

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
      
      const addresses = user.addresses || (user.address ? [{ id: 'legacy-1', label: 'Home', line1: user.address, isDefault: true }] : []);
      if (addresses.length > 0) {
        const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
        setSelectedAddressId(defaultAddr.id);
        setShowManualAddress(false);
        setFormData(prev => ({
          ...prev,
          address: defaultAddr.line1,
          city: defaultAddr.city || '',
          state: defaultAddr.state || '',
          pincode: defaultAddr.postalCode || ''
        }));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || ''
      }));
    }
  }, [user]);

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid Email is required';
    if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Valid Phone is required';
    
    if (showManualAddress) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    } else if (!selectedAddressId) {
      newErrors.address = 'Please select a delivery address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSelect = (addr) => {
    setSelectedAddressId(addr.id);
    setShowManualAddress(false);
    setFormData(prev => ({
      ...prev,
      address: addr.line1,
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.postalCode || ''
    }));
    setErrors(prev => ({ ...prev, address: null, city: null, state: null, pincode: null }));
  };

  const handleContinueToShipping = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    const orderPayload = {
      orderNumber: `JJ-${Math.floor(Math.random() * 90000) + 10000}`,
      customerId: user?.id || null,
      createdAt: new Date().toISOString(),
      status: 'PROCESSING',
      paymentStatus: formData.paymentMethod === 'cod' ? 'pending' : 'paid',
      paymentMethod: formData.paymentMethod,
      fulfillmentStatus: 'unfulfilled',
      channel: 'Web Storefront',
      subtotal: cartSubtotal,
      discountAmount: discountAmount,
      shippingCost: formData.shippingMethod === 'express' ? shippingFee + expressShippingRate : shippingFee,
      tax: 0,
      total: formData.shippingMethod === 'express' ? cartGrandTotal + expressShippingRate : cartGrandTotal,
      items: cart.map(item => ({
        id: item.id,
        productId: item.id,
        titleSnapshot: item.name,
        unitPrice: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      })),
      shippingAddress: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        line1: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.pincode,
        country: 'India'
      },
      statusHistory: [
        { status: 'PROCESSING', timestamp: new Date().toISOString(), note: 'Order placed by customer' }
      ]
    };

    const newOrder = await createOrder.mutateAsync(orderPayload);
    const orderId = newOrder.orderNumber || newOrder.id;
    setCreatedOrderId(orderId);

    const localOrder = {
      id: `#${orderId}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: cart.map(item => `${item.name} (x${item.quantity})`).join(', '),
      total: `₹${cartGrandTotal}`,
      status: 'Placed 📦'
    };

    const existingOrders = JSON.parse(localStorage.getItem('jj_orders') || '[]');
    localStorage.setItem('jj_orders', JSON.stringify([localOrder, ...existingOrders]));

    setIsOrderPlaced(true);
    clearCart();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF8EC] py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto shadow-sm">
            <UserCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Login Required</h2>
          <p className="text-xs text-slate-500 font-semibold pb-4 leading-relaxed">
            To ensure the security of your order and to sync your cart, please log in or create an account to proceed with checkout.
          </p>
          <button
            onClick={() => setIsProfileOpen(true)}
            className="block w-full py-3.5 rounded-full bg-slate-900 text-white font-extrabold text-xs shadow-md hover:bg-slate-800 transition-colors"
          >
            Log In / Create Account
          </button>
        </div>
      </div>
    );
  }

  if (!isOrderPlaced && cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFF8EC] py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-sm">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 font-semibold pb-4">
            You need to add some products to your cart before you can checkout.
          </p>
          <Link
            to="/products"
            className="block w-full py-3.5 rounded-full bg-[#EF4A45] text-white font-extrabold text-xs shadow-md hover:bg-red-600 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-[#FFF8EC] py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Order Confirmed! 🎉</h2>
          <p className="text-xs text-slate-600 font-bold leading-relaxed">
            Thank you for shopping with Jog & Joy Kids! Order <strong>#{createdOrderId || 'JJ-94821'}</strong> has been placed successfully. A confirmation SMS & email have been sent to <strong>{formData.email}</strong>.
          </p>
          <div className="p-4 bg-amber-50 rounded-2xl text-xs font-semibold text-slate-700 text-left space-y-1 border border-amber-100">
            <div className="flex justify-between">
              <span>Delivery Address:</span>
              <span className="font-bold">{formData.city}, {formData.state}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery:</span>
              <span className="font-bold text-emerald-600">Within 3-4 Days</span>
            </div>
          </div>
          <Link
            to="/products"
            className="block w-full py-3.5 rounded-full bg-[#EF4A45] text-white font-extrabold text-xs shadow-md hover:bg-red-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EC] py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Checkout Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-black text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" /> Secure Multi-Step Checkout
          </h1>
        </div>



        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form Columns */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Section 1: Contact & Delivery Address */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <MapPin className="w-5 h-5 text-[#EF4A45]" /> 1. Contact & Delivery
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                <div>
                  <label className="block mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border ${errors.fullName ? 'border-red-500' : 'border-slate-200 focus:ring-1 focus:ring-[#EF4A45]'} font-bold focus:outline-none`}
                  />
                  {errors.fullName && <p className="text-red-500 text-[10px] mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200 focus:ring-1 focus:ring-[#EF4A45]'} font-bold focus:outline-none`}
                  />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border ${errors.phone ? 'border-red-500' : 'border-slate-200 focus:ring-1 focus:ring-[#EF4A45]'} font-bold focus:outline-none`}
                  />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Saved Addresses Section */}
              {user && (user.addresses?.length > 0 || user.address) && (
                <div className="pt-4 border-t border-slate-100 mt-6">
                  <h4 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center justify-between">
                    Saved Addresses
                    {!showManualAddress && (
                      <button type="button" onClick={() => setShowManualAddress(true)} className="text-[10px] text-[#EF4A45] hover:underline uppercase tracking-wider">
                        + Enter New Address
                      </button>
                    )}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {(user.addresses || [{ id: 'legacy-1', label: 'Home', line1: user.address, isDefault: true }]).map(addr => (
                      <div 
                        key={addr.id}
                        onClick={() => handleAddressSelect(addr)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id && !showManualAddress ? 'border-[#EF4A45] bg-red-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-extrabold text-slate-900 text-sm">{addr.label}</span>
                          {addr.isDefault && <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-white text-slate-700 shadow-sm border border-slate-100">DEFAULT</span>}
                        </div>
                        <p className="text-xs text-slate-600 font-medium line-clamp-2">
                          {addr.line1}, {addr.city} {addr.postalCode}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual Address Form */}
              {(showManualAddress || (!user || (!user.addresses?.length && !user.address))) && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  {user && (user.addresses?.length > 0 || user.address) && (
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                      <h4 className="text-sm font-extrabold text-slate-800">Enter New Address</h4>
                      <button type="button" onClick={() => setShowManualAddress(false)} className="text-[10px] text-slate-500 hover:text-slate-700 uppercase tracking-wider font-bold">
                        Cancel
                      </button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                    <div>
                      <label className="block mb-1">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border ${errors.pincode ? 'border-red-500' : 'border-slate-200 focus:ring-1 focus:ring-[#EF4A45]'} font-bold focus:outline-none`}
                      />
                      {errors.pincode && <p className="text-red-500 text-[10px] mt-1">{errors.pincode}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block mb-1">Flat / House No / Street Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border ${errors.address ? 'border-red-500' : 'border-slate-200 focus:ring-1 focus:ring-[#EF4A45]'} font-bold focus:outline-none`}
                      />
                      {errors.address && <p className="text-red-500 text-[10px] mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="block mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border ${errors.city ? 'border-red-500' : 'border-slate-200 focus:ring-1 focus:ring-[#EF4A45]'} font-bold focus:outline-none`}
                      />
                      {errors.city && <p className="text-red-500 text-[10px] mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border ${errors.state ? 'border-red-500' : 'border-slate-200 focus:ring-1 focus:ring-[#EF4A45]'} font-bold focus:outline-none`}
                      />
                      {errors.state && <p className="text-red-500 text-[10px] mt-1">{errors.state}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Shipping Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Truck className="w-5 h-5 text-sky-500" /> 2. Delivery Method
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setFormData({ ...formData, shippingMethod: 'standard' })}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.shippingMethod === 'standard' ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-500/30' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.shippingMethod === 'standard' ? 'border-sky-500' : 'border-slate-300'}`}>
                      {formData.shippingMethod === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Standard Delivery</h4>
                      <p className="text-xs text-slate-500 font-medium">Delivery in 4-6 business days</p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900 text-sm">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </label>

                <label
                  onClick={() => setFormData({ ...formData, shippingMethod: 'express' })}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.shippingMethod === 'express' ? 'border-[#EF4A45] bg-red-50/50 ring-2 ring-[#EF4A45]/30' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.shippingMethod === 'express' ? 'border-[#EF4A45]' : 'border-slate-300'}`}>
                      {formData.shippingMethod === 'express' && <div className="w-2.5 h-2.5 rounded-full bg-[#EF4A45]" />}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                        Priority Express <span className="bg-amber-400 text-white text-[9px] px-1.5 py-0.5 rounded-md">FAST</span>
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">Delivery in 1-2 business days</p>
                    </div>
                  </div>
                  <span className="font-black text-[#EF4A45] text-sm">+₹{expressShippingRate}</span>
                </label>
              </div>
            </div>

            {/* Section 3: Payment Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <CreditCard className="w-5 h-5 text-emerald-500" /> 3. Payment
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'upi' ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/30' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'upi' ? 'border-emerald-500' : 'border-slate-300'}`}>
                      {formData.paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Instant UPI / Cards</h4>
                      <p className="text-xs text-slate-500 font-medium">GPay, PhonePe, Paytm, Visa, Mastercard</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">Secure</span>
                </label>

                <label
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/30' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'border-emerald-500' : 'border-slate-300'}`}>
                      {formData.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Cash On Delivery</h4>
                      <p className="text-xs text-slate-500 font-medium">Pay cash upon parcel arrival</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShoppingBag className="w-4 h-4 text-[#EF4A45]" /> Order Summary ({cart.length} items)
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border shrink-0" />
                      <span className="truncate">{item.name} (x{item.quantity})</span>
                    </div>
                    <span className="font-black text-slate-900 shrink-0">₹{item.numericPrice * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs font-bold text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-black">₹{cartSubtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-extrabold">
                    <span>Discount Applied</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="text-slate-900 font-black">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                {formData.shippingMethod === 'express' && (
                  <div className="flex justify-between">
                    <span>Priority Express</span>
                    <span className="text-[#EF4A45] font-black">+₹{expressShippingRate}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-100 text-base font-black text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-[#EF4A45]">₹{formData.shippingMethod === 'express' ? cartGrandTotal + expressShippingRate : cartGrandTotal}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (validateStep1()) {
                    handlePlaceOrder();
                  }
                }}
                className="w-full mt-4 py-4 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-xl hover:scale-102 transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-5 h-5" /> Pay & Place Order (₹{formData.shippingMethod === 'express' ? cartGrandTotal + expressShippingRate : cartGrandTotal})
              </button>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-[11px] font-bold text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" /> 100% Buyer Protection & Money Back Guarantee
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
