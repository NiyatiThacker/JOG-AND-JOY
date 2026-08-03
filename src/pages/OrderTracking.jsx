import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { get } from '../api/mockApi';

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter an Order ID.');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = await get('orders', orderId);
      
      if (!data) {
        setError('Order not found. Please check your Order ID.');
      } else {
        setOrder(data);
      }
    } catch (err) {
      // For mock purposes, if get throws an error (e.g. invalid UUID format or not found)
      setError('Order not found. Please verify your Order ID.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 1;
      case 'PROCESSING': return 2;
      case 'SHIPPED': return 3;
      case 'DELIVERED': return 4;
      case 'CANCELLED': return -1;
      default: return 1;
    }
  };

  const currentStep = order ? getStatusStep(order.status) : 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Track Your Order
          </h1>
          <p className="text-slate-500 font-medium">
            Enter your Order ID below to check the current status of your shipment.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-slate-100">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 mb-2">Order ID</label>
              <input
                type="text"
                placeholder="e.g. ORD-12345"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00]/20 transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 mb-2">Email (Optional)</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#ccff00] focus:ring-2 focus:ring-[#ccff00]/20 transition-all"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? <Clock className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                Track
              </button>
            </div>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 text-red-600 rounded-xl font-medium text-sm border border-red-100 mb-8"
            >
              {error}
            </motion.div>
          )}

          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-slate-100 pt-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-sm text-slate-500 font-semibold mb-1">Order #{order.id.substring(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-slate-400">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                    ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {currentStep > 0 ? (
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-100 md:-translate-x-1/2" />
                  
                  <div className="space-y-8 relative">
                    <StatusStep 
                      icon={Clock} 
                      title="Order Placed" 
                      desc="We have received your order." 
                      isCompleted={currentStep >= 1} 
                      isActive={currentStep === 1}
                    />
                    <StatusStep 
                      icon={Package} 
                      title="Processing" 
                      desc="Your order is being packed." 
                      isCompleted={currentStep >= 2} 
                      isActive={currentStep === 2}
                    />
                    <StatusStep 
                      icon={Truck} 
                      title="Shipped" 
                      desc="Your order is on the way." 
                      isCompleted={currentStep >= 3} 
                      isActive={currentStep === 3}
                    />
                    <StatusStep 
                      icon={CheckCircle} 
                      title="Delivered" 
                      desc="Your order has been delivered." 
                      isCompleted={currentStep >= 4} 
                      isActive={currentStep === 4}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-500 font-bold">This order has been cancelled.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusStep({ icon: Icon, title, desc, isCompleted, isActive }) {
  return (
    <div className={`flex items-start md:items-center md:justify-center md:text-center relative ${!isCompleted && !isActive ? 'opacity-40' : ''}`}>
      <div className="md:hidden w-12 flex-shrink-0" />
      <div className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white z-10 transition-colors
        ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-[#ccff00] text-slate-900' : 'bg-slate-200 text-slate-400'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="pl-16 md:pl-0 md:pt-16 w-full max-w-[200px] md:mx-auto">
        <h4 className={`font-bold text-sm ${isCompleted || isActive ? 'text-slate-900' : 'text-slate-500'}`}>{title}</h4>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}
