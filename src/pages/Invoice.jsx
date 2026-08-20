import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useOrdersList } from '../queries/useOrders';
import { useSettingsContext } from '../context/SettingsContext';

export default function Invoice() {
  const { orderId } = useParams();
  const { data: ordersData, isLoading } = useOrdersList({ pageSize: 1000 });
  const { formatCurrency, formatDate } = useSettingsContext();
  
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (ordersData?.data && orderId) {
      const target = ordersData.data.find(o => String(o.id) === String(orderId) || String(o.orderNumber) === String(orderId));
      if (target) setOrder(target);
    }
  }, [ordersData, orderId]);

  if (isLoading) return <div className="p-10 text-center font-bold">Generating Invoice...</div>;
  if (!order) return <Navigate to="/" />;

  const subtotal = order.items?.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0) || 0;
  const tax = order.tax || 0;
  const total = order.total || 0;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex justify-center font-sans">
      <div className="w-full max-w-3xl bg-white shadow-2xl p-8 md:p-12">
        {/* Header Action (Hidden when printing) */}
        <div className="flex justify-end mb-8 print:hidden">
          <button 
            onClick={() => window.print()}
            className="px-6 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors shadow-md"
          >
            Print / Download PDF
          </button>
        </div>

        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
          <div>
            <div className="text-3xl font-black text-slate-900 tracking-tighter mb-1">
              JOG<span className="text-[#AEE6FF]">&</span>JOY
            </div>
            <p className="text-sm font-semibold text-slate-500">Love is in the wear</p>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-black text-slate-200 uppercase tracking-widest mb-2">Invoice</h1>
            <p className="text-sm font-bold text-slate-800">Order #{order.orderNumber || order.id.substring(0,8).toUpperCase()}</p>
            <p className="text-xs font-semibold text-slate-500">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Billed To</h3>
            <p className="text-sm font-bold text-slate-800 mb-1">{order.shippingAddress?.name || 'Customer'}</p>
            <p className="text-sm font-semibold text-slate-600 mb-1">{order.shippingAddress?.email}</p>
            <p className="text-sm font-semibold text-slate-600 mb-1">{order.shippingAddress?.phone}</p>
          </div>
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Shipping Address</h3>
            <p className="text-sm font-semibold text-slate-600 leading-relaxed">
              {order.shippingAddress?.line1}<br/>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br/>
              {order.shippingAddress?.country || 'India'}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Description</th>
                <th className="py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                <th className="py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Price</th>
                <th className="py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="py-4 pr-4">
                    <p className="text-sm font-bold text-slate-800">{item.titleSnapshot || item.name || 'Product'}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs font-semibold text-slate-500 mt-1">
                        {item.size ? `Size: ${item.size}` : ''} {item.color ? `| Color: ${item.color}` : ''}
                      </p>
                    )}
                  </td>
                  <td className="py-4 px-2 text-center text-sm font-bold text-slate-800">{item.quantity || 1}</td>
                  <td className="py-4 px-2 text-right text-sm font-bold text-slate-800">{formatCurrency(item.price || 0)}</td>
                  <td className="py-4 text-right text-sm font-bold text-slate-800">{formatCurrency((item.price || 0) * (item.quantity || 1))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end border-t-2 border-slate-900 pt-6">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm font-bold text-slate-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between text-sm font-bold text-slate-600">
                <span>Tax (18% GST)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-100 text-center space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thank you for your business!</p>
          <p className="text-[10px] font-semibold text-slate-400">If you have any questions about this invoice, please contact support@jogandjoy.in</p>
        </div>
      </div>
      
      {/* Global Print Styles (Only applied on this page when printing) */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .min-h-screen > div, .min-h-screen > div * { visibility: visible; }
          .min-h-screen > div { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; padding: 0; }
          @page { margin: 0; size: auto; }
        }
      `}} />
    </div>
  );
}
