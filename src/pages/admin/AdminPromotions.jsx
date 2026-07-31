import React, { useState } from 'react';
import { Tag, Plus, Trash2, Search, Edit2, CheckCircle2, Clock, X, Percent, TrendingDown, Gift, Truck } from 'lucide-react';
import { usePromotionsList, useCreatePromotion, useUpdatePromotion, useDeletePromotion } from '../../queries/usePromotions';
import { useSettingsContext } from '../../context/SettingsContext';

const formatForInput = (isoString) => {
  if (!isoString) return '';
  if (isoString.includes('T') && isoString.length === 16) return isoString;
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
  } catch (e) {
    return '';
  }
};

export default function AdminPromotions() {
  const [activeTab, setActiveTab] = useState('active');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list');
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({});

  const { formatCurrency, formatDate } = useSettingsContext();

  const { data, isLoading } = usePromotionsList();
  let promotions = data?.data || [];

  const now = new Date();
  if (activeTab === 'active') promotions = promotions.filter(p => p.active && (!p.startsAt || new Date(p.startsAt) <= now) && (!p.expiresAt || new Date(p.expiresAt) >= now));
  if (activeTab === 'scheduled') promotions = promotions.filter(p => p.startsAt && new Date(p.startsAt) > now);
  if (activeTab === 'expired') promotions = promotions.filter(p => p.expiresAt && new Date(p.expiresAt) < now);

  if (search) {
    const q = search.toLowerCase();
    promotions = promotions.filter(p => 
      (p.title || '').toLowerCase().includes(q) || 
      (p.code || '').toLowerCase().includes(q)
    );
  }

  const createMut = useCreatePromotion();
  const updateMut = useUpdatePromotion();
  const deleteMut = useDeletePromotion();

  const handleOpenEdit = (promo = null) => {
    if (promo) {
      const formattedPromo = { ...promo };
      if (formattedPromo.startsAt) {
        const d = new Date(formattedPromo.startsAt);
        formattedPromo.startsAt = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      }
      if (formattedPromo.expiresAt) {
        const d = new Date(formattedPromo.expiresAt);
        formattedPromo.expiresAt = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      }
      setEditingPromo(promo);
      setFormData(formattedPromo);
    } else {
      setEditingPromo(null);
      setFormData({
        title: '',
        method: 'code',
        code: '',
        discountType: 'percentage',
        value: 10,
        targetScope: 'entire_order',
        active: true,
        usageLimit: null,
        usageCount: 0,
        minOrderValue: 0
      });
    }
    setView('edit');
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    const payload = { ...formData };
    if (payload.startsAt) {
      payload.startsAt = new Date(payload.startsAt).toISOString();
    }
    if (payload.expiresAt) {
      payload.expiresAt = new Date(payload.expiresAt).toISOString();
    }

    if (editingPromo) {
      updateMut.mutate({ id: editingPromo.id, patch: payload }, { onSuccess: () => setView('list') });
    } else {
      createMut.mutate({ ...payload, createdAt: new Date().toISOString() }, { onSuccess: () => setView('list') });
    }
  };

  if (view === 'edit') {
    return (
      <div className="w-full max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-2 bg-white rounded-lg border border-border hover:bg-zinc-50 transition-colors">
              <X className="w-5 h-5 text-zinc-500" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-primary-dark">{editingPromo ? 'Edit Promotion' : 'New Promotion'}</h1>
              <p className="text-sm text-text-secondary">{formData.title || 'Untitled'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('list')} className="px-4 py-2 font-bold text-sm text-text-secondary hover:text-text-primary">Discard</button>
            <button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending} className="px-6 py-2 bg-primary-dark text-white font-bold text-sm rounded-xl hover:bg-primary-hover shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {(createMut.isPending || updateMut.isPending) ? 'Processing...' : (editingPromo ? 'Save Changes' : 'Create Promotion')}
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* General info */}
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-primary-dark">General Information</h2>
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Internal Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:bg-white focus:border-accent-green outline-none" placeholder="e.g. Summer Sale 20%" />
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Discount Method</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="method" value="code" checked={formData.method === 'code'} onChange={e => setFormData({...formData, method: e.target.value})} className="text-accent-green focus:ring-accent-green" />
                    <span className="text-sm font-semibold">Discount Code</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="method" value="automatic" checked={formData.method === 'automatic'} onChange={e => setFormData({...formData, method: e.target.value})} className="text-accent-green focus:ring-accent-green" />
                    <span className="text-sm font-semibold">Automatic</span>
                  </label>
                </div>
              </div>
              {formData.method === 'code' && (
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Promo Code</label>
                  <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full px-4 py-2 border border-border rounded-xl bg-zinc-50 focus:bg-white focus:border-accent-green outline-none font-mono" placeholder="SUMMER20" />
                </div>
              )}
            </div>
          </div>

          {/* Value */}
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-primary-dark">Value & Rules</h2>
            
            <div className="pt-4 grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Discount Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="discountType" value="percentage" checked={formData.discountType === 'percentage'} onChange={e => setFormData({...formData, discountType: e.target.value})} className="text-accent-green focus:ring-accent-green" />
                    <span className="text-sm font-semibold">Percentage</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="discountType" value="fixed" checked={formData.discountType === 'fixed'} onChange={e => setFormData({...formData, discountType: e.target.value})} className="text-accent-green focus:ring-accent-green" />
                    <span className="text-sm font-semibold">Fixed Amount</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Discount Value</label>
                <div className="relative w-full">
                  <input required type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} className={`w-full ${formData.discountType === 'percentage' ? 'pl-8' : 'pl-10'} pr-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:bg-white focus:border-accent-green outline-none font-bold`} />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">
                    {formData.discountType === 'percentage' ? '%' : '₹'}
                  </span>
                </div>
              </div>
            </div>
          </div>


          {/* Activity */}
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary-dark">Status & Schedule</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="rounded text-accent-green focus:ring-accent-green w-4 h-4" />
                <span className="text-sm font-bold">Active</span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Start Date (Optional)</label>
                <input type="datetime-local" value={formatForInput(formData.startsAt)} onChange={e => setFormData({...formData, startsAt: e.target.value})} className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:bg-white focus:border-accent-green outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">End Date (Optional)</label>
                <input type="datetime-local" value={formatForInput(formData.expiresAt)} onChange={e => setFormData({...formData, expiresAt: e.target.value})} className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:bg-white focus:border-accent-green outline-none" />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="w-full animate-in fade-in duration-300 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] text-accent-green font-bold uppercase tracking-widest font-mono">Growth</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark mt-0.5">Promotions</h1>
          <p className="text-xs text-text-secondary mt-1">Discounts, coupons, and automatic rules</p>
        </div>
        <button onClick={() => handleOpenEdit()} className="flex items-center gap-2 px-6 py-2.5 bg-primary-dark text-white rounded-xl font-bold text-sm hover:bg-primary-hover shadow-sm transition-all">
          <Plus className="w-4 h-4 text-accent-green" />
          Create Promotion
        </button>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-border bg-zinc-50/50 p-4 gap-4">
          <div className="flex overflow-x-auto w-full hide-scrollbar gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'scheduled', label: 'Scheduled' },
              { id: 'expired', label: 'Expired' }
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
              placeholder="Search promos..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white focus:outline-none focus:border-accent-green text-sm transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-zinc-400 font-semibold">Loading promotions...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50/80 text-text-secondary font-semibold border-b border-border text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Title / Code</th>
                  <th className="px-6 py-4">Type</th>

                  <th className="px-6 py-4">Uses</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {promotions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-text-secondary">
                      <Tag className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      <p className="font-bold text-primary-dark">No promotions found.</p>
                    </td>
                  </tr>
                ) : (
                  promotions.map((promo) => (
                    <tr key={promo.id} className="hover:bg-zinc-50/50 transition-colors group cursor-pointer" onClick={() => handleOpenEdit(promo)}>
                      <td className="px-6 py-4">
                        <p className="font-bold text-primary-dark">{promo.title || 'Untitled'}</p>
                        {promo.method === 'code' && <span className="inline-block px-1.5 py-0.5 bg-zinc-100 rounded text-xs font-mono font-bold mt-1">{promo.code}</span>}
                      </td>
                      <td className="px-6 py-4 text-text-secondary capitalize font-semibold">{promo.discountType?.replace('_', ' ')}</td>

                      <td className="px-6 py-4 font-mono text-xs">
                        {promo.usageCount || 0} / {promo.usageLimit || '∞'}
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          const now = new Date();
                          let status = 'Inactive';
                          let style = 'bg-zinc-200 text-zinc-600';
                          if (promo.expiresAt && new Date(promo.expiresAt) < now) {
                            status = 'Expired';
                            style = 'bg-red-100 text-red-700';
                          } else if (promo.startsAt && new Date(promo.startsAt) > now) {
                            status = 'Scheduled';
                            style = 'bg-blue-100 text-blue-700';
                          } else if (promo.active) {
                            status = 'Active';
                            style = 'bg-success/15 text-success-dark';
                          }
                          return (
                            <div className="flex flex-col items-start gap-1">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${style}`}>
                                {status}
                              </span>
                              {status === 'Active' && promo.expiresAt && (
                                <span className="text-[10px] text-zinc-500 font-medium">
                                  Ends in {Math.ceil((new Date(promo.expiresAt) - now) / (1000 * 60 * 60 * 24))}d
                                </span>
                              )}
                              {status === 'Scheduled' && promo.startsAt && (
                                <span className="text-[10px] text-zinc-500 font-medium">
                                  Starts in {Math.ceil((new Date(promo.startsAt) - now) / (1000 * 60 * 60 * 24))}d
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                          <button onClick={() => handleOpenEdit(promo)} className="p-2 text-zinc-400 hover:text-accent-green hover:bg-accent-green/10 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteMut.mutate(promo.id)} className="p-2 text-zinc-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
