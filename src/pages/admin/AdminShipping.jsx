import React, { useState } from 'react';
import { Truck, MapPin, Box, Settings, Search, FileText, Globe, Link } from 'lucide-react';
import { useOrdersList, useUpdateOrder } from '../../queries/useOrders';
import { useSettingsContext } from '../../context/SettingsContext';

export default function AdminShipping() {
  const [activeTab, setActiveTab] = useState('queue');
  const [search, setSearch] = useState('');
  const { formatCurrency, formatDate } = useSettingsContext();

  const { data, isLoading } = useOrdersList({ fulfillmentStatus: 'unfulfilled' });
  let pendingOrders = data?.data || [];

  if (search) {
    const q = search.toLowerCase();
    pendingOrders = pendingOrders.filter(o => 
      (o.orderNumber || o.id).toLowerCase().includes(q) || 
      (o.shippingAddress?.name || '').toLowerCase().includes(q)
    );
  }

  const updateMut = useUpdateOrder();

  const handleMarkShipped = (orderId) => {
    updateMut.mutate({
      id: orderId,
      patch: { 
        fulfillmentStatus: 'fulfilled', 
        status: 'SHIPPED', 
        trackingId: `AWB${Math.floor(Math.random() * 1000000)}`, 
        carrier: 'Delhivery' 
      }
    });
  };

  const tabs = [
    { id: 'queue', icon: <Truck className="w-4 h-4" />, label: 'Fulfillment Queue' }
  ];

  return (
    <div className="w-full animate-in fade-in duration-300 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] text-accent-green font-bold uppercase tracking-widest font-mono">Operations</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark mt-0.5">Shipping</h1>
          <p className="text-xs text-text-secondary mt-1">Fulfillment, rates, and carriers</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 bg-zinc-50/50 border-r border-border p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-3 ${
                activeTab === tab.id ? 'bg-white border border-border shadow-sm text-primary-dark' : 'text-text-secondary hover:bg-zinc-100/50 hover:text-text-primary'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-accent-green' : ''}>{tab.icon}</span>
              {tab.label}
              {tab.id === 'queue' && pendingOrders.length > 0 && (
                <span className="ml-auto bg-primary-dark text-white text-[10px] px-2 py-0.5 rounded-full">{pendingOrders.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-center border-b border-border bg-white p-4 gap-4">
                <h2 className="text-lg font-bold text-primary-dark">Ready to Pack & Ship</h2>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search by order or name..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-zinc-50 focus:outline-none focus:bg-white focus:border-accent-green text-sm transition-colors"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto min-h-[400px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64 text-zinc-400 font-semibold">Loading queue...</div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50/80 text-text-secondary font-semibold border-b border-border text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Order</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Items</th>
                        <th className="px-6 py-4">Destination</th>
                        <th className="px-6 py-4">Age</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {pendingOrders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-12 text-center text-text-secondary">
                            <Box className="w-8 h-8 mx-auto mb-3 opacity-20" />
                            <p className="font-bold text-primary-dark">No orders pending shipment.</p>
                          </td>
                        </tr>
                      ) : (
                        pendingOrders.map((order) => {
                          const ageHours = Math.floor((new Date() - new Date(order.createdAt)) / (1000 * 60 * 60));
                          return (
                            <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors group">
                              <td className="px-6 py-4 font-bold text-primary-dark">{order.orderNumber || order.id}</td>
                              <td className="px-6 py-4 font-medium text-primary-dark">{order.shippingAddress?.name || 'Customer'}</td>
                              <td className="px-6 py-4 text-text-secondary">{order.items?.length || 0} items</td>
                              <td className="px-6 py-4 text-text-secondary">{order.shippingAddress?.city}, {order.shippingAddress?.country}</td>
                              <td className="px-6 py-4">
                                <span className={`font-bold ${ageHours > 48 ? 'text-error' : ageHours > 24 ? 'text-warning-dark' : 'text-primary-dark'}`}>
                                  {ageHours} hrs
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => handleMarkShipped(order.id)}
                                  disabled={updateMut.isPending}
                                  className="px-4 py-2 bg-primary-dark text-white rounded-lg font-bold text-sm hover:bg-primary-hover shadow-sm disabled:opacity-50 whitespace-nowrap"
                                >
                                  Pack & Ship
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                )}
              </div>
        </div>
      </div>
    </div>
  );
}
