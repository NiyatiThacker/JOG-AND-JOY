import React, { useState, useEffect } from 'react';
import { Search, Eye, X, MapPin, Calendar, CreditCard, Package, AlertCircle, ArrowLeft, MoreHorizontal, ShieldAlert, FileText, CheckCircle2, Check } from 'lucide-react';
import { useOrdersList, useUpdateOrder } from '../../queries/useOrders';
import { useSettingsContext } from '../../context/SettingsContext';

import { useSearchParams } from 'react-router-dom';

export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState('unfulfilled');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [searchParams] = useSearchParams();
  
  const { formatCurrency, formatDate } = useSettingsContext();

  const { data, isLoading } = useOrdersList({ pageSize: 1000 });
  
  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam && data?.data && view === 'list') {
      const target = data.data.find(o => o.id === orderIdParam || o.orderNumber === orderIdParam);
      if (target) {
        setSelectedOrder(target);
        setView('detail');
      }
    }
  }, [searchParams, data, view]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const filters = {};
  if (activeTab === 'unfulfilled') filters.fulfillmentStatus = 'unfulfilled';
  if (['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'ON_HOLD'].includes(activeTab)) {
    filters.status = activeTab;
  }
  if (search) filters.search = search;
  
  let orders = data?.data || [];
  if (Object.keys(filters).length > 0) {
    orders = orders.filter(o => {
      let matches = true;
      if (filters.fulfillmentStatus && o.fulfillmentStatus !== filters.fulfillmentStatus) matches = false;
      if (filters.status && o.status !== filters.status) matches = false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!JSON.stringify(o).toLowerCase().includes(q)) matches = false;
      }
      return matches;
    });
  }

  const updateMut = useUpdateOrder();

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setView('detail');
  };

  const showToast = (msg) => setToastMessage(msg);

  const handleStatusChange = (newStatus) => {
    if (selectedOrder) {
      const historyEntry = { status: newStatus, timestamp: new Date().toISOString(), note: 'Status updated by admin' };
      
      updateMut.mutate({ 
        id: selectedOrder.id, 
        patch: { 
          status: newStatus,
          statusHistory: [...(selectedOrder.statusHistory || []), historyEntry]
        } 
      }, {
        onSuccess: (updated) => {
          setSelectedOrder(updated);
          setIsMenuOpen(false);
          showToast(`Order marked as ${newStatus}`);
        }
      });
    }
  };

  const executeRefund = () => {
    if (selectedOrder) {
      const historyEntry = { status: 'REFUNDED', timestamp: new Date().toISOString(), note: 'Order refunded by admin' };
      updateMut.mutate({
        id: selectedOrder.id,
        patch: {
          paymentStatus: 'refunded',
          status: 'REFUNDED',
          statusHistory: [...(selectedOrder.statusHistory || []), historyEntry]
        }
      }, {
        onSuccess: (updated) => {
          setSelectedOrder(updated);
          setShowRefundModal(false);
          showToast('Order refunded successfully');
        }
      });
    }
  };



  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (selectedOrder) {
      updateMut.mutate({
        id: selectedOrder.id,
        patch: {
          shippingAddress: {
            ...selectedOrder.shippingAddress,
            ...editFormData
          }
        }
      }, {
        onSuccess: (updated) => {
          setSelectedOrder(updated);
          setShowEditModal(false);
          showToast('Order details updated');
        }
      });
    }
  };


  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      const newTag = e.target.value.trim();
      const currentTags = selectedOrder.tags || [];
      if (!currentTags.includes(newTag)) {
        updateMut.mutate({
          id: selectedOrder.id,
          patch: { tags: [...currentTags, newTag] }
        }, {
          onSuccess: (updated) => setSelectedOrder(updated)
        });
      }
      e.target.value = '';
    }
  };

  if (view === 'detail' && selectedOrder) {
    const o = selectedOrder;
    return (
      <div className="w-full max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setView('list')} className="p-2 bg-white rounded-lg border border-border hover:bg-zinc-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-500" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-primary-dark">{o.orderNumber || o.id}</h1>
              <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md ${
                o.status === 'DELIVERED' ? 'bg-success/15 text-success-dark' : 
                o.status === 'SHIPPED' ? 'bg-info/15 text-info-dark' : 
                o.status === 'CANCELLED' ? 'bg-error/10 text-error' : 
                o.status === 'ON_HOLD' ? 'bg-warning/15 text-warning-dark' : 'bg-zinc-200 text-zinc-600'
              }`}>
                {o.status.replace('_', ' ')}
              </span>
              <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md ${
                o.paymentStatus === 'paid' ? 'bg-success/15 text-success-dark' : 'bg-warning/15 text-warning-dark'
              }`}>
                {o.paymentStatus}
              </span>
            </div>
            <p className="text-sm text-text-secondary mt-1">{formatDate(o.createdAt)} from {o.channel?.replace('_', ' ')}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setShowRefundModal(true)} className="px-4 py-2 text-sm font-bold bg-white border border-border rounded-xl shadow-sm hover:bg-zinc-50">Refund</button>
            <button 
              onClick={() => {
                setEditFormData(o.shippingAddress || {});
                setShowEditModal(true);
              }} 
              className="px-4 py-2 text-sm font-bold bg-white border border-border rounded-xl shadow-sm hover:bg-zinc-50"
            >
              Edit
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 bg-primary-dark text-white rounded-xl shadow-sm hover:bg-primary-hover"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-xl shadow-lg z-20">
                    <div className="p-1">
                      {['PROCESSING', 'SHIPPED', 'DELIVERED', 'ON_HOLD', 'CANCELLED'].map(st => (
                        <button key={st} onClick={() => handleStatusChange(st)} className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-zinc-50 rounded-lg">
                          Mark as {st.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Line Items */}
            <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-accent-green" /> Ordered Items ({o.items?.length || 0})
              </h2>
              <div className="space-y-4">
                {o.items?.map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-zinc-50 border border-border rounded-xl items-center">
                    <div className="w-12 h-12 bg-white rounded-lg border border-border flex shrink-0 items-center justify-center text-xs font-bold text-zinc-300">IMG</div>
                    <div className="flex-1">
                      <p className="font-bold text-primary-dark">{item.titleSnapshot}</p>
                      <p className="text-xs text-text-secondary font-mono mt-0.5">{formatCurrency(item.unitPrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary-dark">x{item.quantity}</p>
                      <p className="text-sm font-bold mt-0.5">{formatCurrency(item.unitPrice * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-accent-green" /> Payment
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-text-secondary"><p>Subtotal</p><p>{formatCurrency(o.subtotal)}</p></div>
                {o.discountAmount > 0 && <div className="flex justify-between text-text-secondary"><p>Discount ({o.promotionCodeApplied})</p><p>-{formatCurrency(o.discountAmount)}</p></div>}
                <div className="flex justify-between text-text-secondary"><p>Shipping</p><p>{formatCurrency(o.shippingCost)}</p></div>
                <div className="flex justify-between text-text-secondary"><p>Tax</p><p>{formatCurrency(o.tax)}</p></div>
                <div className="border-t border-border mt-3 pt-3 flex justify-between font-bold text-lg text-primary-dark">
                  <p>Total</p><p>{formatCurrency(o.total)}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4">Timeline</h2>
              <div className="space-y-4">
                {o.statusHistory?.map((evt, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-border">
                      <CheckCircle2 className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary-dark">{evt.note || `Status changed to ${evt.status}`}</p>
                      <p className="text-xs text-text-secondary">{formatDate(evt.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Customer */}
            <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4">Customer</h2>
              <p className="font-bold text-primary-dark">{o.shippingAddress?.name || 'Customer'}</p>
              <p className="text-sm text-text-secondary">0 orders</p>
              
              <hr className="border-border my-4" />
              <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Contact</h3>
              <p className="text-sm text-primary-dark font-medium cursor-pointer hover:underline">customer@example.com</p>
              
              <hr className="border-border my-4" />
              <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Shipping Address</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {o.shippingAddress?.line1}<br/>
                {o.shippingAddress?.city}, {o.shippingAddress?.state} {o.shippingAddress?.postalCode}<br/>
                {o.shippingAddress?.country}
              </p>
            </div>

            {/* Tags & Risk */}
            <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
              <h2 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3">Tags</h2>
              <input type="text" placeholder="Add a tag and press Enter..." onKeyDown={handleTagAdd} className="w-full px-3 py-2 bg-zinc-50 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-green mb-2" />
              <div className="flex flex-wrap gap-2">
                {o.tags?.map(t => <span key={t} className="px-2 py-1 bg-zinc-100 rounded text-xs font-bold text-text-secondary">{t}</span>)}
              </div>


            </div>
          </div>
        </div>


        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h2 className="text-xl font-bold text-primary-dark">Edit Order Details</h2>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><X className="w-5 h-5 text-text-secondary" /></button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-1">Customer Name</label>
                  <input required type="text" value={editFormData.name || ''} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-4 py-2 border border-border rounded-xl focus:outline-none focus:border-accent-green" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-1">Address</label>
                  <input required type="text" value={editFormData.line1 || ''} onChange={e => setEditFormData({...editFormData, line1: e.target.value})} className="w-full px-4 py-2 border border-border rounded-xl focus:outline-none focus:border-accent-green" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-text-secondary mb-1">City</label>
                    <input required type="text" value={editFormData.city || ''} onChange={e => setEditFormData({...editFormData, city: e.target.value})} className="w-full px-4 py-2 border border-border rounded-xl focus:outline-none focus:border-accent-green" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-secondary mb-1">State</label>
                    <input required type="text" value={editFormData.state || ''} onChange={e => setEditFormData({...editFormData, state: e.target.value})} className="w-full px-4 py-2 border border-border rounded-xl focus:outline-none focus:border-accent-green" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-1">Pincode</label>
                  <input required type="text" value={editFormData.postalCode || ''} onChange={e => setEditFormData({...editFormData, postalCode: e.target.value})} className="w-full px-4 py-2 border border-border rounded-xl focus:outline-none focus:border-accent-green" />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 border border-border text-primary-dark font-bold rounded-xl hover:bg-zinc-50">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-primary-dark text-white font-bold rounded-xl hover:bg-primary-hover">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Refund Modal */}
        {showRefundModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 p-6 text-center">
              <div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-primary-dark mb-2">Process Refund?</h2>
              <p className="text-sm text-text-secondary mb-6">Are you sure you want to refund this order? This action cannot be undone and will mark the order as cancelled.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowRefundModal(false)} className="flex-1 py-2.5 border border-border text-primary-dark font-bold rounded-xl hover:bg-zinc-50">Cancel</button>
                <button onClick={executeRefund} className="flex-1 py-2.5 bg-error text-white font-bold rounded-xl hover:bg-red-600">Refund</button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-4 right-4 bg-primary-dark text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 z-50">
            <CheckCircle2 className="w-5 h-5 text-accent-green" />
            <p className="text-sm font-bold">{toastMessage}</p>
          </div>
        )}

      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="w-full animate-in fade-in duration-300">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] text-accent-green font-bold uppercase tracking-widest font-mono">Operations</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark mt-0.5">Orders</h1>
          <p className="text-xs text-text-secondary mt-1">Lifecycle, fulfillment, and returns</p>
        </div>

      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-border bg-zinc-50/50 p-4 gap-4">
          <div className="flex overflow-x-auto w-full hide-scrollbar gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'unfulfilled', label: 'Unfulfilled' },
              { id: 'PROCESSING', label: 'Processing' },
              { id: 'SHIPPED', label: 'Shipped' },
              { id: 'DELIVERED', label: 'Delivered' },
              { id: 'CANCELLED', label: 'Cancelled' },
              { id: 'ON_HOLD', label: 'On Hold' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white border border-border shadow-sm text-primary-dark' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-zinc-100/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white focus:outline-none focus:border-accent-green text-sm transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-zinc-400 font-semibold">Loading orders...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50/80 text-text-secondary font-semibold border-b border-border text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Fulfillment</th>
                  <th className="px-6 py-4">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-text-secondary">
                      <FileText className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      <p className="font-bold text-primary-dark">No orders found</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} onClick={() => handleOpenDetail(order)} className="hover:bg-zinc-50/50 transition-colors cursor-pointer group">
                      <td className="px-6 py-4 font-bold text-primary-dark group-hover:text-accent-green">{order.orderNumber || order.id}</td>
                      <td className="px-6 py-4 text-text-secondary">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 font-medium text-primary-dark">{order.shippingAddress?.name || 'Customer'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                          order.paymentStatus === 'paid' ? 'bg-zinc-100 text-zinc-700' : 'bg-warning/15 text-warning-dark'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                          order.fulfillmentStatus === 'fulfilled' ? 'bg-zinc-100 text-zinc-700' : 
                          order.fulfillmentStatus === 'partial' ? 'bg-info/15 text-info-dark' : 'bg-warning/15 text-warning-dark'
                        }`}>
                          {order.fulfillmentStatus || 'unfulfilled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-primary-dark">{formatCurrency(order.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
