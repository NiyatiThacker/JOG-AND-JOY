import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Truck, RefreshCw, FileText, MapPin, Users, Search, Plus, Filter, ArrowRightLeft, X, Image as ImageIcon } from 'lucide-react';
import { useProductsList, useUpdateProduct } from '../../queries/useProducts';
import { useSettings } from '../../queries/useSettings';

const StockRow = ({ item, product, updateMut }) => {
  const [localStock, setLocalStock] = useState(item.onHand);
  
  useEffect(() => {
    setLocalStock(item.onHand);
  }, [item.onHand]);

  const available = localStock - item.reserved;
  const isOut = available <= 0;
  const isLow = !isOut && available <= item.threshold;

  const commitStockChange = (newStock) => {
    if (newStock < 0) return;
    setLocalStock(newStock);
    const newVariants = product.variants.map(v => 
      v.id === item.variantId ? { ...v, stock: newStock } : v
    );
    const totalStock = newVariants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
    updateMut.mutate({ id: product.id, patch: { variants: newVariants, stock: totalStock } });
  };

  return (
    <tr className="hover:bg-zinc-50/50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 border border-slate-200 flex items-center justify-center shrink-0">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-5 h-5 text-zinc-300" />
            )}
          </div>
          <div>
            <p className="font-bold text-text-dark">{item.productTitle}</p>
            {item.variantSize && item.variantColor && (item.variantSize !== 'Standard' || item.variantColor !== 'Standard') && (
              <p className="text-xs font-bold text-blue-600 mb-0.5">
                {item.variantColor !== 'Standard' ? item.variantColor : ''} 
                {item.variantColor !== 'Standard' && item.variantSize !== 'Standard' ? ' • ' : ''} 
                {item.variantSize !== 'Standard' ? item.variantSize : ''}
              </p>
            )}
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{product.vendor || 'Jog & Joy'} • {product.categoryId || 'General'}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="font-mono text-xs font-bold text-zinc-700">{item.sku}</p>
        {product.weight > 0 && <p className="text-[10px] text-zinc-400 mt-1">weight: {product.weight}kg</p>}
      </td>
      <td className="px-6 py-4 font-extrabold text-text-dark">₹{product.price || product.basePrice}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${
          product.status === 'live' ? 'bg-green-500/15 text-green-700' : 'bg-zinc-100 text-zinc-500'
        }`}>
          {product.status === 'live' ? 'Live' : 'Draft'}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${
          isOut ? 'bg-red-500/10 text-red-700' : isLow ? 'bg-orange-500/15 text-orange-700' : 'bg-green-500/15 text-green-700'
        }`}>
          {isOut ? 'Out of Stock' : isLow ? `Low Stock (${available})` : `Healthy (${available})`}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => commitStockChange(Math.max(0, localStock - 1))}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-zinc-600 hover:bg-zinc-50 transition-colors font-bold"
          >
            -
          </button>
          <input 
            type="number" 
            min="0"
            value={localStock}
            onChange={(e) => setLocalStock(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
            onBlur={() => {
              const finalStock = localStock === '' ? 0 : Number(localStock);
              commitStockChange(finalStock);
              setLocalStock(finalStock);
            }}
            className="w-14 h-8 text-center border border-slate-200 rounded-lg bg-white font-bold text-sm focus:ring-1 focus:ring-blue-600 outline-none"
          />
          <button 
            onClick={() => commitStockChange(localStock + 1)}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-zinc-600 hover:bg-zinc-50 transition-colors font-bold"
          >
            +
          </button>
        </div>
      </td>
    </tr>
  );
};

export default function AdminInventory() {
  const [search, setSearch] = useState('');
  const [filterStockLevel, setFilterStockLevel] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const { data: settingsData } = useSettings();
  const settings = settingsData?.data?.[0] || {};
  const globalThreshold = settings.defaultLowStockThreshold || 5;

  const { data, isLoading } = useProductsList();
  const products = data?.data || [];
  const updateMut = useUpdateProduct();

  // Derived variants list
  let stockItems = [];
  products.forEach(p => {
    if (p.trackQuantity !== false && p.status !== 'archived') {
      p.variants?.forEach(v => {
        stockItems.push({
          productId: p.id,
          productTitle: p.title,
          variantId: v.id,
          variantSize: v.size,
          variantColor: v.colorName,
          sku: v.sku,
          onHand: v.stock || 0,
          reserved: 0,
          threshold: p.lowStockThreshold ?? globalThreshold,
          productRef: p
        });
      });
    }
  });

  if (search) {
    const q = search.toLowerCase();
    stockItems = stockItems.filter(item => 
      item.productTitle.toLowerCase().includes(q) || 
      (item.sku && item.sku.toLowerCase().includes(q)) ||
      (item.productRef?.vendor && item.productRef.vendor.toLowerCase().includes(q))
    );
  }

  if (filterStockLevel !== 'all') {
    stockItems = stockItems.filter(item => {
      const available = item.onHand - item.reserved;
      if (filterStockLevel === 'low_stock') return available > 0 && available <= item.threshold;
      if (filterStockLevel === 'out_of_stock') return available <= 0;
      if (filterStockLevel === 'in_stock') return available > item.threshold;
      return true;
    });
  }

  const totalItems = stockItems.length;
  const lowStockItems = stockItems.filter(item => (item.onHand - item.reserved) > 0 && (item.onHand - item.reserved) <= item.threshold).length;
  const outOfStockItems = stockItems.filter(item => (item.onHand - item.reserved) <= 0).length;

  return (
    <div className="w-full animate-in fade-in duration-300 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-text-dark">Inventory Management</h1>
        <p className="text-sm text-text-muted mt-1">Track and manage your product stock levels across all listings.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button onClick={() => setFilterStockLevel('all')} className="text-left bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 group-hover:text-blue-600 transition-colors">Total Items Tracked</p>
          <p className="text-3xl font-extrabold text-text-dark">{totalItems}</p>
        </button>
        <button onClick={() => setFilterStockLevel('low_stock')} className="text-left bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:border-warning hover:shadow-md transition-all group">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 group-hover:text-[#f39c12] transition-colors">Low Stock Alert</p>
          <p className="text-3xl font-extrabold text-[#f39c12]">{lowStockItems}</p>
        </button>
        <button onClick={() => setFilterStockLevel('out_of_stock')} className="text-left bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:border-error hover:shadow-md transition-all group">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 group-hover:text-red-500 transition-colors">Out Of Stock</p>
          <p className="text-3xl font-extrabold text-red-500">{outOfStockItems}</p>
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm transition-all overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-50/50">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-text-dark">Active Product Inventory</h2>
            <Package className="w-5 h-5 text-blue-600 ml-2" />
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={filterStockLevel} 
              onChange={e => setFilterStockLevel(e.target.value)}
              className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-bold text-text-dark focus:outline-none focus:ring-1 focus:ring-slate-400 shadow-sm"
            >
              <option value="all">All Stock Levels</option>
              <option value="in_stock">Healthy (In Stock)</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search SKU or product..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-sm transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-100">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-zinc-400 font-semibold">Loading inventory...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs font-bold text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Product Info</th>
                  <th className="px-5 py-3 font-medium">SKU / Attributes</th>
                  <th className="px-5 py-3 font-medium">Retail Price</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Current Stock</th>
                  <th className="px-5 py-3 font-medium">Quick Stock Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-zinc-400">No inventory items found.</td>
                  </tr>
                ) : (
                  stockItems.map(item => (
                    <StockRow 
                      key={item.variantId} 
                      item={item} 
                      product={item.productRef}
                      updateMut={updateMut} 
                    />
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
