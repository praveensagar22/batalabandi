'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  RefreshCw,
  Loader2,
  Package,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { fetchAdminOrdersAPI, updateAdminOrderStatusAPI, OrderResponse } from '@/lib/api/orders';

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

const orderStatusStyle: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-800 border border-green-200',
  Shipped: 'bg-amber-100 text-amber-800 border border-amber-200',
  Processing: 'bg-blue-100 text-blue-800 border border-blue-200',
  Pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  Cancelled: 'bg-red-100 text-red-800 border border-red-200',
};

const paymentStyle: Record<string, string> = {
  Paid: 'text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200',
  Pending: 'text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200',
  Failed: 'text-red-700 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminOrdersAPI();
      setOrders(data);
    } catch (err) {
      console.warn('Failed to load admin orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      await updateAdminOrderStatusAPI(id, newStatus);
      setOrders(orders.map((o) => (o._id === id ? { ...o, orderStatus: newStatus } : o)));
      showToast(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      showToast('Failed to update status on server');
    }
  };

  const filtered = orders.filter((o) => {
    const displayId = o._id.startsWith('BB') ? o._id : `BB-${o._id.slice(-6).toUpperCase()}`;
    const userStr = typeof o.user === 'object' && o.user ? (o.user as any).name : '';
    return (
      displayId.toLowerCase().includes(search.toLowerCase()) ||
      userStr.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-950 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg border border-amber-400">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            Order Management & Fulfillment
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Click any order to open its full Packing Slip page and update dispatch status.
          </p>
        </div>
        <button
          onClick={loadOrders}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 bg-white text-stone-700 text-xs font-semibold rounded-xl transition border border-stone-200 hover:border-stone-300 shadow-xs active:scale-95 disabled:opacity-50 self-start sm:self-auto"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-stone-400" />}
          Refresh Orders
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-stone-100 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID or customer..."
            className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-500 font-bold">
          <Filter className="w-3.5 h-3.5" /> {filtered.length} order{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-stone-100 p-6 space-y-2 shadow-xs">
          <Loader2 className="w-7 h-7 border-stone-900 animate-spin mx-auto text-amber-500" />
          <p className="text-xs font-bold text-stone-700">Loading Order Records...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-stone-100 p-6 space-y-2 shadow-xs">
          <p className="text-sm font-black text-stone-900">No orders found</p>
          <p className="text-xs text-stone-400">Customer orders placed online will appear here.</p>
        </div>
      ) : (
        <>
          {/* Mobile: Card View */}
          <div className="sm:hidden space-y-3">
            {filtered.map((order) => {
              const displayId = order._id.startsWith('BB') ? order._id : `BB-${order._id.slice(-6).toUpperCase()}`;
              const userName = typeof order.user === 'object' && order.user ? (order.user as any).name : 'Customer';
              return (
                <div key={order._id} className="bg-white border border-stone-100 rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-stone-900">{displayId}</p>
                      <p className="text-xs text-stone-500">{userName}</p>
                      <p className="text-[10px] text-stone-400">
                        {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-stone-950">₹{order.totalAmount}</p>
                      <p className={`text-[10px] mt-0.5 ${paymentStyle[order.paymentStatus] || 'text-stone-600'}`}>
                        {order.paymentStatus} · {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 gap-2">
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="px-3.5 py-1.5 bg-stone-950 hover:bg-black text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 active:scale-95 transition"
                    >
                      <Package className="w-3.5 h-3.5 text-amber-400" /> Open Packing Slip
                    </Link>

                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateStatus(order._id, e.target.value as OrderStatus)}
                      className="bg-stone-100 border border-stone-200 text-stone-800 text-[11px] font-bold rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: Table */}
          <div className="hidden sm:block bg-white border border-stone-100 rounded-2xl p-5 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Order Status</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Packing & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.map((order) => {
                  const displayId = order._id.startsWith('BB') ? order._id : `BB-${order._id.slice(-6).toUpperCase()}`;
                  const userName = typeof order.user === 'object' && order.user ? (order.user as any).name : 'Customer';
                  return (
                    <tr key={order._id} className="hover:bg-yellow-50/40 transition group">
                      <td className="py-3 font-bold text-stone-900">
                        <Link href={`/admin/orders/${order._id}`} className="hover:text-amber-600 hover:underline flex items-center gap-1">
                          <span>{displayId}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                        </Link>
                      </td>
                      <td className="py-3 text-stone-600 font-semibold">{userName}</td>
                      <td className="py-3 text-stone-500 font-medium">
                        {order.orderItems?.length || 0} item{(order.orderItems?.length || 0) !== 1 ? 's' : ''}
                      </td>
                      <td className="py-3 font-extrabold text-stone-950">₹{order.totalAmount}</td>
                      <td className="py-3">
                        <span className={`text-xs ${paymentStyle[order.paymentStatus] || 'text-stone-600'}`}>
                          {order.paymentStatus} ({order.paymentMethod})
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${orderStatusStyle[order.orderStatus] || 'bg-stone-100'}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-stone-400">
                        {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="px-3.5 py-1.5 bg-stone-950 hover:bg-black text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-2xs"
                          >
                            <Package className="w-3.5 h-3.5 text-amber-400" /> Open Packing Slip
                          </Link>

                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateStatus(order._id, e.target.value as OrderStatus)}
                            className="bg-stone-50 border border-stone-200 hover:border-amber-400 text-stone-800 text-[11px] font-bold rounded-lg px-2 py-1.5 focus:outline-none transition cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
