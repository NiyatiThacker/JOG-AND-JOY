import React, { useState, useMemo } from 'react';
import { ShoppingBag, Users, IndianRupee, AlertTriangle, Package, MessageSquare, Clock, ArrowRight, CreditCard, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrdersList } from '../../queries/useOrders';
import { useSettingsContext } from '../../context/SettingsContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useProductsList } from '../../queries/useProducts';

export default function AdminDashboard() {
  const [period, setPeriod] = useState('30d');
  const { formatCurrency } = useSettingsContext();
  const { data: ordersData, isLoading: isLoadingOrders } = useOrdersList({ pageSize: 10000 });
  const { data: productsData } = useProductsList();
  
  const orders = ordersData?.data || [];
  
  // Filtering logic
  const now = new Date();
  let startDate = new Date(0);
  if (period === 'today') { startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); }
  else if (period === 'week') { startDate = new Date(); startDate.setDate(now.getDate() - 7); }
  else if (period === '30d') { startDate = new Date(); startDate.setDate(now.getDate() - 30); }
  else if (period === 'last_month') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  }
  else if (period === 'year') { startDate = new Date(now.getFullYear(), 0, 1); }

  const filteredOrders = orders.filter(o => {
    const d = new Date(o.createdAt || new Date());
    if (period === 'last_month') {
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return d >= startDate && d <= endOfLastMonth;
    }
    return d >= startDate;
  });

  const validOrders = filteredOrders.filter(o => o.status !== 'CANCELLED' && o.status !== 'REFUNDED');
  
  // KPIs
  const totalSales = validOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = validOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalSales / totalOrdersCount : 0;
  
  // Customers
  const customerOrderCounts = {};
  validOrders.forEach(o => {
    if (o.shippingAddress?.email) {
      customerOrderCounts[o.shippingAddress.email] = (customerOrderCounts[o.shippingAddress.email] || 0) + 1;
    }
  });
  let newCustomers = 0;
  let returningCustomers = 0;
  Object.values(customerOrderCounts).forEach(count => {
    if (count > 1) returningCustomers++;
    else newCustomers++;
  });

  // Sales Over Time Chart Data
  let chartData = [];
  let days = period === 'today' ? 1 : period === 'week' ? 7 : period === '30d' || period === 'last_month' ? 30 : 12;
  
  if (period === 'year') {
    chartData = Array.from({ length: 12 }).map((_, i) => {
      const d = new Date(startDate.getFullYear(), i, 1);
      const monthStr = d.toISOString().substring(0, 7);
      const val = validOrders.filter(o => o.createdAt?.startsWith(monthStr)).reduce((sum, o) => sum + (o.total || 0), 0);
      return { name: d.toLocaleDateString('en-US', { month: 'short' }), sales: val };
    });
  } else {
    chartData = Array.from({ length: days }).map((_, i) => {
      const d = new Date(period === 'last_month' ? now : new Date());
      d.setDate(d.getDate() - (days - 1 - i));
      const dateStr = d.toISOString().split('T')[0];
      const val = validOrders.filter(o => o.createdAt?.startsWith(dateStr)).reduce((sum, o) => sum + (o.total || 0), 0);
      return { name: days > 7 ? d.getDate() : d.toLocaleDateString('en-US', { weekday: 'short' }), sales: val };
    });
  }

  // Order Status Distribution
  const statusCounts = {};
  filteredOrders.forEach(o => {
    statusCounts[o.status || 'PROCESSING'] = (statusCounts[o.status || 'PROCESSING'] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#038D5C', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Payment Method
  let codCount = 0;
  let prepaidCount = 0;
  validOrders.forEach(o => {
    if (o.paymentMethod === 'cod') codCount++; else prepaidCount++;
  });

  // Product Performance
  const productStats = {};
  validOrders.forEach(o => {
    o.items?.forEach(item => {
      const title = item.titleSnapshot || 'Unknown';
      if (!productStats[title]) productStats[title] = { name: title, units: 0, rev: 0 };
      productStats[title].units += item.quantity || 1;
      productStats[title].rev += (item.unitPrice || 0) * (item.quantity || 1);
    });
  });
  const topProducts = Object.values(productStats).sort((a, b) => b.rev - a.rev).slice(0, 5);

  return (
    <div className="w-full animate-in fade-in duration-300 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <span className="text-[10px] text-accent-green font-bold uppercase tracking-widest font-mono">Overview</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark mt-0.5">Dashboard</h1>
          <p className="text-xs text-text-secondary mt-1">Comprehensive business overview and metrics.</p>
        </div>
        <select 
          value={period} 
          onChange={e => setPeriod(e.target.value)}
          className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-bold text-primary-dark focus:outline-none focus:border-green-500"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="30d">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Total Sales</p>
          <p className="text-2xl font-black text-primary-dark">{formatCurrency(totalSales)}</p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Total Orders</p>
          <p className="text-2xl font-black text-primary-dark">{totalOrdersCount}</p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Avg Order Value</p>
          <p className="text-2xl font-black text-primary-dark">{formatCurrency(avgOrderValue)}</p>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm relative overflow-hidden">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Customers</p>
          <div className="flex justify-between items-end">
            <div><p className="text-xl font-black text-primary-dark">{newCustomers}</p><p className="text-[10px] font-bold text-zinc-400 uppercase">New</p></div>
            <div className="text-right"><p className="text-xl font-black text-primary-dark">{returningCustomers}</p><p className="text-[10px] font-bold text-zinc-400 uppercase">Returning</p></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-primary-dark mb-6">Sales Overview</h2>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dx={-10} tickFormatter={(val) => `₹${val}`} />
                <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="sales" fill="#038D5C" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status & Payment */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-primary-dark mb-4">Order Status</h2>
            {statusData.length > 0 ? (
              <div className="h-50 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="text-sm text-zinc-400 text-center py-8">No orders found</p>}
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {statusData.map((s, i) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs font-bold text-zinc-600">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                  {s.name} ({s.value})
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-primary-dark mb-4">Payment Methods</h2>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-sm font-bold mb-1"><span className="text-zinc-600">Prepaid (Online)</span><span>{prepaidCount}</span></div>
                <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-accent-green h-full rounded-full" style={{ width: `${validOrders.length ? (prepaidCount/validOrders.length)*100 : 0}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-bold mb-1"><span className="text-zinc-600">Cash on Delivery</span><span>{codCount}</span></div>
                <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${validOrders.length ? (codCount/validOrders.length)*100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-primary-dark mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-accent-green"/> Product Performance</h2>
          <div className="divide-y divide-border">
            {topProducts.length === 0 ? <p className="text-sm text-zinc-400 py-4">No data available.</p> : 
              topProducts.map((p, i) => (
                <div key={i} className="flex justify-between items-center py-3">
                  <p className="font-bold text-sm text-primary-dark">{p.name}</p>
                  <div className="text-right">
                    <p className="font-bold text-sm text-primary-dark">{formatCurrency(p.rev)}</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">{p.units} units sold</p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-primary-dark mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-accent-green"/> Sales by Channel</h2>
          <div className="flex flex-col justify-center h-full pb-8">
             <div className="flex justify-between items-center p-4 bg-zinc-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center"><CreditCard className="w-5 h-5 text-primary-dark"/></div>
                  <div><p className="font-bold text-primary-dark">Web Storefront</p><p className="text-xs text-zinc-400">jogandjoy.com</p></div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-dark">{formatCurrency(totalSales)}</p>
                  <p className="text-[10px] font-bold text-success uppercase">100% of sales</p>
                </div>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}
