import React from 'react';
import { ShoppingBag, Users, IndianRupee, AlertTriangle, TrendingUp, Package, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRevenueSummary, useSalesSeries } from '../../queries/useFinancials';
import { useOrdersList } from '../../queries/useOrders';
import { useSettingsContext } from '../../context/SettingsContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useProductsList } from '../../queries/useProducts';
import { useRecentActivity } from '../../queries/useRecentActivity';
import { useMessagesList } from '../../queries/useMessages';

export default function AdminDashboard() {
  const { formatCurrency } = useSettingsContext();
  const { data: summary, isLoading: isLoadingSummary } = useRevenueSummary();
  const { data: ordersData } = useOrdersList({ fulfillmentStatus: 'unfulfilled' });
  const { data: productsData } = useProductsList();
  const { data: messagesData } = useMessagesList({ status: 'unread' });
  const { activities } = useRecentActivity(); // Force HMR reload
  
  const pendingOrdersCount = ordersData?.data?.length || 0;
  const unreadMessagesCount = messagesData?.data?.length || 0;
  
  // Calculate low stock items
  let lowStockCount = 0;
  if (productsData?.data) {
    productsData.data.forEach(p => {
      const totalStock = p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
      if (totalStock > 0 && totalStock <= (p.lowStockThreshold || 5)) {
        lowStockCount++;
      }
    });
  }

  const { data: salesSeries = [] } = useSalesSeries({ granularity: 'day' });

  // Fallback to empty chart if no data yet
  const chartData = salesSeries.length > 0 ? salesSeries : [
    { name: 'Mon', sales: 0 },
    { name: 'Tue', sales: 0 },
    { name: 'Wed', sales: 0 },
    { name: 'Thu', sales: 0 },
    { name: 'Fri', sales: 0 },
    { name: 'Sat', sales: 0 },
    { name: 'Sun', sales: 0 },
  ];

  return (
    <div className="w-full animate-in fade-in duration-300 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] text-accent-green font-bold uppercase tracking-widest font-mono">Overview</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark mt-0.5">Dashboard</h1>
          <p className="text-xs text-text-secondary mt-1">Here is what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-secondary">Store Status:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-success/15 text-success-dark">
            <span className="w-1.5 h-1.5 rounded-full bg-success-dark"></span> Online
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-5 bg-white border border-border rounded-2xl shadow-sm relative overflow-hidden group hover:border-accent-green transition-colors">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Total Sales</p>
            <div className="p-1.5 bg-zinc-100 rounded-lg text-zinc-500 group-hover:bg-accent-green/10 group-hover:text-accent-green transition-colors"><IndianRupee className="w-4 h-4" /></div>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <p className="text-2xl font-black text-primary-dark">
              {isLoadingSummary ? '...' : formatCurrency(summary?.totalRevenue || 0)}
            </p>
            <span className="text-xs font-bold text-success mb-1">+12%</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-border rounded-2xl shadow-sm relative overflow-hidden group hover:border-accent-green transition-colors">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Store Sessions</p>
            <div className="p-1.5 bg-zinc-100 rounded-lg text-zinc-500 group-hover:bg-accent-green/10 group-hover:text-accent-green transition-colors"><Users className="w-4 h-4" /></div>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <p className="text-2xl font-black text-primary-dark">0</p>
            <span className="text-xs font-bold text-slate-400 mb-1">0%</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-border rounded-2xl shadow-sm relative overflow-hidden group hover:border-accent-green transition-colors">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Orders</p>
            <div className="p-1.5 bg-zinc-100 rounded-lg text-zinc-500 group-hover:bg-accent-green/10 group-hover:text-accent-green transition-colors"><ShoppingBag className="w-4 h-4" /></div>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <p className="text-2xl font-black text-primary-dark">
              {isLoadingSummary ? '...' : summary?.totalOrders || 0}
            </p>
            <span className="text-xs font-bold text-error mb-1">-2%</span>
          </div>
        </div>
        
        <div className="p-5 bg-white border border-border rounded-2xl shadow-sm relative overflow-hidden group hover:border-accent-green transition-colors">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Conversion Rate</p>
            <div className="p-1.5 bg-zinc-100 rounded-lg text-zinc-500 group-hover:bg-accent-green/10 group-hover:text-accent-green transition-colors"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <p className="text-2xl font-black text-primary-dark">0%</p>
            <span className="text-xs font-bold text-slate-400 mb-1">0%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: To-Do & Chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Action Required (To-Do) */}
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-zinc-50 flex justify-between items-center">
              <h2 className="text-sm font-bold text-primary-dark uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning-dark" /> Action Required
              </h2>
            </div>
            <div className="divide-y divide-border">
              {pendingOrdersCount > 0 && (
                <Link to="/admin/shipping" className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-info/10 text-info-dark flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-primary-dark group-hover:text-accent-green transition-colors">{pendingOrdersCount} orders to fulfill</p>
                      <p className="text-xs text-text-secondary">Pack and ship pending orders.</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-accent-green transition-colors" />
                </Link>
              )}
              {lowStockCount > 0 && (
                <Link to="/admin/inventory" className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-warning/10 text-warning-dark flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-primary-dark group-hover:text-accent-green transition-colors">{lowStockCount} products low on stock</p>
                      <p className="text-xs text-text-secondary">Review inventory and create POs.</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-accent-green transition-colors" />
                </Link>
              )}
              {unreadMessagesCount > 0 && (
                <Link to="/admin/messages" className="flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-primary-dark group-hover:text-accent-green transition-colors">{unreadMessagesCount} unresolved ticket{unreadMessagesCount !== 1 && 's'}</p>
                      <p className="text-xs text-text-secondary">Customer messages waiting for reply.</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-accent-green transition-colors" />
                </Link>
              )}
              {pendingOrdersCount === 0 && lowStockCount === 0 && unreadMessagesCount === 0 && (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-success/10 text-success-dark rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-primary-dark">You're all caught up!</p>
                  <p className="text-xs text-text-secondary mt-1">No pending actions required.</p>
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-primary-dark">Sales Over Time</h2>
                <p className="text-xs text-text-secondary mt-1">Last 7 days</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dx={-10} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="sales" fill="#038D5C" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Activity Stream */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col h-full max-h-[700px]">
          <div className="p-4 border-b border-border bg-zinc-50 flex justify-between items-center shrink-0">
            <h2 className="text-sm font-bold text-primary-dark uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-4 h-4 text-text-secondary" /> Recent Activity
            </h2>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-6">
            
            <div className="relative pl-4 border-l border-zinc-200 space-y-6">
              {activities.map((act) => (
                <Link key={act.id} to={`/admin/orders?orderId=${act.sourceId}`} className="relative block group">
                  <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                    act.type === 'success' ? 'bg-success-dark' :
                    act.type === 'error' ? 'bg-error' :
                    act.type === 'warning' ? 'bg-warning-dark' : 'bg-info-dark'
                  }`}></span>
                  <p className="text-sm font-bold text-primary-dark group-hover:text-accent-green transition-colors">{act.title}</p>
                  <p className="text-xs text-text-secondary mt-1">{act.time}</p>
                </Link>
              ))}
              {activities.length === 0 && (
                <p className="text-sm text-text-secondary">No recent activity.</p>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
