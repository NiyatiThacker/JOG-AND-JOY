import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  ArrowLeft
} from 'lucide-react';
import { useCreateOrder } from '../queries/useOrders';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartSubtotal, discountAmount, shippingFee, cartGrandTotal, clearCart } = useCart();
  const createOrder = useCreateOrder();

  const [step, setStep] = useState(1); // 1: Address | 2: Shipping | 3: Payment | 4: Order Confirmed
  const [formData, setFormData] = useState({
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '9876543210',
    address: 'Flat 402, Sunshine Heights, MG Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    shippingMethod: 'express', // 'standard' | 'express'
    paymentMethod: 'upi' // 'upi' | 'card' | 'cod'
  });

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid Email is required';
    if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Valid Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      createdAt: new Date().toISOString(),
      status: 'PROCESSING',
      paymentStatus: formData.paymentMethod === 'cod' ? 'pending' : 'paid',
      fulfillmentStatus: 'unfulfilled',
      channel: 'Web Storefront',
      subtotal: cartSubtotal,
      discountAmount: discountAmount,
      shippingCost: shippingFee,
      tax: 0,
      total: cartGrandTotal,
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

        {/* Step Progress Stepper */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-8 max-w-2xl mx-auto grid grid-cols-3 gap-2 text-center text-xs font-black">
          <div className={`py-2 rounded-xl transition-colors ${step >= 1 ? 'bg-[#AEE6FF] text-slate-900' : 'bg-slate-100 text-slate-400'}`}>
            1. Address
          </div>
          <div className={`py-2 rounded-xl transition-colors ${step >= 2 ? 'bg-[#AEE6FF] text-slate-900' : 'bg-slate-100 text-slate-400'}`}>
            2. Shipping
          </div>
          <div className={`py-2 rounded-xl transition-colors ${step >= 3 ? 'bg-[#AEE6FF] text-slate-900' : 'bg-slate-100 text-slate-400'}`}>
            3. Payment
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form Columns */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#EF4A45]" /> Shipping Address
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                  <div>
                    <label className="block mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border ${errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#EF4A45]'} font-bold focus:outline-none`}
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
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#EF4A45]'} font-bold focus:outline-none`}
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
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#EF4A45]'} font-bold focus:outline-none`}
                    />
                    {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block mb-1">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border ${errors.pincode ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#EF4A45]'} font-bold focus:outline-none`}
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
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border ${errors.address ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#EF4A45]'} font-bold focus:outline-none`}
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
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border ${errors.city ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#EF4A45]'} font-bold focus:outline-none`}
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
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 border ${errors.state ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-[#EF4A45]'} font-bold focus:outline-none`}
                    />
                    {errors.state && <p className="text-red-500 text-[10px] mt-1">{errors.state}</p>}
                  </div>
                </div>

                <button
                  onClick={handleContinueToShipping}
                  className="w-full mt-4 py-3.5 rounded-full bg-[#EF4A45] text-white font-extrabold text-sm shadow-md hover:bg-red-600 transition-colors"
                >
                  Continue To Shipping →
                </button>
              </div>
            )}

            {/* Step 2: Shipping Method */}
            {step === 2 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-sky-600" /> Select Shipping Method
                </h3>

                <div className="space-y-3">
                  <label
                    onClick={() => setFormData({ ...formData, shippingMethod: 'express' })}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.shippingMethod === 'express' ? 'border-[#EF4A45] bg-red-50/50 ring-2 ring-[#EF4A45]/30' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Express Delivery (3-4 Days)</h4>
                      <p className="text-xs text-slate-500 font-medium">Free on orders over ₹999</p>
                    </div>
                    <span className="font-black text-slate-900 text-sm">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="w-2/3 py-3 rounded-full bg-[#EF4A45] text-white font-extrabold text-xs shadow-md hover:bg-red-600"
                  >
                    Continue To Payment →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" /> Choose Payment Option
                </h3>

                <div className="space-y-3">
                  <label
                    onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'upi' ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/30' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Instant UPI / GPay / PhonePe / Paytm</h4>
                      <p className="text-xs text-slate-500 font-medium">Fast & 100% Secure Instant Payment</p>
                    </div>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full">Recommended</span>
                  </label>

                  <label
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/30' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Credit / Debit Card</h4>
                      <p className="text-xs text-slate-500 font-medium">Visa, Mastercard, RuPay</p>
                    </div>
                  </label>

                  <label
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/30' : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Cash On Delivery (COD)</h4>
                      <p className="text-xs text-slate-500 font-medium">Pay cash upon parcel arrival</p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="w-1/3 py-3 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="w-2/3 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-xl hover:scale-102 transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-5 h-5" /> Pay & Place Order (₹{cartGrandTotal})
                  </button>
                </div>
              </div>
            )}

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
                  <span>Shipping Charges</span>
                  <span className="text-slate-900 font-black">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 text-base font-black text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-[#EF4A45]">₹{cartGrandTotal}</span>
                </div>
              </div>

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
