import React, { useState } from 'react';
import { Tag, Plus, Trash2, Search, Edit2, CheckCircle2, Clock, X, Percent, TrendingDown, Gift, Truck } from 'lucide-react';
import { usePromotionsList, useCreatePromotion, useUpdatePromotion, useDeletePromotion } from '../../queries/usePromotions';
import { useSettingsContext } from '../../context/SettingsContext';

export default function AdminPromotions() {
  const [activeTab, setActiveTab] = useState('active');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list');
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({});

  const { formatCurrency, formatDate } = useSettingsContext();

  const { data, isLoading } = usePromotionsList();
  let promotions = data?.data || [];

  if (activeTab === 'active') promotions = promotions.filter(p => p.active);
  if (activeTab === 'scheduled') promotions = promotions.filter(p => !p.active && new Date(p.startsAt) > new Date());
  if (activeTab === 'expired') promotions = promotions.filter(p => !p.active && new Date(p.expiresAt) < new Date());

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
      setEditingPromo(promo);
      setFormData(promo);
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
    if (editingPromo) {
      updateMut.mutate({ id: editingPromo.id, patch: formData }, { onSuccess: () => setView('list') });
    } else {
      createMut.mutate({ ...formData, createdAt: new Date().toISOString() }, { onSuccess: () => setView('list') });
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
            <button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending} className="px-6 py-2 bg-primary-dark text-white font-bold text-sm rounded-xl hover:bg-primary-hover shadow-sm">
              {editingPromo ? 'Save Changes' : 'Create Promotion'}
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
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'percentage', icon: <Percent className="w-4 h-4"/>, label: 'Percentage' },
                { id: 'flat', icon: <TrendingDown className="w-4 h-4"/>, label: 'Fixed Amount' },
                { id: 'free_shipping', icon: <Truck className="w-4 h-4"/>, label: 'Free Shipping' },
                { id: 'buy_x_get_y', icon: <Gift className="w-4 h-4"/>, label: 'Buy X Get Y' }
              ].map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({...formData, discountType: type.id})}
                  className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-colors ${
                    formData.discountType === type.id ? 'border-primary-dark bg-primary-dark/5 text-primary-dark' : 'border-border bg-white text-zinc-500 hover:bg-zinc-50'
                  }`}
                >
                  {type.icon}
                  <span className="text-sm font-bold">{type.label}</span>
                </button>
              ))}
            </div>

            {formData.discountType !== 'free_shipping' && formData.discountType !== 'buy_x_get_y' && (
              <div className="pt-4">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Discount Value</label>
                <div className="relative w-1/3">
                  <input required type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} className="w-full pl-8 pr-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:bg-white focus:border-accent-green outline-none font-bold" />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">{formData.discountType === 'percentage' ? '%' : '₹'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Targets */}
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-primary-dark">Applies To</h2>
            <select value={formData.targetScope} onChange={e => setFormData({...formData, targetScope: e.target.value})} className="w-full max-w-sm px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:outline-none focus:border-accent-green font-semibold">
              <option value="entire_order">Entire Order</option>
              <option value="specific_collections">Specific Collections</option>
              <option value="specific_products">Specific Products</option>
            </select>
          </div>

          {/* Activity */}
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-primary-dark">Status</h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="rounded text-accent-green focus:ring-accent-green w-4 h-4" />
                <span className="text-sm font-bold">Active</span>
              </label>
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
                  <th className="px-6 py-4">Target</th>
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
                      <td className="px-6 py-4 text-text-secondary capitalize">{promo.targetScope?.replace('_', ' ')}</td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {promo.usageCount || 0} / {promo.usageLimit || '∞'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                          promo.active ? 'bg-success/15 text-success-dark' : 'bg-zinc-200 text-zinc-600'
                        }`}>
                          {promo.active ? 'Active' : 'Inactive'}
                        </span>
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
