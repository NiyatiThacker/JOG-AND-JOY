import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, Users, ShoppingBag, Globe, Plus, Filter, PieChart, Activity } from 'lucide-react';
import { useRevenueSummary } from '../../queries/useFinancials';
import { useOrdersList } from '../../queries/useOrders';
import { useCustomersList } from '../../queries/useCustomers';
import { useSettingsContext } from '../../context/SettingsContext';

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState('sales');
  const [period, setPeriod] = useState('30d');
  const { formatCurrency } = useSettingsContext();

  const { data: summary, isLoading } = useRevenueSummary();
  const { data: ordersData } = useOrdersList({ pageSize: 10000 });
  const { data: customersData } = useCustomersList({ pageSize: 10000 });

  const orders = ordersData?.data || [];
  const customers = customersData?.data || [];

  const now = new Date();
  let startDate = new Date();
  if (period === 'today') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === '7d') {
    startDate.setDate(now.getDate() - 7);
  } else if (period === '30d') {
    startDate.setDate(now.getDate() - 30);
  } else if (period === 'year') {
    startDate = new Date(now.getFullYear(), 0, 1);
  } else {
    startDate = new Date(0); // all time
  }

  const filteredOrders = orders.filter(o => new Date(o.createdAt || now) >= startDate);
  const filteredCustomers = customers.filter(c => new Date(c.createdAt || now) >= startDate);

  // Dynamic Chart Data based on Period
  let chartData = [];
  if (period === 'year') {
    chartData = Array.from({ length: 12 }).map((_, i) => {
      const d = new Date(now.getFullYear(), i, 1);
      const monthStr = d.toISOString().substring(0, 7);
      const monthOrders = filteredOrders.filter(o => o.createdAt?.startsWith(monthStr) && o.status !== 'cancelled');
      const value = monthOrders.reduce((sum, o) => sum + (o.total || ((o.subtotal || 0) + (o.tax || 0) + (o.shippingCost || 0) - (o.discountAmount || 0))), 0);
      return { label: d.toLocaleDateString('en-US', { month: 'short' }), value };
    });
  } else if (period === 'all') {
    chartData = Array.from({ length: 5 }).map((_, i) => {
      const year = now.getFullYear() - (4 - i);
      const yearStr = String(year);
      const yearOrders = filteredOrders.filter(o => o.createdAt?.startsWith(yearStr) && o.status !== 'cancelled');
      const value = yearOrders.reduce((sum, o) => sum + (o.total || ((o.subtotal || 0) + (o.tax || 0) + (o.shippingCost || 0) - (o.discountAmount || 0))), 0);
      return { label: yearStr, value };
    });
  } else {
    let days = period === 'today' ? 1 : period === '30d' ? 30 : 7;
    chartData = Array.from({ length: days }).map((_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - (days - 1 - i));
      const dateStr = d.toISOString().split('T')[0];
      const dayOrders = filteredOrders.filter(o => o.createdAt?.startsWith(dateStr) && o.status !== 'cancelled');
      const value = dayOrders.reduce((sum, o) => sum + (o.total || ((o.subtotal || 0) + (o.tax || 0) + (o.shippingCost || 0) - (o.discountAmount || 0))), 0);
      return { label: days > 7 ? d.getDate() : d.toLocaleDateString('en-US', { weekday: 'short' }), value };
    });
  }
  const maxVal = Math.max(...chartData.map(d => d.value), 100);

  // Real logic for Top Products
  const productStats = {};
  filteredOrders.forEach(order => {
    if (order.status !== 'cancelled') {
      order.items?.forEach(item => {
        const title = item.titleSnapshot || item.title || item.name || 'Unknown Product';
        const key = item.productId || title;
        if (!productStats[key]) {
          productStats[key] = { name: title, units: 0, revenue: 0 };
        }
        productStats[key].units += item.quantity || 1;
        productStats[key].revenue += ((item.unitPrice || item.price) * (item.quantity || 1)) || 0;
      });
    }
  });
  const topProducts = Object.values(productStats).sort((a, b) => b.units - a.units).slice(0, 10);

  // KPI Calculations
  const totalOrdersCount = filteredOrders.length;
  
  // Returning Customer Rate
  const customerOrderCounts = {};
  filteredOrders.forEach(o => {
    if (o.customerId) {
      customerOrderCounts[o.customerId] = (customerOrderCounts[o.customerId] || 0) + 1;
    }
  });
  const returningCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;
  const returningRate = filteredCustomers.length > 0 ? ((returningCustomers / filteredCustomers.length) * 100).toFixed(1) : 0;

  // Gross vs Net
  const grossSales = filteredOrders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
  const netSales = filteredOrders.reduce((sum, o) => sum + ((o.subtotal || 0) - (o.discountAmount || 0)), 0);

  // Sales by Channel
  const onlineStoreOrders = filteredOrders.filter(o => o.channel === 'online_store' || o.channel === 'Web Storefront').length;
  const posOrders = totalOrdersCount - onlineStoreOrders;
  const onlinePercent = totalOrdersCount > 0 ? Math.round((onlineStoreOrders / totalOrdersCount) * 100) : 0;
  const posPercent = totalOrdersCount > 0 ? 100 - onlinePercent : 0;

  const handleExport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeTab === 'sales') {
      csvContent += "Date,Sales\n";
      chartData.forEach(d => { csvContent += `${d.label},${d.value}\n`; });
    } else if (activeTab === 'products') {
      csvContent += "Product,Units Sold,Revenue\n";
      topProducts.forEach(p => { csvContent += `"${p.name}",${p.units},${p.revenue}\n`; });
    } else if (activeTab === 'customers') {
      csvContent += "Metric,Value\n";
      csvContent += `Total Customers,${filteredCustomers.length}\n`;
      csvContent += `Avg Orders / Customer,${filteredCustomers.length > 0 ? (filteredOrders.length / filteredCustomers.length).toFixed(1) : '0'}\n`;
      csvContent += `Returning Customer Rate,${returningRate}%\n`;
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `analytics_${activeTab}_export.csv`;
    link.click();
  };

  const tabs = [
    { id: 'sales', icon: <TrendingUp className="w-4 h-4" />, label: 'Sales' },
    { id: 'products', icon: <ShoppingBag className="w-4 h-4" />, label: 'Products' },
    { id: 'customers', icon: <Users className="w-4 h-4" />, label: 'Customers' },
  ];

  return (
    <div className="w-full animate-in fade-in duration-300 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest font-mono">Reporting</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-dark mt-0.5">Analytics</h1>
          <p className="text-xs text-text-muted mt-1">Data driven insights and custom reports</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-green-500 shadow-sm"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-text-dark rounded-xl font-bold text-sm hover:bg-bg-base transition-colors shadow-sm transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-white border border-slate-100 rounded-2xl transition-all shadow-sm">
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Total Sales</p>
          <div className="flex items-end gap-3">
            <p className="text-2xl font-black text-text-dark">{isLoading ? '...' : formatCurrency(summary?.totalRevenue || 0)}</p>
          </div>
        </div>
        <div className="p-5 bg-white border border-slate-100 rounded-2xl transition-all shadow-sm">
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Avg Order Value</p>
          <div className="flex items-end gap-3">
            <p className="text-2xl font-black text-text-dark">{isLoading ? '...' : formatCurrency(summary?.totalRevenue / (summary?.totalOrders || 1) || 0)}</p>
          </div>
        </div>
        <div className="p-5 bg-white border border-slate-100 rounded-2xl transition-all shadow-sm">
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Total Orders</p>
          <div className="flex items-end gap-3">
            <p className="text-2xl font-black text-text-dark">{totalOrdersCount}</p>
          </div>
        </div>
        <div className="p-5 bg-white border border-slate-100 rounded-2xl transition-all shadow-sm">
          <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Returning Customer Rate</p>
          <div className="flex items-end gap-3">
            <p className="text-2xl font-black text-text-dark">{returningRate}%</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm transition-all overflow-hidden flex flex-col md:flex-row min-h-125">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 bg-zinc-50/50 border-r border-slate-200 p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-3 ${activeTab === tab.id ? 'bg-white border border-slate-200 shadow-sm text-text-dark' : 'text-text-muted hover:bg-zinc-100/50 hover:text-text-primary'
                }`}
            >
              <span className={activeTab === tab.id ? 'text-blue-600' : ''}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <h2 className="text-lg font-bold text-text-dark">{tabs.find(t => t.id === activeTab)?.label} Overview</h2>
          </div>

          <div className="p-6">
            {activeTab === 'sales' ? (
              <div className="space-y-6">
                <div className="h-64 bg-zinc-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-end">
                  <div className="flex justify-between items-end h-full gap-2 px-4">
                    {chartData.map((d, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                        <div 
                          className={`w-full rounded-t-sm relative transition-colors ${d.value > 0 ? 'bg-blue-600/20 group-hover:bg-blue-600' : 'bg-zinc-100 group-hover:bg-zinc-200'}`} 
                          style={{ height: `${Math.max((d.value / maxVal) * 100, 2)}%`, minHeight: '4px' }}
                        >
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white px-2 py-1 rounded whitespace-nowrap z-10">
                            {formatCurrency(d.value)}
                          </span>
                        </div>
                        <span className="text-xs text-text-muted font-bold">{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 rounded-xl bg-white">
                    <h3 className="font-bold text-sm mb-4 text-text-dark">Sales by Channel</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="font-semibold">Online Store</span><span>{onlinePercent}%</span></div>
                        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 transition-all" style={{width: `${onlinePercent}%`}}></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="font-semibold">Point of Sale (POS)</span><span>{posPercent}%</span></div>
                        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full bg-primary-dark transition-all" style={{width: `${posPercent}%`}}></div></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-xl bg-white">
                    <h3 className="font-bold text-sm mb-4 text-text-dark">Gross vs Net Sales</h3>
                    <div className="flex flex-col justify-center h-full space-y-4 pb-4">
                      <div>
                         <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1">Gross Sales</p>
                         <p className="text-xl font-black text-text-dark">{formatCurrency(grossSales)}</p>
                      </div>
                      <div>
                         <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mb-1">Net Sales <span className="lowercase font-medium opacity-70">(after discounts)</span></p>
                         <p className="text-xl font-black text-blue-600">{formatCurrency(netSales)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'products' ? (
              <div className="space-y-4">
                <h3 className="font-bold text-text-dark mb-4">Top Products by Units Sold</h3>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-100 text-xs font-bold text-zinc-500">
                      <tr><th className="px-5 py-3 font-medium">Product</th><th className="px-5 py-3 font-medium text-right">Units</th><th className="px-5 py-3 font-medium text-right">Revenue</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {topProducts.length === 0 ? (
                        <tr><td colSpan="3" className="px-4 py-3 text-center text-text-muted">No product data available.</td></tr>
                      ) : topProducts.map((p, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-text-dark line-clamp-1">{p.name || 'Unknown Product'}</td>
                          <td className="px-4 py-3 text-right">{p.units}</td>
                          <td className="px-4 py-3 text-right">{formatCurrency(p.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === 'customers' ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 rounded-xl bg-white text-center">
                  <Users className="w-8 h-8 text-text-dark mx-auto mb-2" />
                  <p className="text-3xl font-black text-text-dark">{filteredCustomers.length}</p>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Total Customers</p>
                </div>
                <div className="p-4 border border-slate-200 rounded-xl bg-white text-center">
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-3xl font-black text-text-dark">
                    {filteredCustomers.length > 0 ? (filteredOrders.length / filteredCustomers.length).toFixed(1) : '0'}
                  </p>
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest mt-1">Avg Orders / Customer</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
