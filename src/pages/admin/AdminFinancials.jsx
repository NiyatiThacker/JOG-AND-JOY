import React, { useState, useMemo } from 'react';
import { IndianRupee, FileText, ArrowUpRight, Search, Download, Calculator, TrendingUp } from 'lucide-react';
import { useSettingsContext } from '../../context/SettingsContext';
import { useOrdersList } from '../../queries/useOrders';

export default function AdminFinancials() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [period, setPeriod] = useState('all');
  const { formatCurrency, formatDate } = useSettingsContext();
  
  const { data: ordersData, isLoading } = useOrdersList({ pageSize: 10000 });
  const orders = ordersData?.data || [];

  const financials = useMemo(() => {
    const now = new Date();
    let startDate = new Date(0);
    if (period === 'today') { 
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); 
    } else if (period === '7d') { 
      startDate = new Date(); 
      startDate.setDate(now.getDate() - 7); 
    } else if (period === '30d') { 
      startDate = new Date(); 
      startDate.setDate(now.getDate() - 30); 
    } else if (period === 'year') { 
      startDate = new Date(now.getFullYear(), 0, 1); 
    }

    const paidOrders = orders.filter(o => o.paymentStatus === 'paid' && new Date(o.createdAt || new Date()) >= startDate);
    
    let grossRevenue = 0;
    let taxesCollected = 0;
    let gatewayFees = 0;
    
    const transactions = paidOrders.map(order => {
      const gross = order.total || 0;
      const tax = order.tax || 0;
      // Gateway fee: Flat 2.5%
      const fee = gross * 0.025; 
      const net = gross - fee;
      
      grossRevenue += gross;
      taxesCollected += tax;
      gatewayFees += fee;
      
      return {
        id: order.id,
        orderNumber: order.orderNumber,
        date: order.createdAt,
        gross,
        net,
        fee,
        tax
      };
    });
    
    // sort transactions by date descending
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const netRevenue = grossRevenue - gatewayFees;

    return {
      grossRevenue,
      netRevenue,
      taxesCollected,
      gatewayFees,
      transactions,
    };
  }, [orders]);

  const handleExport = () => {
    let csvData = "data:text/csv;charset=utf-8,Date,Order,Gross,Net,Fee,Tax\n";
    financials.transactions.forEach(t => {
      csvData += `${t.date},${t.orderNumber},${t.gross},${t.net},${t.fee},${t.tax}\n`;
    });
    const link = document.createElement("a");
    link.href = encodeURI(csvData);
    link.download = "financials_export.csv";
    link.click();
  };

  const tabs = [
    { id: 'transactions', icon: <ArrowUpRight className="w-4 h-4" />, label: 'Transactions' },
    { id: 'taxes', icon: <FileText className="w-4 h-4" />, label: 'Taxes' },
    { id: 'expenses', icon: <Calculator className="w-4 h-4" />, label: 'Fees & Expenses' },
  ];

  return (
    <div className="w-full animate-in fade-in duration-300 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest font-mono">Reporting</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-dark mt-0.5">Financials</h1>
          <p className="text-xs text-text-muted mt-1">Transactions, taxes, and expenses</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select 
            value={period} 
            onChange={e => setPeriod(e.target.value)}
            className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-bold text-text-dark focus:outline-none focus:border-blue-600"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
          <button onClick={handleExport} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-text-dark rounded-xl font-bold text-sm hover:bg-zinc-50 shadow-sm transition-all">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Gross Revenue</p>
            <div className="p-1.5 bg-success/10 rounded-lg text-success"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-text-dark">
            {isLoading ? '...' : formatCurrency(financials.grossRevenue)}
          </p>
        </div>
        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Net Revenue</p>
            <div className="p-1.5 bg-zinc-100 rounded-lg text-zinc-500"><IndianRupee className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-text-dark">
            {isLoading ? '...' : formatCurrency(financials.netRevenue)}
          </p>
        </div>
        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Gateway Fees</p>
            <div className="p-1.5 bg-error/10 rounded-lg text-error"><Calculator className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-text-dark">
            {isLoading ? '...' : formatCurrency(financials.gatewayFees)}
          </p>
        </div>
        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Taxes Collected</p>
            <div className="p-1.5 bg-info/10 rounded-lg text-info-dark"><FileText className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-text-dark">
            {isLoading ? '...' : formatCurrency(financials.taxesCollected)}
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm transition-all overflow-hidden flex flex-col md:flex-row min-h-125">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 bg-zinc-50/50 border-r border-slate-200 p-4 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-3 ${
                activeTab === tab.id ? 'bg-white border border-slate-200 shadow-sm text-text-dark' : 'text-text-muted hover:bg-zinc-100/50 hover:text-text-primary'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-blue-600' : ''}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {activeTab === 'transactions' && (
            <div className="p-6">
              <h2 className="text-lg font-bold text-text-dark mb-4">Recent Transactions</h2>
              <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-100 text-xs font-bold text-zinc-500">
                    <tr><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Order / Ref</th><th className="px-5 py-3 font-medium text-right">Gross</th><th className="px-5 py-3 font-medium text-right">Net</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {financials.transactions.length === 0 && (
                      <tr><td colSpan="4" className="px-4 py-8 text-center text-text-muted">No transactions found</td></tr>
                    )}
                    {financials.transactions.map(t => (
                      <tr key={t.id} className="hover:bg-zinc-50">
                        <td className="px-4 py-3 text-text-muted">{formatDate(t.date)}</td>
                        <td className="px-4 py-3 font-bold text-text-dark">#{t.orderNumber}</td>
                        <td className="px-4 py-3 text-right">{formatCurrency(t.gross)}</td>
                        <td className="px-4 py-3 text-right font-bold text-success-dark">{formatCurrency(t.net)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'taxes' && (
            <div className="p-6">
              <h2 className="text-lg font-bold text-text-dark mb-4">Tax Liability</h2>
              <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-100 text-xs font-bold text-zinc-500">
                    <tr><th className="px-5 py-3 font-medium">Region</th><th className="px-5 py-3 font-medium text-right">Sales Subject to Tax</th><th className="px-5 py-3 font-medium text-right">Tax Collected</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-zinc-50">
                      <td className="px-4 py-3 font-bold text-text-dark">Default Region (Store)</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(financials.grossRevenue - financials.taxesCollected)}</td>
                      <td className="px-4 py-3 text-right font-bold">{formatCurrency(financials.taxesCollected)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="p-6">
              <h2 className="text-lg font-bold text-text-dark mb-4">Platform Fees & Expenses</h2>
              <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-100 text-xs font-bold text-zinc-500">
                    <tr><th className="px-5 py-3 font-medium">Category</th><th className="px-5 py-3 font-medium">Details</th><th className="px-5 py-3 font-medium text-right">Amount</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-zinc-50">
                      <td className="px-4 py-3 font-bold text-text-dark">Payment Gateway</td>
                      <td className="px-4 py-3 text-text-muted">2.5% per transaction</td>
                      <td className="px-4 py-3 text-right font-bold text-error">{formatCurrency(financials.gatewayFees)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
