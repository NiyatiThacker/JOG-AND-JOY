import React, { useState } from 'react';
import { IndianRupee, FileText, ArrowUpRight, ArrowDownRight, Search, Download, Calculator, TrendingUp, Landmark, FileSpreadsheet } from 'lucide-react';
import { useRevenueSummary, usePayouts } from '../../queries/useFinancials';
import { useSettingsContext } from '../../context/SettingsContext';

export default function AdminFinancials() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [search, setSearch] = useState('');
  const { formatCurrency, formatDate } = useSettingsContext();
  
  const { data: summary, isLoading: isLoadingSummary } = useRevenueSummary();
  const { data: payouts, isLoading: isLoadingPayouts } = usePayouts();

  const handleExport = () => {
    const csvData = "data:text/csv;charset=utf-8,Type,Amount\nTransaction,1200\nPayout,1100\n";
    const link = document.createElement("a");
    link.href = encodeURI(csvData);
    link.download = "financials_export.csv";
    link.click();
  };

  // Mock transactions based on orders
  const transactions = [];

  const tabs = [
    { id: 'transactions', icon: <ArrowUpRight className="w-4 h-4" />, label: 'Transactions' },
    { id: 'payouts', icon: <Landmark className="w-4 h-4" />, label: 'Payouts' },
    { id: 'taxes', icon: <FileText className="w-4 h-4" />, label: 'Taxes' },
    { id: 'expenses', icon: <Calculator className="w-4 h-4" />, label: 'Fees & Expenses' },
  ];

  return (
    <div className="w-full animate-in fade-in duration-300 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] text-accent-green font-bold uppercase tracking-widest font-mono">Reporting</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark mt-0.5">Financials</h1>
          <p className="text-xs text-text-secondary mt-1">Transactions, payouts, and taxes</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-border text-primary-dark rounded-xl font-bold text-sm hover:bg-zinc-50 shadow-sm transition-all">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-white border border-border rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Gross Revenue</p>
            <div className="p-1.5 bg-success/10 rounded-lg text-success"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-primary-dark">
            {isLoadingSummary ? '...' : formatCurrency(summary?.totalRevenue || 0)}
          </p>
        </div>
        <div className="p-5 bg-white border border-border rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Net Revenue</p>
            <div className="p-1.5 bg-zinc-100 rounded-lg text-zinc-500"><IndianRupee className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-primary-dark">
            {isLoadingSummary ? '...' : formatCurrency((summary?.totalRevenue || 0) * 0.95)}
          </p>
        </div>
        <div className="p-5 bg-white border border-border rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Pending Payout</p>
            <div className="p-1.5 bg-warning/10 rounded-lg text-warning-dark"><Landmark className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-primary-dark">
            {formatCurrency(0)}
          </p>
        </div>
        <div className="p-5 bg-white border border-border rounded-2xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Taxes Collected</p>
            <div className="p-1.5 bg-info/10 rounded-lg text-info-dark"><FileText className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-primary-dark">
            {formatCurrency(0)}
          </p>
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
          {activeTab === 'payouts' ? (
            <>
              <div className="p-4 border-b border-border bg-white flex justify-between items-center">
                <h2 className="text-lg font-bold text-primary-dark">Payout Schedule</h2>
              </div>
              <div className="p-6">
                {isLoadingPayouts ? (
                  <p className="text-center py-8 text-zinc-400 font-semibold">Loading payouts...</p>
                ) : (
                  <div className="space-y-4">
                    {!payouts || payouts.length === 0 ? (
                      <div className="text-center py-12 text-text-secondary">
                        <Landmark className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        <p className="font-bold text-primary-dark">No payouts found.</p>
                      </div>
                    ) : (
                      payouts.map(payout => (
                        <div key={payout.id} className="flex justify-between items-center p-4 border border-border rounded-xl bg-zinc-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                          <div>
                            <h3 className="font-bold text-primary-dark group-hover:text-accent-green transition-colors">{formatDate(payout.periodStart)} - {formatDate(payout.periodEnd)}</h3>
                            <p className="text-sm text-text-secondary mt-1">Status: <span className="font-semibold text-primary-dark capitalize">{payout.status}</span></p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-primary-dark">{formatCurrency(payout.netPayout)}</p>
                            <p className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mt-1">Net Payout</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </>
          ) : activeTab === 'transactions' ? (
            <div className="p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4">Recent Transactions</h2>
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 border-b border-border text-[11px] uppercase tracking-wider text-text-secondary">
                    <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Order / Ref</th><th className="px-4 py-3 text-right">Gross</th><th className="px-4 py-3 text-right">Net</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 text-text-secondary">2026-11-01</td><td className="px-4 py-3 font-bold text-primary-dark">#ORD-10024</td><td className="px-4 py-3 text-right">{formatCurrency(120)}</td><td className="px-4 py-3 text-right font-bold text-success-dark">{formatCurrency(115.4)}</td></tr>
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 text-text-secondary">2026-11-01</td><td className="px-4 py-3 font-bold text-primary-dark">#ORD-10025</td><td className="px-4 py-3 text-right">{formatCurrency(85)}</td><td className="px-4 py-3 text-right font-bold text-success-dark">{formatCurrency(81.2)}</td></tr>
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 text-text-secondary">2026-10-31</td><td className="px-4 py-3 font-bold text-primary-dark">Refund (#ORD-9901)</td><td className="px-4 py-3 text-right text-error">-{formatCurrency(45)}</td><td className="px-4 py-3 text-right font-bold text-error">-{formatCurrency(45)}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'taxes' ? (
            <div className="p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4">Tax Liability</h2>
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 border-b border-border text-[11px] uppercase tracking-wider text-text-secondary">
                    <tr><th className="px-4 py-3">Region</th><th className="px-4 py-3">Rate</th><th className="px-4 py-3 text-right">Sales Subject to Tax</th><th className="px-4 py-3 text-right">Tax Collected</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold text-primary-dark">California (State)</td><td className="px-4 py-3 text-text-secondary">7.25%</td><td className="px-4 py-3 text-right">{formatCurrency(12500)}</td><td className="px-4 py-3 text-right font-bold">{formatCurrency(906.25)}</td></tr>
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold text-primary-dark">New York (State)</td><td className="px-4 py-3 text-text-secondary">4.00%</td><td className="px-4 py-3 text-right">{formatCurrency(8200)}</td><td className="px-4 py-3 text-right font-bold">{formatCurrency(328.00)}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'expenses' ? (
            <div className="p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4">Platform Fees & Expenses</h2>
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 border-b border-border text-[11px] uppercase tracking-wider text-text-secondary">
                    <tr><th className="px-4 py-3">Category</th><th className="px-4 py-3">Details</th><th className="px-4 py-3 text-right">Amount</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold text-primary-dark">Payment Gateway</td><td className="px-4 py-3 text-text-secondary">2.9% + 30¢ per transaction</td><td className="px-4 py-3 text-right font-bold text-error">{formatCurrency(452.50)}</td></tr>
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold text-primary-dark">Platform Fee</td><td className="px-4 py-3 text-text-secondary">Monthly Subscription</td><td className="px-4 py-3 text-right font-bold text-error">{formatCurrency(29.00)}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
