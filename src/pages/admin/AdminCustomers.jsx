import React, { useState, useMemo } from 'react';
import { useOrdersList } from '../../queries/useOrders';
import { Users, Search, ShoppingBag, ArrowUpRight, FileText, X, Mail, Phone, MapPin, Calendar, CheckCircle, Package } from 'lucide-react';
import { useSettingsContext } from '../../context/SettingsContext';
import { Link } from 'react-router-dom';

export default function AdminCustomers() {
  const { data, isLoading } = useOrdersList({ pageSize: 10000 });
  const { formatCurrency, formatDate } = useSettingsContext();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const customers = useMemo(() => {
    if (!data?.data) return [];
    const orders = data.data;
    const custMap = {};

    orders.forEach(o => {
      // Use robust fallback for customer identifier
      const customerId = o.customerInfo?.email || o.shippingAddress?.email || o.userId || o.shippingAddress?.phone || o.shippingAddress?.fullName || o.shippingAddress?.name || o.customerInfo?.name || o.id;
      if (!customerId) return;

      const displayEmail = o.customerInfo?.email || o.shippingAddress?.email || 'N/A';

      if (!custMap[customerId]) {
        custMap[customerId] = {
          id: customerId,
          name: o.shippingAddress?.name || o.shippingAddress?.fullName || o.customerInfo?.name || 'Guest',
          email: displayEmail,
          phone: o.shippingAddress?.phone || 'N/A',
          city: o.shippingAddress?.city || 'N/A',
          address: o.shippingAddress?.line1 || 'N/A',
          state: o.shippingAddress?.state || '',
          pincode: o.shippingAddress?.postalCode || '',
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: o.createdAt,
          orders: []
        };
      }

      const c = custMap[customerId];
      c.totalOrders += 1;
      if (o.status !== 'CANCELLED' && o.status !== 'REFUNDED') {
        c.totalSpent += (o.total || 0);
      }
      if (new Date(o.createdAt) > new Date(c.lastOrderDate)) {
        c.lastOrderDate = o.createdAt;
      }
      c.orders.push(o);
    });

    return Object.values(custMap).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [data]);

  const filteredCustomers = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const exportToCSV = () => {
    if (!filteredCustomers.length) return;
    const headers = ["Name", "Email", "Phone", "City", "Total Orders", "LTV (INR)", "Last Order Date"];
    const rows = filteredCustomers.map(c => [
      `"${c.name.replace(/"/g, '""')}"`,
      c.email,
      c.phone,
      `"${c.city.replace(/"/g, '""')}"`,
      c.totalOrders,
      c.totalSpent,
      new Date(c.lastOrderDate).toLocaleDateString()
    ].join(','));
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'DELIVERED': return 'bg-success/10 text-success-dark';
      case 'SHIPPED': return 'bg-info/10 text-info-dark';
      case 'CANCELLED': case 'REFUNDED': return 'bg-error/10 text-error';
      default: return 'bg-warning/10 text-warning-dark';
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-300 pb-12 text-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-dark">Customers</h1>
        </div>
        <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-text-dark font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors text-sm">
          <FileText className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
          <p className="font-bold text-zinc-500 mb-4">Total Customers</p>
          <p className="text-2xl font-black text-text-dark">{customers.length}</p>
        </div>
        <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
          <p className="font-bold text-zinc-500 mb-4">Average LTV</p>
          <p className="text-2xl font-black text-text-dark">
            {formatCurrency(customers.length ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length : 0)}
          </p>
        </div>
        <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-sm">
          <p className="font-bold text-zinc-500 mb-4">Repeat Rate</p>
          <p className="text-2xl font-black text-text-dark">
            {customers.length ? Math.round((customers.filter(c => c.totalOrders > 1).length / customers.length) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-zinc-50/50 flex justify-between items-center">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-text-dark focus:outline-none focus:border-slate-400 shadow-sm transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-zinc-400 font-semibold">Loading customers...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="border-b border-slate-100 text-xs font-bold text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium text-center">Orders</th>
                  <th className="px-5 py-3 font-medium">Lifetime Value</th>
                  <th className="px-5 py-3 font-medium">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-text-muted">
                      <Users className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      <p className="font-bold text-text-dark">No customers found</p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr 
                      key={c.id} 
                      onClick={() => setSelectedCustomer(c)}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-text-dark">{c.name}</p>
                        {c.totalOrders > 1 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 mt-1">
                            Repeat
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium">{c.email}</p>
                        <p className="text-xs text-text-muted">{c.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-text-muted text-sm">
                        {c.city}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                          {c.totalOrders}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-text-dark">
                        {formatCurrency(c.totalSpent)}
                      </td>
                      <td className="px-6 py-4 text-text-muted text-xs font-medium">
                        {new Date(c.lastOrderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric'})}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Customer Details Drawer Overlay */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-in fade-in" 
            onClick={() => setSelectedCustomer(null)}
          />
          
          {/* Drawer */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right flex flex-col border-l border-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-sm">
                  {selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">{selectedCustomer.name}</h2>
                  <p className="text-xs font-bold text-slate-500">{selectedCustomer.totalOrders} Orders • {formatCurrency(selectedCustomer.totalSpent)} LTV</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Contact Info */}
              <div className="p-6 border-b border-slate-100 space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contact Information</h3>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-700">{selectedCustomer.email !== 'N/A' ? selectedCustomer.email : 'No Email Provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-700">{selectedCustomer.phone !== 'N/A' ? selectedCustomer.phone : 'No Phone Provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-700">{selectedCustomer.address}</p>
                    <p className="text-xs font-medium text-slate-500">{selectedCustomer.city}{selectedCustomer.state ? `, ${selectedCustomer.state}` : ''} {selectedCustomer.pincode}</p>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div className="p-6">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                  Order History
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px]">{selectedCustomer.orders.length}</span>
                </h3>
                
                <div className="space-y-3">
                  {selectedCustomer.orders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(order => (
                    <div key={order.id} className="border border-slate-100 rounded-xl p-4 hover:border-slate-300 transition-colors bg-slate-50/50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link to="/admin/orders" className="text-sm font-black text-blue-600 hover:underline">
                            #{order.orderNumber || order.id.slice(0,8)}
                          </Link>
                          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 font-medium">
                            <Calendar className="w-3 h-3" />
                            {formatDate(order.createdAt)}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-slate-900">{formatCurrency(order.total)}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold tracking-wide uppercase ${getStatusBadge(order.status)}`}>
                            {order.status || 'PROCESSING'}
                          </span>
                        </div>
                      </div>
                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                        <Package className="w-3.5 h-3.5" />
                        {order.items?.length || 0} item(s) • {order.paymentMethod === 'cod' ? 'COD' : 'Prepaid'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Actions Footer */}
            {selectedCustomer.email !== 'N/A' && (
              <div className="p-4 border-t border-slate-100 bg-white">
                <a 
                  href={`mailto:${selectedCustomer.email}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-900 text-white font-extrabold text-sm shadow-md hover:bg-slate-800 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email Customer
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
