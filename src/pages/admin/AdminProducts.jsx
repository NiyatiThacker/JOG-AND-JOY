import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, X, Archive, Filter, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { useProductsList, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../queries/useProducts';
import { useSettings } from '../../queries/useSettings';

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  
  // Views: 'list', 'edit'
  const [view, setView] = useState('list');
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Settings for threshold
  const { data: settingsData } = useSettings();
  const settings = settingsData?.data?.[0] || {};
  const globalThreshold = settings.defaultLowStockThreshold || 5;

  // Form State
  const [formData, setFormData] = useState({});
  const [formTab, setFormTab] = useState('general');

  // Query Data
  const filters = {};
  if (activeTab === 'live') filters.status = 'live';
  if (activeTab === 'pending') filters.status = 'pending_review';
  if (activeTab === 'drafts') filters.status = 'draft';
  if (activeTab === 'archived') filters.status = 'archived';
  if (search) filters.search = search;
  
  const { data, isLoading } = useProductsList(filters);
  let products = data?.data || [];

  // Client-side filtering for complex computed fields
  if (activeTab === 'low_stock') {
    products = products.filter(p => {
      if (p.status === 'archived') return false;
      const threshold = p.lowStockThreshold ?? globalThreshold;
      const totalStock = p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
      return totalStock > 0 && totalStock <= threshold;
    });
  }
  if (activeTab === 'out_of_stock') {
    products = products.filter(p => {
      if (p.status === 'archived') return false;
      const totalStock = p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
      return totalStock === 0;
    });
  }

  const createMut = useCreateProduct();
  const updateMut = useUpdateProduct();
  const deleteMut = useDeleteProduct();

  const handleOpenEdit = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product
      });
    } else {
      setEditingProduct(null);
      setFormData({ 
        title: '', 
        slug: '',
        description: '',
        categoryId: 'cat-1', 
        basePrice: 0, 
        compareAtPrice: 0,
        costPerItem: 0,
        status: 'draft',
        vendor: '',
        productType: '',
        variants: [],
        seoTitle: '',
        seoDescription: '',
        trackQuantity: true,
        allowBackorder: false,
        taxStatus: 'taxable',
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 }
      });
    }
    setView('edit');
    setFormTab('general');
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Required field validation for LIVE
    if (formData.status === 'live') {
      if (!formData.title) return alert('Title is required to go live.');
      if (!formData.categoryId) return alert('Category is required to go live.');
      // more validation as per spec...
    }

    const payload = { ...formData };

    if (editingProduct) {
      updateMut.mutate({ id: editingProduct.id, patch: payload }, {
        onSuccess: () => setView('list')
      });
    } else {
      createMut.mutate(payload, {
        onSuccess: () => setView('list')
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product? Only allowed if no order history exists.')) {
      deleteMut.mutate(id);
    }
  };

  const handleArchive = (id) => {
    updateMut.mutate({ id, patch: { status: 'archived' } });
  };

  if (view === 'edit') {
    return (
      <div className="w-full max-w-5xl mx-auto pb-12 animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setView('list')} className="p-2 bg-white rounded-lg border border-border hover:bg-zinc-50">
              <X className="w-5 h-5 text-zinc-500" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-primary-dark">{editingProduct ? 'Edit Product' : 'New Product'}</h1>
              <p className="text-sm text-text-secondary">{formData.title || 'Untitled'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('list')} className="px-4 py-2 font-bold text-sm text-text-secondary hover:text-text-primary">Discard</button>
            <button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending} className="px-6 py-2 bg-primary-dark text-white font-bold text-sm rounded-xl hover:bg-primary-hover shadow-sm">
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 shrink-0 space-y-1">
            {[
              { id: 'general', label: 'General' },
              { id: 'media', label: 'Media' },
              { id: 'pricing', label: 'Pricing' },
              { id: 'variants', label: 'Variants' },
              { id: 'inventory', label: 'Inventory' },
              { id: 'shipping', label: 'Shipping' },
              { id: 'organization', label: 'Organization' },
              { id: 'seo', label: 'SEO' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFormTab(tab.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  formTab === tab.id ? 'bg-primary-dark/5 text-primary-dark' : 'text-text-secondary hover:bg-zinc-50 hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 bg-white border border-border rounded-2xl shadow-sm p-6">
            <form onSubmit={handleSave} className="space-y-6">
              
              {formTab === 'general' && (
                <div className="space-y-5 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Title</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green focus:bg-white transition-colors outline-none font-medium" placeholder="e.g. Premium Cotton Hoodie" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Description</label>
                    <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 border border-border rounded-xl bg-zinc-50 focus:border-accent-green focus:bg-white transition-colors outline-none text-sm resize-none" placeholder="Product details..."></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Vendor</label>
                      <input type="text" value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-zinc-50 focus:border-accent-green outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Product Type</label>
                      <input type="text" value={formData.productType} onChange={e => setFormData({...formData, productType: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg bg-zinc-50 focus:border-accent-green outline-none" />
                    </div>
                  </div>
                  <div className="p-4 bg-zinc-50 rounded-xl border border-border mt-4">
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Publishing Status</label>
                    <div className="flex gap-4">
                      {['draft', 'pending_review', 'live'].map(st => (
                        <label key={st} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="status" value={st} checked={formData.status === st} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-4 h-4 text-accent-green focus:ring-accent-green border-gray-300" />
                          <span className="text-sm font-semibold capitalize">{st.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {formTab === 'pricing' && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Base Price</label>
                      <input type="number" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: Number(e.target.value)})} className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Compare-at Price</label>
                      <input type="number" value={formData.compareAtPrice} onChange={e => setFormData({...formData, compareAtPrice: Number(e.target.value)})} className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none" placeholder="Optional" />
                    </div>
                  </div>
                  <hr className="border-border" />
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Cost per item (Admin only)</label>
                      <input type="number" value={formData.costPerItem} onChange={e => setFormData({...formData, costPerItem: Number(e.target.value)})} className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Tax Status</label>
                      <select value={formData.taxStatus} onChange={e => setFormData({...formData, taxStatus: e.target.value})} className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none">
                        <option value="taxable">Taxable</option>
                        <option value="exempt">Exempt</option>
                      </select>
                    </div>
                  </div>
                  
                  {formData.basePrice > 0 && formData.costPerItem > 0 && (
                    <div className="bg-success/10 p-4 rounded-xl flex items-center justify-between">
                      <span className="text-sm font-bold text-success-dark">Margin</span>
                      <span className="text-lg font-extrabold text-success">
                        {(((formData.basePrice - formData.costPerItem) / formData.basePrice) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              {formTab === 'variants' && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-primary-dark uppercase tracking-widest">Product Variants</h3>
                    <button type="button" onClick={() => setFormData({...formData, variants: [...(formData.variants || []), { id: Date.now().toString(), size: '', color: '', sku: '', stock: 0, priceOverride: 0 }]})} className="px-3 py-1.5 bg-zinc-100 text-primary-dark font-bold text-xs rounded-lg hover:bg-zinc-200">
                      + Add Variant
                    </button>
                  </div>
                  {(!formData.variants || formData.variants.length === 0) ? (
                    <div className="p-8 text-center bg-zinc-50 rounded-xl border border-border text-zinc-400 font-semibold">
                      No variants added. This product has only one default variation.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.variants.map((v, i) => (
                        <div key={v.id} className="p-4 border border-border rounded-xl bg-zinc-50 flex gap-4 items-start">
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-1">
                            <div>
                              <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">Size</label>
                              <input type="text" value={v.size || ''} onChange={e => { const newV = [...formData.variants]; newV[i].size = e.target.value; setFormData({...formData, variants: newV})}} className="w-full px-3 py-1.5 rounded-lg border border-border text-sm" placeholder="e.g. M" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">Color</label>
                              <input type="text" value={v.color || ''} onChange={e => { const newV = [...formData.variants]; newV[i].color = e.target.value; setFormData({...formData, variants: newV})}} className="w-full px-3 py-1.5 rounded-lg border border-border text-sm" placeholder="e.g. Red" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">SKU</label>
                              <input type="text" value={v.sku || ''} onChange={e => { const newV = [...formData.variants]; newV[i].sku = e.target.value; setFormData({...formData, variants: newV})}} className="w-full px-3 py-1.5 rounded-lg border border-border text-sm" placeholder="SKU-123" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">Stock</label>
                              <input type="number" value={v.stock || 0} onChange={e => { const newV = [...formData.variants]; newV[i].stock = Number(e.target.value); setFormData({...formData, variants: newV})}} className="w-full px-3 py-1.5 rounded-lg border border-border text-sm" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">Price Override</label>
                              <input type="number" value={v.priceOverride || 0} onChange={e => { const newV = [...formData.variants]; newV[i].priceOverride = Number(e.target.value); setFormData({...formData, variants: newV})}} className="w-full px-3 py-1.5 rounded-lg border border-border text-sm" placeholder="Optional" />
                            </div>
                          </div>
                          <button type="button" onClick={() => { const newV = formData.variants.filter((_, idx) => idx !== i); setFormData({...formData, variants: newV})}} className="p-1.5 text-zinc-400 hover:text-error hover:bg-error/10 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {formTab === 'inventory' && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="text-sm font-bold text-primary-dark uppercase tracking-widest mb-4">Inventory Tracking</h3>
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-border rounded-xl bg-zinc-50 hover:bg-white transition-colors">
                    <input type="checkbox" checked={formData.trackQuantity !== false} onChange={e => setFormData({...formData, trackQuantity: e.target.checked})} className="w-4 h-4 text-accent-green focus:ring-accent-green rounded border-border" />
                    <div>
                      <span className="block text-sm font-bold text-primary-dark">Track Quantity</span>
                      <span className="block text-xs text-text-secondary">Automatically update inventory levels as orders are placed.</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-border rounded-xl bg-zinc-50 hover:bg-white transition-colors">
                    <input type="checkbox" checked={formData.allowBackorder === true} onChange={e => setFormData({...formData, allowBackorder: e.target.checked})} className="w-4 h-4 text-accent-green focus:ring-accent-green rounded border-border" />
                    <div>
                      <span className="block text-sm font-bold text-primary-dark">Allow Backorders</span>
                      <span className="block text-xs text-text-secondary">Customers can purchase this item even when stock is zero.</span>
                    </div>
                  </label>
                </div>
              )}

              {formTab === 'seo' && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="text-sm font-bold text-primary-dark uppercase tracking-widest mb-4">Search Engine Optimization</h3>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Page Title</label>
                    <input type="text" value={formData.seoTitle || ''} onChange={e => setFormData({...formData, seoTitle: e.target.value})} className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none" placeholder={formData.title || "Leave blank to use product title"} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Meta Description</label>
                    <textarea rows="4" value={formData.seoDescription || ''} onChange={e => setFormData({...formData, seoDescription: e.target.value})} className="w-full px-4 py-3 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none text-sm resize-none" placeholder="Brief description for search engines..."></textarea>
                  </div>
                </div>
              )}

              {formTab === 'media' && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="text-sm font-bold text-primary-dark uppercase tracking-widest mb-4">Product Images</h3>
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer">
                    <UploadCloud className="w-10 h-10 text-zinc-400 mb-3" />
                    <p className="font-bold text-primary-dark">Click or drag images here</p>
                    <p className="text-sm text-text-secondary mt-1">Supports JPG, PNG, WEBP (Max 5MB)</p>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mt-6">
                    <div className="aspect-square bg-zinc-100 rounded-xl border border-border flex flex-col items-center justify-center text-zinc-400 relative">
                      <span className="text-xs font-bold">Main Image</span>
                    </div>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="aspect-square bg-zinc-50 rounded-xl border border-dashed border-border flex items-center justify-center text-zinc-400">
                        <Plus className="w-6 h-6 opacity-20" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formTab === 'shipping' && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="text-sm font-bold text-primary-dark uppercase tracking-widest mb-4">Shipping Info</h3>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Weight (kg)</label>
                    <input type="number" value={formData.weight || 0} onChange={e => setFormData({...formData, weight: Number(e.target.value)})} className="w-full sm:w-1/2 px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Length (cm)</label>
                      <input type="number" value={formData.dimensions?.length || 0} onChange={e => setFormData({...formData, dimensions: {...formData.dimensions, length: Number(e.target.value)}})} className="w-full px-4 py-2 border border-border rounded-lg bg-zinc-50 focus:border-accent-green outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Width (cm)</label>
                      <input type="number" value={formData.dimensions?.width || 0} onChange={e => setFormData({...formData, dimensions: {...formData.dimensions, width: Number(e.target.value)}})} className="w-full px-4 py-2 border border-border rounded-lg bg-zinc-50 focus:border-accent-green outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Height (cm)</label>
                      <input type="number" value={formData.dimensions?.height || 0} onChange={e => setFormData({...formData, dimensions: {...formData.dimensions, height: Number(e.target.value)}})} className="w-full px-4 py-2 border border-border rounded-lg bg-zinc-50 focus:border-accent-green outline-none" />
                    </div>
                  </div>
                  <hr className="border-border my-2" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Country/Region of Origin</label>
                      <select value={formData.countryOfOrigin || ''} onChange={e => setFormData({...formData, countryOfOrigin: e.target.value})} className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none">
                        <option value="">Select country...</option>
                        <option value="IN">India</option>
                        <option value="CN">China</option>
                        <option value="US">United States</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">HS (Harmonized System) Code</label>
                      <input type="text" value={formData.hsCode || ''} onChange={e => setFormData({...formData, hsCode: e.target.value})} className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none" placeholder="e.g. 6109.10" />
                    </div>
                  </div>
                </div>
              )}

              {formTab === 'organization' && (
                <div className="space-y-5 animate-in fade-in">
                  <h3 className="text-sm font-bold text-primary-dark uppercase tracking-widest mb-4">Organization</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Product Category</label>
                      <select value={formData.categoryId || ''} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none">
                        <option value="cat-1">Kids T-Shirts</option>
                        <option value="cat-2">Kids Joggers & Tracks</option>
                        <option value="cat-3">Kids Shorts & Bermudas</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Collections</label>
                      <input type="text" value={formData.collections || ''} onChange={e => setFormData({...formData, collections: e.target.value})} className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none" placeholder="e.g. Summer 2026, Featured" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Tags</label>
                    <input type="text" value={formData.tags || ''} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none" placeholder="Comma separated tags (e.g. cotton, casual, blue)" />
                  </div>
                  <div className="p-4 bg-zinc-50 border border-border rounded-xl">
                    <p className="text-sm text-text-secondary">Vendor and Product Type are configured in the General tab.</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="w-full animate-in fade-in duration-300">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] text-accent-green font-bold uppercase tracking-widest font-mono">Catalog Management</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark mt-0.5">Products</h1>
          <p className="text-xs text-text-secondary mt-1">Manage listings, inventory, and publishing</p>
        </div>
        <button 
          onClick={() => handleOpenEdit()} 
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-dark text-white rounded-xl font-bold text-sm hover:bg-primary-hover shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-accent-green" />
          Add Product
        </button>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* Horizontal Tabs & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-border bg-zinc-50/50 p-4 gap-4">
          <div className="flex overflow-x-auto w-full hide-scrollbar gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'live', label: 'Live' },
              { id: 'pending', label: 'Pending Review' },
              { id: 'drafts', label: 'Drafts' },
              { id: 'archived', label: 'Archived' },
              { id: 'low_stock', label: 'Low Stock' },
              { id: 'out_of_stock', label: 'Out of Stock' }
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

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative">
              <button onClick={() => setShowFilter(!showFilter)} className="p-2.5 border border-border rounded-xl bg-white text-zinc-500 hover:text-primary-dark hover:border-primary-dark transition-colors">
                <Filter className="w-4 h-4" />
              </button>
              {showFilter && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-lg z-50 p-2 animate-in fade-in">
                  <div className="px-3 py-2 text-[10px] font-bold text-text-secondary uppercase tracking-wider">Advanced Filters</div>
                  <div className="p-2">
                    <p className="text-xs text-zinc-500 mb-2">More filters coming soon.</p>
                    <button onClick={() => setShowFilter(false)} className="w-full py-1.5 text-xs font-bold bg-zinc-100 rounded-lg hover:bg-zinc-200">Close</button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white focus:outline-none focus:border-accent-green text-sm transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-zinc-400 font-semibold">Loading catalog...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50/80 text-text-secondary font-semibold border-b border-border text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-text-secondary">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
                          <Search className="w-5 h-5 text-zinc-400" />
                        </div>
                        <p className="font-bold text-primary-dark">No products found</p>
                        <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
                    const stockStatus = totalStock === 0 ? 'out' : totalStock <= (product.lowStockThreshold || globalThreshold) ? 'low' : 'ok';
                    
                    return (
                      <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors group cursor-pointer" onClick={() => handleOpenEdit(product)}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-100 rounded-lg border border-border flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-zinc-400">IMG</span>
                            </div>
                            <div>
                              <p className="font-extrabold text-primary-dark group-hover:text-accent-green transition-colors">{product.title}</p>
                              <p className="text-xs text-text-secondary mt-0.5">{product.variants?.length || 0} variants</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-text-secondary font-medium">{product.categoryId}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                            product.status === 'live' ? 'bg-success/15 text-success-dark' : 
                            product.status === 'pending_review' ? 'bg-warning/15 text-warning-dark' : 
                            product.status === 'archived' ? 'bg-error/10 text-error' :
                            'bg-zinc-200 text-zinc-600'
                          }`}>
                            {product.status === 'live' && <CheckCircle2 className="w-3 h-3" />}
                            {product.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${
                            stockStatus === 'out' ? 'text-error' :
                            stockStatus === 'low' ? 'text-warning-dark' :
                            'text-text-primary'
                          }`}>
                            {totalStock} in stock
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-primary-dark">₹{product.basePrice}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                            {product.status !== 'archived' && (
                              <button onClick={() => handleArchive(product.id)} className="p-2 text-zinc-400 hover:text-warning hover:bg-warning/10 rounded-lg transition-colors" title="Archive">
                                <Archive className="w-4 h-4" />
                              </button>
                            )}
                            <button onClick={() => handleDelete(product.id)} className="p-2 text-zinc-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
