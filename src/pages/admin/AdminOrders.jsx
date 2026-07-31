import React, { useState, useEffect } from 'react';
import { Search, Eye, X, MapPin, Calendar, CreditCard, Package, AlertCircle, ArrowLeft, MoreHorizontal, ShieldAlert, FileText, CheckCircle2, Check } from 'lucide-react';
import { useOrdersList, useUpdateOrder } from '../../queries/useOrders';
import { useSettingsContext } from '../../context/SettingsContext';

import { useSearchParams } from 'react-router-dom';

export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState('all');
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
  if (['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'ON_HOLD'].includes(activeTab)) {
    filters.status = activeTab;
  }
  if (search) filters.search = search;
  
  let orders = data?.data || [];
  if (Object.keys(filters).length > 0) {
    orders = orders.filter(o => {
      let matches = true;
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

  const exportToCSV = () => {
    if (!orders || orders.length === 0) {
      showToast("No orders to export");
      return;
    }

    const headers = ["Order ID", "Date", "Customer Name", "Customer Email", "Status", "Payment", "Total (INR)"];
    
    const rows = orders.map(o => {
      const date = new Date(o.createdAt).toLocaleDateString();
      const name = o.shippingAddress?.name ? `"${o.shippingAddress.name.replace(/"/g, '""')}"` : 'Guest';
      const email = o.userId || 'Guest'; // Fallback if no email
      return [
        o.id,
        date,
        name,
        email,
        o.status || 'PROCESSING',
        o.paymentStatus || 'pending',
        o.total || 0
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("CSV Exported successfully!");
  };

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

  const handlePrintPackingSlip = () => {
    if (!selectedOrder) return;
    
    const printWindow = window.open('', '_blank');
    const html = `
      <html>
        <head>
          <title>Packing Slip - ${selectedOrder.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 style="margin:0;">JOG & JOY</h1>
              <p style="margin:5px 0; color:#666;">Packing Slip</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin:0;">Order #${selectedOrder.id}</h2>
              <p style="margin:5px 0;">Date: ${new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h3>Ship To:</h3>
            <p style="margin:2px 0;"><strong>${selectedOrder.shippingAddress?.name || 'Customer'}</strong></p>
            <p style="margin:2px 0;">${selectedOrder.shippingAddress?.line1 || ''}</p>
            <p style="margin:2px 0;">${selectedOrder.shippingAddress?.city || ''}, ${selectedOrder.shippingAddress?.state || ''} ${selectedOrder.shippingAddress?.postalCode || ''}</p>
          </div>

          <table>
            <thead>
              <tr style="background:#f9fafb;">
                <th>Item</th>
                <th>SKU</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              ${(selectedOrder.items || []).map(item => `
                <tr>
                  <td>
                    <strong>${item.title || 'Product'}</strong><br/>
                    <small style="color:#666;">Variant: ${item.colorName || 'Standard'} | Size: ${item.size || 'Standard'}</small>
                  </td>
                  <td>${item.sku || '-'}</td>
                  <td>${item.quantity || 1}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
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
          <button onClick={() => setView('list')} className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-zinc-50 transition-colors">
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
            <button onClick={() => setShowRefundModal(true)} className="px-4 py-2 text-sm font-bold bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-zinc-50">Refund</button>
            <button 
              onClick={() => {
                setEditFormData(o.shippingAddress || {});
                setShowEditModal(true);
              }} 
              className="px-4 py-2 text-sm font-bold bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-zinc-50"
            >
              Edit
            </button>
            <div className="flex gap-2">
              <button onClick={handlePrintPackingSlip} className="px-4 py-2 bg-white border border-slate-200 text-primary-dark font-bold rounded-xl shadow-sm hover:bg-zinc-50 transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Print Packing Slip
              </button>
              {!['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(o.status) && (
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
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20">
                        <div className="p-1">
                          {['PROCESSING', 'SHIPPED', 'DELIVERED', 'ON_HOLD', 'CANCELLED'].filter(st => {
                            if (o.status === 'PROCESSING') return ['SHIPPED', 'ON_HOLD', 'CANCELLED'].includes(st);
                            if (o.status === 'ON_HOLD') return ['PROCESSING', 'SHIPPED', 'CANCELLED'].includes(st);
                            if (o.status === 'SHIPPED') return ['DELIVERED', 'CANCELLED'].includes(st);
                            return false;
                          }).map(st => (
                            <button key={st} onClick={() => handleStatusChange(st)} className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-zinc-50 rounded-lg">
                              Mark as {st.replace('_', ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Line Items */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-accent-green" /> Ordered Items ({o.items?.length || 0})
              </h2>
              <div className="space-y-4">
                {o.items?.map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-zinc-50 border border-slate-200 rounded-xl items-center">
                    <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex shrink-0 items-center justify-center text-xs font-bold text-zinc-300">IMG</div>
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
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-accent-green" /> Payment
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-text-secondary"><p>Subtotal</p><p>{formatCurrency(o.subtotal)}</p></div>
                {o.discountAmount > 0 && <div className="flex justify-between text-text-secondary"><p>Discount ({o.promotionCodeApplied})</p><p>-{formatCurrency(o.discountAmount)}</p></div>}
                <div className="flex justify-between text-text-secondary"><p>Shipping</p><p>{formatCurrency(o.shippingCost)}</p></div>
                <div className="flex justify-between text-text-secondary"><p>Tax</p><p>{formatCurrency(o.tax)}</p></div>
                <div className="border-t border-slate-200 mt-3 pt-3 flex justify-between font-bold text-lg text-primary-dark">
                  <p>Total</p><p>{formatCurrency(o.total)}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4">Timeline</h2>
              <div className="space-y-4">
                {o.statusHistory?.map((evt, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-slate-200">
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
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4">Customer</h2>
              <p className="font-bold text-primary-dark">{o.shippingAddress?.name || 'Customer'}</p>
              <p className="text-sm text-text-secondary">0 orders</p>
              
              <hr className="border-slate-200 my-4" />
              <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Contact</h3>
              <p className="text-sm text-primary-dark font-medium cursor-pointer hover:underline">customer@example.com</p>
              
              <hr className="border-slate-200 my-4" />
              <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">Shipping Address</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {o.shippingAddress?.line1}<br/>
                {o.shippingAddress?.city}, {o.shippingAddress?.state} {o.shippingAddress?.postalCode}<br/>
                {o.shippingAddress?.country}
              </p>
              
              <hr className="border-slate-200 my-4" />
              <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2 flex justify-between items-center">
                Tracking Information
                {o.shippingAddress?.trackingNumber && <CheckCircle2 className="w-3 h-3 text-accent-green" />}
              </h3>
              <div className="flex gap-2 mt-2">
                <input 
                  id="tracking-input"
                  type="text" 
                  placeholder="Enter tracking number..."
                  defaultValue={o.shippingAddress?.trackingNumber || ''}
                  className="w-full px-3 py-2 bg-zinc-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                />
                <button 
                  onClick={() => {
                    const val = document.getElementById('tracking-input').value;
                    if (val !== o.shippingAddress?.trackingNumber) {
                      const newShippingAddress = { ...(o.shippingAddress || {}), trackingNumber: val };
                      const newStatus = val && o.status === 'PROCESSING' ? 'SHIPPED' : o.status;
                      const historyEntry = { status: newStatus, timestamp: new Date().toISOString(), note: 'Tracking added via Admin' };
                      updateMut.mutate({ 
                        id: o.id, 
                        patch: { 
                          shippingAddress: newShippingAddress, 
                          ...(val && o.status === 'PROCESSING' ? { status: 'SHIPPED', statusHistory: [...(o.statusHistory || []), historyEntry] } : {}) 
                        } 
                      }, {
                        onSuccess: (updated) => {
                          setSelectedOrder(updated);
                          showToast('Tracking saved & order updated!');
                        }
                      });
                    }
                  }}
                  className="px-3 py-2 bg-primary-dark text-white text-sm font-bold rounded-lg hover:bg-primary-hover whitespace-nowrap"
                >
                  Save
                </button>
              </div>
              {o.shippingAddress?.trackingNumber && o.status !== 'DELIVERED' && o.status !== 'CANCELLED' && o.status !== 'REFUNDED' && (
                <button 
                  onClick={() => {
                    const historyEntry = { status: 'DELIVERED', timestamp: new Date().toISOString(), note: 'Marked delivered via Admin' };
                    updateMut.mutate({ id: o.id, patch: { status: 'DELIVERED', statusHistory: [...(o.statusHistory || []), historyEntry] } }, {
                      onSuccess: (updated) => {
                        setSelectedOrder(updated);
                        showToast('Order marked as Delivered!');
                      }
                    });
                  }}
                  className="w-full mt-3 px-3 py-2 bg-success/15 text-success-dark text-sm font-bold rounded-lg hover:bg-success/25 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark as Delivered
                </button>
              )}
            </div>

            {/* Tags & Risk */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3">Tags</h2>
              <input type="text" placeholder="Add a tag and press Enter..." onKeyDown={handleTagAdd} className="w-full px-3 py-2 bg-zinc-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-green-500 mb-2" />
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
              <div className="flex justify-between items-center p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-primary-dark">Edit Order Details</h2>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><X className="w-5 h-5 text-text-secondary" /></button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-1">Customer Name</label>
                  <input required type="text" value={editFormData.name || ''} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-1">Address</label>
                  <input required type="text" value={editFormData.line1 || ''} onChange={e => setEditFormData({...editFormData, line1: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-green-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-text-secondary mb-1">City</label>
                    <input required type="text" value={editFormData.city || ''} onChange={e => setEditFormData({...editFormData, city: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-secondary mb-1">State</label>
                    <input required type="text" value={editFormData.state || ''} onChange={e => setEditFormData({...editFormData, state: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-green-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary mb-1">Pincode</label>
                  <input required type="text" value={editFormData.postalCode || ''} onChange={e => setEditFormData({...editFormData, postalCode: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-green-500" />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 border border-slate-200 text-primary-dark font-bold rounded-xl hover:bg-zinc-50">Cancel</button>
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
                <button onClick={() => setShowRefundModal(false)} className="flex-1 py-2.5 border border-slate-200 text-primary-dark font-bold rounded-xl hover:bg-zinc-50">Cancel</button>
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

  // Summary Metrics
  const allOrders = data?.data || [];
  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(o => o.status === 'PROCESSING' || o.status === 'PENDING').length;
  const shippedOrders = allOrders.filter(o => o.status === 'SHIPPED').length;
  const totalRevenue = allOrders
    .filter(o => o.status !== 'CANCELLED' && o.status !== 'REFUNDED')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // LIST VIEW
  return (
    <div className="w-full animate-in fade-in duration-300 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] text-accent-green font-bold uppercase tracking-widest font-mono">Operations</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark mt-0.5">Orders</h1>
          <p className="text-xs text-text-secondary mt-1">Lifecycle, fulfillment, and returns</p>
        </div>
        <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-primary-dark font-bold rounded-xl shadow-sm hover:bg-zinc-50 transition-colors">
          <FileText className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Orders</p>
          <p className="text-3xl font-extrabold text-primary-dark">{totalOrders}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Processing</p>
          <p className="text-3xl font-extrabold text-warning-dark">{pendingOrders}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Shipped</p>
          <p className="text-3xl font-extrabold text-info-dark">{shippedOrders}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Revenue</p>
          <p className="text-3xl font-extrabold text-accent-green">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
        <div className="flex-1 overflow-hidden">
          <div className="flex overflow-x-auto w-full hide-scrollbar gap-2">
            {[
              { id: 'all', label: 'All' },
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
                    ? 'bg-white border border-slate-200 shadow-sm text-primary-dark' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-zinc-100/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-green-500 text-sm transition-colors"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-100">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-zinc-400 font-semibold">Loading orders...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50/80 text-text-secondary font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest whitespace-nowrap">Payment</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-widest whitespace-nowrap">Total</th>
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
                      <td className="px-6 py-4">
                        <p className="font-bold text-primary-dark group-hover:text-accent-green transition-colors">{order.id}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{order.items?.length || 0} items</p>
                      </td>
                      <td className="px-6 py-4 text-text-secondary font-medium">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-primary-dark">{order.shippingAddress?.name || 'Guest'}</p>
                        <p className="text-xs text-text-secondary">{order.shippingAddress?.city || 'Unknown'}</p>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        {['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status) ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                            order.status === 'DELIVERED' ? 'bg-success/15 text-success-dark' : 'bg-error/10 text-error'
                          }`}>
                            {order.status === 'DELIVERED' && <CheckCircle2 className="w-3 h-3" />}
                            {order.status}
                          </span>
                        ) : (
                          <div className="relative inline-block">
                            <select
                              value={order.status || 'PROCESSING'}
                              onChange={(e) => {
                                const newStatus = e.target.value;
                                const historyEntry = { status: newStatus, timestamp: new Date().toISOString(), note: 'Status updated by admin via table' };
                                updateMut.mutate({ 
                                  id: order.id, 
                                  patch: { 
                                    status: newStatus,
                                    statusHistory: [...(order.statusHistory || []), historyEntry]
                                  } 
                                }, {
                                  onSuccess: () => showToast(`Order ${order.id} marked as ${newStatus}`)
                                });
                              }}
                              className={`inline-flex items-center px-2.5 py-1.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider cursor-pointer border-none outline-none focus:ring-2 focus:ring-accent-green/50 pr-6 ${
                                order.status === 'SHIPPED' ? 'bg-info/15 text-info-dark' : 'bg-warning/15 text-warning-dark'
                              }`}
                            >
                              {(order.status === 'PROCESSING' || order.status === 'ON_HOLD') && <option value="PROCESSING">Processing</option>}
                              {(order.status === 'PROCESSING' || order.status === 'ON_HOLD') && <option value="ON_HOLD">On Hold</option>}
                              
                              {(order.status === 'PROCESSING' || order.status === 'ON_HOLD' || order.status === 'SHIPPED') && <option value="SHIPPED">Shipped</option>}
                              {(order.status === 'SHIPPED') && <option value="DELIVERED">Delivered</option>}
                              
                              <option value="CANCELLED">Cancelled</option>
                              {order.status === 'SHIPPED' && <option value="REFUNDED">Refunded</option>}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
                              <svg className="h-3 w-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                          order.paymentStatus === 'paid' ? 'bg-success/15 text-success-dark' : 'bg-warning/15 text-warning-dark'
                        }`}>
                          {order.paymentStatus === 'paid' && <CheckCircle2 className="w-3 h-3" />}
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-primary-dark">{formatCurrency(order.total)}</td>
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
