import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, Users, ShoppingBag, Globe, Plus, Filter, PieChart, Activity } from 'lucide-react';
import { useRevenueSummary } from '../../queries/useFinancials';
import { useSettingsContext } from '../../context/SettingsContext';

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState('sales');
  const [period, setPeriod] = useState('30d');
  const { formatCurrency } = useSettingsContext();
  
  const { data: summary, isLoading } = useRevenueSummary();

  const handleExport = () => {
    const csvData = "data:text/csv;charset=utf-8,Date,Sales\n2023-11-01,1200\n2023-11-02,1500\n";
    const link = document.createElement("a");
    link.href = encodeURI(csvData);
    link.download = "analytics_export.csv";
    link.click();
  };

  const chartData = [
    { label: 'Mon', value: 1200 }, { label: 'Tue', value: 1900 }, { label: 'Wed', value: 1400 },
    { label: 'Thu', value: 2100 }, { label: 'Fri', value: 2400 }, { label: 'Sat', value: 3200 }, { label: 'Sun', value: 2800 }
  ];
  const maxVal = Math.max(...chartData.map(d => d.value));

  const tabs = [
    { id: 'sales', icon: <TrendingUp className="w-4 h-4" />, label: 'Sales' },
    { id: 'products', icon: <ShoppingBag className="w-4 h-4" />, label: 'Products' },
    { id: 'customers', icon: <Users className="w-4 h-4" />, label: 'Customers' },
    { id: 'acquisition', icon: <Globe className="w-4 h-4" />, label: 'Acquisition' },
    { id: 'custom', icon: <PieChart className="w-4 h-4" />, label: 'Custom Reports' },
  ];

  return (
    <div className="w-full animate-in fade-in duration-300 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] text-accent-green font-bold uppercase tracking-widest font-mono">Reporting</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark mt-0.5">Analytics</h1>
          <p className="text-xs text-text-secondary mt-1">Data driven insights and custom reports</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={period} 
            onChange={e => setPeriod(e.target.value)}
            className="px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-bold focus:outline-none focus:border-accent-green shadow-sm"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border text-primary-dark rounded-xl font-bold text-sm hover:bg-zinc-50 shadow-sm transition-all">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-white border border-border rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Total Sales</p>
          <div className="flex items-end gap-3">
            <p className="text-2xl font-black text-primary-dark">{isLoading ? '...' : formatCurrency(summary?.totalRevenue || 0)}</p>
            <span className="text-xs font-bold text-success mb-1">+12%</span>
          </div>
        </div>
        <div className="p-5 bg-white border border-border rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Avg Order Value</p>
          <div className="flex items-end gap-3">
            <p className="text-2xl font-black text-primary-dark">{isLoading ? '...' : formatCurrency(summary?.totalRevenue / (summary?.totalOrders || 1) || 0)}</p>
            <span className="text-xs font-bold text-success mb-1">+4%</span>
          </div>
        </div>
        <div className="p-5 bg-white border border-border rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Conversion Rate</p>
          <div className="flex items-end gap-3">
            <p className="text-2xl font-black text-primary-dark">2.4%</p>
            <span className="text-xs font-bold text-error mb-1">-0.3%</span>
          </div>
        </div>
        <div className="p-5 bg-white border border-border rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Returning Customer Rate</p>
          <div className="flex items-end gap-3">
            <p className="text-2xl font-black text-primary-dark">28.5%</p>
            <span className="text-xs font-bold text-success mb-1">+2%</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
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
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b border-border bg-white flex justify-between items-center">
            <h2 className="text-lg font-bold text-primary-dark">{tabs.find(t => t.id === activeTab)?.label} Overview</h2>
            {activeTab === 'custom' && (
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-dark text-white rounded-lg font-bold text-sm hover:bg-primary-hover shadow-sm">
                <Plus className="w-4 h-4" /> New Report
              </button>
            )}
          </div>
          
          <div className="p-6">
            {activeTab === 'sales' ? (
              <div className="space-y-6">
                <div className="h-64 bg-zinc-50 border border-border rounded-xl p-4 flex flex-col justify-end">
                  <div className="flex justify-between items-end h-full gap-2 px-4">
                    {chartData.map((d, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                        <div className="w-full bg-accent-green/20 rounded-t-sm relative group-hover:bg-accent-green transition-colors" style={{ height: `${(d.value / maxVal) * 100}%` }}>
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white px-2 py-1 rounded">{formatCurrency(d.value)}</span>
                        </div>
                        <span className="text-xs text-text-secondary font-bold">{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-xl">
                    <h3 className="font-bold text-sm mb-4">Sales by Channel</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="font-semibold">Online Store</span><span>85%</span></div>
                        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full bg-accent-green w-[85%]"></div></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="font-semibold">Point of Sale</span><span>15%</span></div>
                        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full bg-primary-dark w-[15%]"></div></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-border rounded-xl">
                    <h3 className="font-bold text-sm mb-4">Gross vs Net Sales</h3>
                    <div className="flex items-center justify-center h-24 text-sm text-zinc-500 font-semibold bg-zinc-50 rounded-lg">
                      Data visualization
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'products' ? (
              <div className="space-y-4">
                <h3 className="font-bold text-primary-dark mb-4">Top Products by Units Sold</h3>
                <div className="bg-white border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 border-b border-border text-[11px] uppercase tracking-wider text-text-secondary">
                      <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3 text-right">Units</th><th className="px-4 py-3 text-right">Revenue</th></tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold text-primary-dark">Classic T-Shirt</td><td className="px-4 py-3 text-right">1,204</td><td className="px-4 py-3 text-right">{formatCurrency(24080)}</td></tr>
                      <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold text-primary-dark">Denim Jeans</td><td className="px-4 py-3 text-right">850</td><td className="px-4 py-3 text-right">{formatCurrency(42500)}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === 'customers' ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-xl bg-white text-center">
                  <Users className="w-8 h-8 text-primary-dark mx-auto mb-2" />
                  <p className="text-3xl font-black text-primary-dark">12,450</p>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1">Total Customers</p>
                </div>
                <div className="p-4 border border-border rounded-xl bg-white text-center">
                  <TrendingUp className="w-8 h-8 text-accent-green mx-auto mb-2" />
                  <p className="text-3xl font-black text-primary-dark">3.4</p>
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mt-1">Avg Orders / Customer</p>
                </div>
              </div>
            ) : activeTab === 'acquisition' ? (
              <div className="space-y-4">
                <h3 className="font-bold text-primary-dark mb-4">Traffic Sources</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl border border-border">
                    <span className="font-bold text-sm">Direct Traffic</span>
                    <span className="font-mono text-xs">45%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl border border-border">
                    <span className="font-bold text-sm">Organic Search (Google)</span>
                    <span className="font-mono text-xs">35%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl border border-border">
                    <span className="font-bold text-sm">Social Media</span>
                    <span className="font-mono text-xs">20%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-400">
                {tabs.find(t => t.id === activeTab)?.icon && React.cloneElement(tabs.find(t => t.id === activeTab).icon, { className: 'w-12 h-12 mb-4 opacity-20' })}
                <h3 className="text-lg font-bold text-primary-dark mb-1">{tabs.find(t => t.id === activeTab)?.label} Data</h3>
                <p className="text-sm max-w-md">This analytical sub-module is fully architected in the data layer (Feature 06) and waiting for specific chart implementations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
