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
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 border border-border flex items-center justify-center shrink-0">
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-5 h-5 text-zinc-300" />
            )}
          </div>
          <div>
            <p className="font-bold text-primary-dark">{item.productTitle}</p>
            {item.variantSize && item.variantColor && (item.variantSize !== 'Standard' || item.variantColor !== 'Standard') && (
              <p className="text-xs font-bold text-accent-green mb-0.5">
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
      <td className="px-6 py-4 font-extrabold text-primary-dark">₹{product.price || product.basePrice}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${
          product.status === 'live' ? 'bg-green-50 text-accent-green' : 'bg-zinc-100 text-zinc-500'
        }`}>
          {product.status === 'live' ? 'Live' : 'Draft'}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${
          isOut ? 'bg-red-50 text-red-500' : isLow ? 'bg-[#fef5e6] text-[#f39c12]' : 'bg-green-50 text-accent-green'
        }`}>
          {isOut ? 'Out of Stock' : isLow ? `Low Stock (${available})` : `Healthy (${available})`}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => commitStockChange(Math.max(0, localStock - 1))}
            className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center text-zinc-600 hover:bg-zinc-50 transition-colors font-bold"
          >
            -
          </button>
          <input 
            type="number" 
            min="0"
            value={localStock}
            onChange={(e) => setLocalStock(Math.max(0, Number(e.target.value)))}
            onBlur={() => commitStockChange(localStock)}
            className="w-14 h-8 text-center border border-border rounded-lg bg-white font-bold text-sm focus:border-accent-green outline-none"
          />
          <button 
            onClick={() => commitStockChange(localStock + 1)}
            className="w-8 h-8 rounded-lg border border-border bg-white flex items-center justify-center text-zinc-600 hover:bg-zinc-50 transition-colors font-bold"
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
      (item.sku && item.sku.toLowerCase().includes(q))
    );
  }

  const totalItems = stockItems.length;
  const lowStockItems = stockItems.filter(item => (item.onHand - item.reserved) > 0 && (item.onHand - item.reserved) <= item.threshold).length;
  const outOfStockItems = stockItems.filter(item => (item.onHand - item.reserved) <= 0).length;

  return (
    <div className="w-full animate-in fade-in duration-300 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-primary-dark">Inventory Management</h1>
        <p className="text-sm text-text-secondary mt-1">Track and manage your product stock levels across all listings.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Total Items Tracked</p>
          <p className="text-3xl font-extrabold text-primary-dark">{totalItems}</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Low Stock Alert</p>
          <p className="text-3xl font-extrabold text-[#f39c12]">{lowStockItems}</p>
        </div>
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Out Of Stock</p>
          <p className="text-3xl font-extrabold text-red-500">{outOfStockItems}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center bg-zinc-50/50">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-primary-dark">Active Product Inventory</h2>
            <Package className="w-5 h-5 text-accent-green ml-2" />
          </div>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search SKU or product..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-white focus:outline-none focus:border-accent-green text-sm transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-zinc-400 font-semibold">Loading inventory...</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-zinc-400 font-bold border-b border-border text-[11px] uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Product Info</th>
                  <th className="px-6 py-4">SKU / Attributes</th>
                  <th className="px-6 py-4">Retail Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Current Stock</th>
                  <th className="px-6 py-4">Quick Stock Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
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
