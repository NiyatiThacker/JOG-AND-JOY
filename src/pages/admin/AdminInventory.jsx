import React, { useState } from 'react';
import { Package, AlertTriangle, Truck, RefreshCw, FileText, MapPin, Users, Search, Plus, Filter, ArrowRightLeft, X } from 'lucide-react';
import { useProductsList, useUpdateProduct } from '../../queries/useProducts';
import { useSettings } from '../../queries/useSettings';

export default function AdminInventory() {
  const [activeTab, setActiveTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [showPOModal, setShowPOModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState(null);
  const [newStock, setNewStock] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  
  const { data: settingsData } = useSettings();
  const settings = settingsData?.data?.[0] || {};
  const globalThreshold = settings.defaultLowStockThreshold || 5;

  const { data, isLoading } = useProductsList();
  const products = data?.data || [];
  
  const updateMut = useUpdateProduct();

  const handleAdjustStock = () => {
    if (!adjustingItem) return;
    const product = products.find(p => p.id === adjustingItem.productId);
    if (product) {
      const newVariants = product.variants.map(v => 
        v.id === adjustingItem.variantId ? { ...v, stock: newStock } : v
      );
      updateMut.mutate({ id: product.id, patch: { variants: newVariants } }, {
        onSuccess: () => setAdjustingItem(null)
      });
    }
  };

  // Derived variants list across all products for the Stock Overview table
  let stockItems = [];
  products.forEach(p => {
    if (p.trackQuantity !== false && p.status !== 'archived') {
      p.variants?.forEach(v => {
        stockItems.push({
          productId: p.id,
          productTitle: p.title,
          variantId: v.id,
          sku: v.sku,
          barcode: v.barcode || '-',
          onHand: v.stock || 0,
          reserved: 0, // Mocked
          incoming: 0, // Mocked
          threshold: p.lowStockThreshold ?? globalThreshold,
          allowBackorder: p.allowBackorder
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

  if (activeTab === 'alerts') {
    stockItems = stockItems.filter(item => {
      const available = item.onHand - item.reserved;
      return available <= item.threshold;
    });
  }

  const renderOverviewTable = () => (
    <div className="overflow-x-auto min-h-[400px]">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50/80 text-text-secondary font-semibold border-b border-border text-[11px] uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">Product / Variant</th>
            <th className="px-6 py-4">SKU</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">On Hand</th>
            <th className="px-6 py-4 text-right">Committed</th>
            <th className="px-6 py-4 text-right">Available</th>
            <th className="px-6 py-4 text-right">Incoming</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {stockItems.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-12 text-center text-text-secondary">
                <Package className="w-8 h-8 mx-auto mb-3 opacity-20" />
                <p>No inventory items found.</p>
              </td>
            </tr>
          ) : (
            stockItems.map(item => {
              const available = item.onHand - item.reserved;
              const isOut = available <= 0;
              const isLow = !isOut && available <= item.threshold;
              
              return (
                <tr 
                  key={item.variantId} 
                  className="hover:bg-zinc-50/50 transition-colors group cursor-pointer"
                  onClick={() => {
                    setAdjustingItem(item);
                    setNewStock(item.onHand);
                  }}
                >
                  <td className="px-6 py-4 font-bold text-primary-dark">
                    {item.productTitle}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-text-secondary">{item.sku}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                      isOut ? (item.allowBackorder ? 'bg-zinc-200 text-zinc-600' : 'bg-error/10 text-error') :
                      isLow ? 'bg-warning/15 text-warning-dark' :
                      'bg-success/15 text-success-dark'
                    }`}>
                      {isOut ? (item.allowBackorder ? 'Backorder' : 'Out of Stock') : isLow ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">{item.onHand}</td>
                  <td className="px-6 py-4 text-right text-text-secondary">{item.reserved}</td>
                  <td className={`px-6 py-4 text-right font-bold ${isOut && !item.allowBackorder ? 'text-error' : isLow ? 'text-warning-dark' : 'text-primary-dark'}`}>
                    {available}
                  </td>
                  <td className="px-6 py-4 text-right text-text-secondary">{item.incoming}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  const tabs = [
    { id: 'overview', icon: <Package className="w-4 h-4" />, label: 'Stock Overview' },
    { id: 'alerts', icon: <AlertTriangle className="w-4 h-4" />, label: 'Low Stock Alerts' },
    { id: 'po', icon: <FileText className="w-4 h-4" />, label: 'Purchase Orders' },
    { id: 'transfers', icon: <Truck className="w-4 h-4" />, label: 'Transfers' },
    { id: 'adjustments', icon: <RefreshCw className="w-4 h-4" />, label: 'Adjustments' },
    { id: 'locations', icon: <MapPin className="w-4 h-4" />, label: 'Locations' },
    { id: 'suppliers', icon: <Users className="w-4 h-4" />, label: 'Suppliers' },
  ];

  return (
    <div className="w-full animate-in fade-in duration-300 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] text-accent-green font-bold uppercase tracking-widest font-mono">Operations</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark mt-0.5">Inventory</h1>
          <p className="text-xs text-text-secondary mt-1">Multi-location stock, ledger, and purchase orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowTransferModal(true)} className="px-4 py-2 bg-white border border-border text-primary-dark rounded-xl font-bold text-sm hover:bg-zinc-50 shadow-sm transition-all flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            Transfer
          </button>
          <button onClick={() => setShowPOModal(true)} className="px-4 py-2 bg-primary-dark text-white rounded-xl font-bold text-sm hover:bg-primary-hover shadow-sm transition-all flex items-center gap-2">
            <Plus className="w-4 h-4 text-accent-green" />
            Create PO
          </button>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
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
              {tab.id === 'alerts' && stockItems.filter(i => (i.onHand - i.reserved) <= i.threshold).length > 0 && activeTab !== 'alerts' && (
                <span className="ml-auto w-2 h-2 bg-warning rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {(activeTab === 'overview' || activeTab === 'alerts') ? (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-center border-b border-border bg-white p-4 gap-4">
                <h2 className="text-lg font-bold text-primary-dark">
                  {activeTab === 'alerts' ? 'Actionable Alerts' : 'All Tracked Inventory'}
                </h2>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <button onClick={() => setShowFilter(!showFilter)} className="p-2.5 border border-border rounded-xl bg-white text-zinc-500 hover:text-primary-dark hover:border-primary-dark transition-colors">
                      <Filter className="w-4 h-4" />
                    </button>
                    {showFilter && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-xl shadow-lg z-50 p-2 animate-in fade-in">
                        <div className="px-3 py-2 text-[10px] font-bold text-text-secondary uppercase tracking-wider">Inventory Filters</div>
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
                      placeholder="Search SKU or product..." 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-zinc-50 focus:outline-none focus:bg-white focus:border-accent-green text-sm transition-colors"
                    />
                  </div>
                </div>
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center h-64 text-zinc-400 font-semibold">Loading ledger...</div>
              ) : (
                renderOverviewTable()
              )}
            </>
          ) : activeTab === 'po' ? (
            <div className="p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4">Purchase Orders</h2>
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 border-b border-border text-[11px] uppercase tracking-wider text-text-secondary">
                    <tr><th className="px-4 py-3">PO Number</th><th className="px-4 py-3">Supplier</th><th className="px-4 py-3">Expected</th><th className="px-4 py-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold text-primary-dark">PO-1042</td><td className="px-4 py-3 text-text-secondary">Acme Corp</td><td className="px-4 py-3 text-text-secondary">2026-11-15</td><td className="px-4 py-3"><span className="px-2 py-1 bg-warning/15 text-warning-dark text-[10px] font-bold uppercase rounded">Pending</span></td></tr>
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold text-primary-dark">PO-1041</td><td className="px-4 py-3 text-text-secondary">Global Traders</td><td className="px-4 py-3 text-text-secondary">2026-10-28</td><td className="px-4 py-3"><span className="px-2 py-1 bg-success/15 text-success-dark text-[10px] font-bold uppercase rounded">Received</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'transfers' ? (
            <div className="p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4">Stock Transfers</h2>
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 border-b border-border text-[11px] uppercase tracking-wider text-text-secondary">
                    <tr><th className="px-4 py-3">Transfer ID</th><th className="px-4 py-3">Origin</th><th className="px-4 py-3">Destination</th><th className="px-4 py-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold text-primary-dark">TR-001</td><td className="px-4 py-3 text-text-secondary">Main Warehouse</td><td className="px-4 py-3 text-text-secondary">Retail Store A</td><td className="px-4 py-3"><span className="px-2 py-1 bg-info/15 text-info-dark text-[10px] font-bold uppercase rounded">In Transit</span></td></tr>
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold text-primary-dark">TR-002</td><td className="px-4 py-3 text-text-secondary">Retail Store B</td><td className="px-4 py-3 text-text-secondary">Main Warehouse</td><td className="px-4 py-3"><span className="px-2 py-1 bg-success/15 text-success-dark text-[10px] font-bold uppercase rounded">Completed</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'adjustments' ? (
            <div className="p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4">Inventory Adjustments</h2>
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 border-b border-border text-[11px] uppercase tracking-wider text-text-secondary">
                    <tr><th className="px-4 py-3">Item</th><th className="px-4 py-3">Reason</th><th className="px-4 py-3">Change</th><th className="px-4 py-3">Date</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold text-primary-dark">Classic T-Shirt (M)</td><td className="px-4 py-3 text-text-secondary">Damaged Goods</td><td className="px-4 py-3 text-error font-bold">-2</td><td className="px-4 py-3 text-text-secondary">2026-11-01</td></tr>
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold text-primary-dark">Denim Jeans (32)</td><td className="px-4 py-3 text-text-secondary">Cycle Count</td><td className="px-4 py-3 text-success font-bold">+5</td><td className="px-4 py-3 text-text-secondary">2026-10-30</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'locations' ? (
            <div className="p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4">Locations</h2>
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 border-b border-border text-[11px] uppercase tracking-wider text-text-secondary">
                    <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold text-primary-dark">Main Warehouse</td><td className="px-4 py-3 text-text-secondary capitalize">Warehouse</td><td className="px-4 py-3"><span className="px-2 py-1 bg-success/15 text-success-dark text-[10px] font-bold uppercase rounded">Active</span></td></tr>
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold text-primary-dark">Retail Store A</td><td className="px-4 py-3 text-text-secondary capitalize">Retail</td><td className="px-4 py-3"><span className="px-2 py-1 bg-success/15 text-success-dark text-[10px] font-bold uppercase rounded">Active</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === 'suppliers' ? (
            <div className="p-6">
              <h2 className="text-lg font-bold text-primary-dark mb-4">Suppliers</h2>
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 border-b border-border text-[11px] uppercase tracking-wider text-text-secondary">
                    <tr><th className="px-4 py-3">Supplier Name</th><th className="px-4 py-3">Contact</th><th className="px-4 py-3">Lead Time</th><th className="px-4 py-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold text-primary-dark">Acme Corp</td><td className="px-4 py-3 text-text-secondary">john@acme.com</td><td className="px-4 py-3 text-text-secondary">14 days</td><td className="px-4 py-3"><span className="px-2 py-1 bg-success/15 text-success-dark text-[10px] font-bold uppercase rounded">Active</span></td></tr>
                    <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold text-primary-dark">Global Traders</td><td className="px-4 py-3 text-text-secondary">sales@global.com</td><td className="px-4 py-3 text-text-secondary">7 days</td><td className="px-4 py-3"><span className="px-2 py-1 bg-success/15 text-success-dark text-[10px] font-bold uppercase rounded">Active</span></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Create PO Modal */}
      {showPOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border flex justify-between items-center bg-zinc-50">
              <h2 className="font-extrabold text-lg text-primary-dark">Create Purchase Order</h2>
              <button onClick={() => setShowPOModal(false)} className="p-2 bg-white rounded-lg border border-border hover:bg-zinc-100 transition-colors">
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Supplier</label>
                <select className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none">
                  <option>Select a supplier...</option>
                  <option>Acme Corp</option>
                  <option>Global Traders</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Destination Location</label>
                <select className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none">
                  <option>Main Warehouse</option>
                  <option>Retail Store A</option>
                </select>
              </div>
              <div className="p-4 bg-zinc-50 border border-border rounded-xl">
                <p className="text-sm text-text-secondary font-medium">Add products to this PO by searching above in the inventory table, or use the barcode scanner.</p>
              </div>
            </div>
            <div className="p-4 border-t border-border bg-zinc-50 flex justify-end gap-3">
              <button onClick={() => setShowPOModal(false)} className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-primary-dark transition-colors">Cancel</button>
              <button onClick={() => { alert('Purchase order draft created.'); setShowPOModal(false); }} className="px-6 py-2 bg-primary-dark text-white rounded-xl font-bold text-sm shadow-sm hover:bg-primary-hover transition-colors">Create Draft PO</button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border flex justify-between items-center bg-zinc-50">
              <h2 className="font-extrabold text-lg text-primary-dark">Transfer Stock</h2>
              <button onClick={() => setShowTransferModal(false)} className="p-2 bg-white rounded-lg border border-border hover:bg-zinc-100 transition-colors">
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Origin</label>
                  <select className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none">
                    <option>Main Warehouse</option>
                    <option>Retail Store A</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Destination</label>
                  <select className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none">
                    <option>Retail Store A</option>
                    <option>Main Warehouse</option>
                  </select>
                </div>
              </div>
              <div className="p-4 bg-zinc-50 border border-border rounded-xl">
                <p className="text-sm text-text-secondary font-medium">Select items to transfer from the origin location.</p>
              </div>
            </div>
            <div className="p-4 border-t border-border bg-zinc-50 flex justify-end gap-3">
              <button onClick={() => setShowTransferModal(false)} className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-primary-dark transition-colors">Cancel</button>
              <button onClick={() => { alert('Transfer initiated.'); setShowTransferModal(false); }} className="px-6 py-2 bg-primary-dark text-white rounded-xl font-bold text-sm shadow-sm hover:bg-primary-hover transition-colors">Start Transfer</button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex justify-between items-center bg-zinc-50">
              <h2 className="font-extrabold text-lg text-primary-dark">Adjust Stock</h2>
              <button onClick={() => setAdjustingItem(null)} className="p-2 bg-white rounded-lg border border-border hover:bg-zinc-100 transition-colors">
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="font-bold text-primary-dark">{adjustingItem.productTitle}</p>
                <p className="text-sm text-text-secondary">SKU: {adjustingItem.sku}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">New On-Hand Quantity</label>
                <input 
                  type="number" 
                  value={newStock} 
                  onChange={e => setNewStock(Number(e.target.value))} 
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-zinc-50 focus:border-accent-green outline-none font-bold text-lg" 
                />
              </div>
            </div>
            <div className="p-4 border-t border-border bg-zinc-50 flex justify-end gap-3">
              <button onClick={() => setAdjustingItem(null)} className="px-4 py-2 text-sm font-bold text-text-secondary hover:text-primary-dark transition-colors">Cancel</button>
              <button onClick={handleAdjustStock} disabled={updateMut.isPending} className="px-6 py-2 bg-primary-dark text-white rounded-xl font-bold text-sm shadow-sm hover:bg-primary-hover transition-colors disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
