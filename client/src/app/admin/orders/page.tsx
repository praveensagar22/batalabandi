'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
type PaymentStatus = 'Paid' | 'Pending' | 'Failed';

interface OrderRecord {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  date: string;
}

const orderStatusStyle: Record<OrderStatus, string> = {
  Delivered: 'bg-green-100 text-green-800 border border-green-200',
  Shipped: 'bg-amber-100 text-amber-800 border border-amber-200',
  Processing: 'bg-blue-100 text-blue-800 border border-blue-200',
  Pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  Cancelled: 'bg-red-100 text-red-800 border border-red-200',
};

const paymentStyle: Record<PaymentStatus, string> = {
  Paid: 'text-green-700 font-bold',
  Pending: 'text-amber-700 font-bold',
  Failed: 'text-red-700 font-bold',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([
    { id: 'ORD-9021', customer: 'Sarah Jenkins', email: 'sarah@example.com', items: 2, total: '₹2,490', paymentMethod: 'UPI', paymentStatus: 'Paid', orderStatus: 'Delivered', date: '01 Aug 2026' },
    { id: 'ORD-9020', customer: 'Michael Chen', email: 'michael@example.com', items: 1, total: '₹1,299', paymentMethod: 'COD', paymentStatus: 'Pending', orderStatus: 'Processing', date: '01 Aug 2026' },
    { id: 'ORD-9019', customer: 'Priya Sharma', email: 'priya@example.com', items: 3, total: '₹4,500', paymentMethod: 'Card', paymentStatus: 'Paid', orderStatus: 'Shipped', date: '31 Jul 2026' },
    { id: 'ORD-9018', customer: 'Rahul Verma', email: 'rahul@example.com', items: 1, total: '₹899', paymentMethod: 'UPI', paymentStatus: 'Paid', orderStatus: 'Pending', date: '31 Jul 2026' },
  ]);

  const [search, setSearch] = useState('');

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, orderStatus: newStatus } : o)));
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
          Order Management
        </h1>
        <p className="text-sm text-stone-500 mt-0.5">Track, fulfil & update customer orders.</p>
      </div>

      {/* Search */}
      <div className="bg-white border border-stone-100 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-sm">
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
        <div className="flex items-center gap-2 text-xs text-stone-400 font-medium">
          <Filter className="w-3.5 h-3.5" /> {filtered.length} order{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Mobile: Card View */}
      <div className="sm:hidden space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-stone-900">{order.id}</p>
                <p className="text-xs text-stone-500">{order.customer}</p>
                <p className="text-[10px] text-stone-400">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-stone-950">{order.total}</p>
                <p className={`text-[10px] mt-0.5 ${paymentStyle[order.paymentStatus]}`}>
                  {order.paymentStatus} · {order.paymentMethod}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${orderStatusStyle[order.orderStatus]}`}>
                {order.orderStatus}
              </span>
              <select
                value={order.orderStatus}
                onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                className="bg-[#facc15] border border-yellow-300 text-stone-950 text-[10px] font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: Table */}
      <div className="hidden sm:block bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-yellow-50/40 transition">
                  <td className="p-4">
                    <p className="font-bold text-stone-900">{order.id}</p>
                    <p className="text-[10px] text-stone-400">{order.date} · {order.items} item{order.items > 1 ? 's' : ''}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-stone-800">{order.customer}</p>
                    <p className="text-[10px] text-stone-400">{order.email}</p>
                  </td>
                  <td className="p-4 font-extrabold text-stone-950">{order.total}</td>
                  <td className="p-4">
                    <p className="text-stone-600">{order.paymentMethod}</p>
                    <p className={`text-[10px] ${paymentStyle[order.paymentStatus]}`}>
                      {order.paymentStatus}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${orderStatusStyle[order.orderStatus]}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      className="bg-[#facc15] border border-yellow-300 text-stone-950 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
