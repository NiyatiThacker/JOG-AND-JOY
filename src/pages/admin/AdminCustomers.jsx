import React, { useState, useMemo } from 'react';
import { useOrdersList } from '../../queries/useOrders';
import { Users, Search, ShoppingBag, ArrowUpRight, FileText } from 'lucide-react';
import { useSettingsContext } from '../../context/SettingsContext';

export default function AdminCustomers() {
  const { data, isLoading } = useOrdersList({ pageSize: 10000 });
  const { formatCurrency } = useSettingsContext();
  const [search, setSearch] = useState('');

  const customers = useMemo(() => {
    if (!data?.data) return [];
    const orders = data.data;
    const custMap = {};

    orders.forEach(o => {
      // Use email as unique identifier, fallback to userId, fallback to name
      const email = o.shippingAddress?.email || o.userId;
      if (!email) return;

      if (!custMap[email]) {
        custMap[email] = {
          id: email,
          name: o.shippingAddress?.name || 'Guest',
          email: email,
          phone: o.shippingAddress?.phone || 'N/A',
          city: o.shippingAddress?.city || 'N/A',
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: o.createdAt,
          orders: []
        };
      }

      const c = custMap[email];
      c.totalOrders += 1;
      if (o.status !== 'CANCELLED' && o.status !== 'REFUNDED') {
        c.totalSpent += (o.total || 0);
      }
      if (new Date(o.createdAt) > new Date(c.lastOrderDate)) {
        c.lastOrderDate = o.createdAt;
      }
      c.orders.push(o.id);
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

  return (
    <div className="w-full animate-in fade-in duration-300 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] text-accent-green font-bold uppercase tracking-widest font-mono">CRM</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark mt-0.5">Customers</h1>
          <p className="text-xs text-text-secondary mt-1">Manage your buyers and their lifetime value</p>
        </div>
        <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-primary-dark font-bold rounded-xl shadow-sm hover:bg-zinc-50 transition-colors">
          <FileText className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Customers</p>
          <p className="text-3xl font-extrabold text-primary-dark">{customers.length}</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Average LTV</p>
          <p className="text-3xl font-extrabold text-accent-green">
            {formatCurrency(customers.length ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length : 0)}
          </p>
        </div>
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Repeat Rate</p>
          <p className="text-3xl font-extrabold text-info-dark">
            {customers.length ? Math.round((customers.filter(c => c.totalOrders > 1).length / customers.length) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-zinc-50/50 flex justify-between items-center">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white focus:outline-none focus:border-accent-green text-sm transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-zinc-400 font-semibold">Loading customers...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50/80 text-text-secondary font-semibold border-b border-border text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Orders</th>
                  <th className="px-6 py-4">Lifetime Value</th>
                  <th className="px-6 py-4">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-text-secondary">
                      <Users className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      <p className="font-bold text-primary-dark">No customers found</p>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-primary-dark">{c.name}</p>
                        {c.totalOrders > 1 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-accent-green/10 text-accent-green mt-1">
                            Repeat
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">{c.email}</p>
                        <p className="text-xs text-text-secondary">{c.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {c.city}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 text-xs font-bold text-primary-dark">
                          {c.totalOrders}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-primary-dark">
                        {formatCurrency(c.totalSpent)}
                      </td>
                      <td className="px-6 py-4 text-text-secondary text-xs">
                        {new Date(c.lastOrderDate).toLocaleDateString()}
                      </td>
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
