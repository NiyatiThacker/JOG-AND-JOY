import React, { useState } from 'react';
import { Search, Edit2, Trash2, CheckCircle2, Image as ImageIcon, Plus, X } from 'lucide-react';
import { useProductsList, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../queries/useProducts';

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    categoryId: 'Boy',
    vendor: '',
    basePrice: '',
    stock: '',
    imageURL: '',
    description: ''
  });

  const { data, isLoading } = useProductsList();
  let products = data?.data || [];

  if (search) {
    products = products.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  }

  const createMut = useCreateProduct();
  const updateMut = useUpdateProduct();
  const deleteMut = useDeleteProduct();

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.categoryId || !formData.vendor || !formData.basePrice || !formData.stock || !formData.imageURL) {
      return alert('Please fill out all required fields.');
    }

    const newProduct = {
      title: formData.title,
      categoryId: formData.categoryId,
      vendor: formData.vendor,
      basePrice: Number(formData.basePrice),
      description: formData.description,
      status: 'live',
      isNew: true,
      images: [formData.imageURL],
      variants: [{
        id: Date.now().toString(),
        sku: `SKU-${Date.now().toString().slice(-6)}`,
        stock: Number(formData.stock),
      }]
    };

    createMut.mutate(newProduct, {
      onSuccess: () => {
        setFormData({
          title: '', categoryId: 'Boy', vendor: '', basePrice: '', stock: '', imageURL: '', description: ''
        });
        setShowForm(false);
      }
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMut.mutate(id);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      
      {/* Top Header & Button */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] text-accent-green font-bold uppercase tracking-widest font-mono">Catalog Management</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark mt-0.5">Products</h1>
          <p className="text-xs text-text-secondary mt-1">Manage active listings and add new products.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="flex items-center gap-2 px-6 py-3 bg-[#f39c12] text-white rounded-xl font-bold hover:bg-[#e67e22] shadow-sm transition-all"
        >
          {showForm ? (
            <>
              <X className="w-5 h-5" />
              Cancel Listing
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Register New Product Listing
            </>
          )}
        </button>
      </div>

      {/* Register New Product Form (Toggled) */}
      {showForm && (
        <div className="bg-white border border-border rounded-xl shadow-sm mb-12 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <div className="p-1.5 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-accent-green" />
            </div>
            <h2 className="text-lg font-bold text-primary-dark">Register New Product Listing</h2>
          </div>
          
          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2">Product Title *</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 border border-border rounded-xl focus:border-accent-green outline-none" placeholder="e.g. Handmade Terracotta Bowl" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2">Category *</label>
                <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full px-4 py-3 border border-border rounded-xl focus:border-accent-green outline-none" required>
                  <option value="Boy">Boy</option>
                  <option value="Girl">Girl</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2">Brand Name *</label>
                <input type="text" value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} className="w-full px-4 py-3 border border-border rounded-xl focus:border-accent-green outline-none" placeholder="e.g. Mitti Handlooms" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2">Price (₹) *</label>
                <input type="number" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} className="w-full px-4 py-3 border border-border rounded-xl focus:border-accent-green outline-none" placeholder="e.g. 500" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary mb-2">Stock Qty *</label>
                <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-3 border border-border rounded-xl focus:border-accent-green outline-none" placeholder="e.g. 20" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2">Image URL *</label>
              <input type="url" value={formData.imageURL} onChange={e => setFormData({...formData, imageURL: e.target.value})} className="w-full px-4 py-3 border border-border rounded-xl focus:border-accent-green outline-none" placeholder="https://images.unsplash.com/..." required />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-secondary mb-2">Product Description</label>
              <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 border border-border rounded-xl focus:border-accent-green outline-none resize-none" placeholder="Rich description of materials used, artisans involved, etc."></textarea>
            </div>

            <button type="submit" disabled={createMut.isPending} className="w-full py-4 bg-[#f39c12] hover:bg-[#e67e22] text-white font-bold rounded-xl transition-colors text-lg">
              Submit Product Listing
            </button>
          </form>
        </div>
      )}

      {/* Active Product Listings */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden mb-12">
        <div className="p-4 border-b border-border flex justify-between items-center bg-zinc-50/50">
          <h2 className="text-xl font-extrabold text-primary-dark">Active Product Listings</h2>
          <div className="px-3 py-1 bg-zinc-100 text-zinc-500 rounded-lg text-sm font-bold">
            {products.length} Listings Total
          </div>
        </div>
        
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-zinc-400 font-semibold">Loading catalog...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-zinc-400 font-bold border-b border-border text-[11px] uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">SKU / Code</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-zinc-400">No products found.</td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
                    const sku = product.variants?.[0]?.sku || '-';
                    const image = product.images?.[0];
                    
                    return (
                      <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 border border-border flex items-center justify-center shrink-0">
                              {image ? (
                                <img src={image} alt={product.title} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-zinc-300" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-primary-dark">{product.title}</p>
                              <p className="text-xs text-zinc-400">{product.categoryId || product.vendor}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-bold text-zinc-600">{sku}</td>
                        <td className="px-6 py-4 font-bold text-zinc-600">
                          <span className={totalStock <= 5 ? "text-[#f39c12]" : ""}>{totalStock} units</span>
                        </td>
                        <td className="px-6 py-4 font-extrabold text-primary-dark">₹{product.basePrice}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-green-50 text-accent-green">
                            Approved
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-3">
                            <button className="text-accent-green hover:opacity-80 transition-opacity">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:opacity-80 transition-opacity">
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
