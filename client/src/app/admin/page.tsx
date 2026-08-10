'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { fetchAdminStatsAPI, AdminStatsResponse } from '@/lib/api/admin';

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Delivered: 'bg-green-100 text-green-800 border border-green-200',
    Processing: 'bg-blue-100 text-blue-800 border border-blue-200',
    Shipped: 'bg-amber-100 text-amber-800 border border-amber-200',
    Pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    Cancelled: 'bg-red-100 text-red-800 border border-red-200',
  };
  return map[status] || 'bg-stone-100 text-stone-700';
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminStatsAPI();
      setStats(data);
    } catch (err) {
      console.warn('Failed to load admin stats from server API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const totalSales = stats ? stats.totalSales : 0;
  const totalOrders = stats ? stats.totalOrders : 0;
  const totalProducts = stats ? stats.totalProducts : 0;
  const totalUsers = stats ? stats.totalUsers : 0;

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${totalSales.toLocaleString('en-IN')}`,
      change: 'Real-time sales',
      icon: DollarSign,
      iconBg: 'bg-[#facc15]',
      iconColor: 'text-stone-900',
      changColor: 'text-green-700',
    },
    {
      label: 'Total Orders',
      value: totalOrders.toString(),
      change: 'In database',
      icon: ShoppingBag,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-800',
      changColor: 'text-green-700',
    },
    {
      label: 'Active Products',
      value: totalProducts.toString(),
      change: `In ${stats?.totalCategories || 0} categories`,
      icon: Package,
      iconBg: 'bg-stone-100',
      iconColor: 'text-stone-700',
      changColor: 'text-stone-500',
    },
    {
      label: 'Total Customers',
      value: totalUsers.toString(),
      change: 'Registered accounts',
      icon: Users,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-800',
      changColor: 'text-green-700',
    },
  ];

  const recentOrdersList = stats?.recentOrders || [];
  const lowStockList = stats?.lowStockProducts || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Real-time business metrics & performance stats from MongoDB API.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={loadStats}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-white text-stone-700 text-xs font-semibold rounded-xl transition border border-stone-200 hover:border-stone-300 shadow-xs active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 text-stone-400" />}
            Refresh
          </button>
          <Link
            href="/admin/products/create"
            className="flex items-center gap-2 px-4 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-bold rounded-xl shadow-xs transition active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white border border-stone-100 p-4 sm:p-5 rounded-2xl shadow-xs hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-400">{card.label}</span>
                <div className={`p-2 ${card.iconBg} rounded-xl`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.iconColor}`} />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-stone-950 mt-3 tracking-tight">
                {isLoading ? '...' : card.value}
              </h3>
              <p className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${card.changColor}`}>
                <TrendingUp className="w-3 h-3" /> {card.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white border border-stone-100 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-stone-950">Recent Orders</h2>
              <p className="text-xs text-stone-400">Latest customer purchases</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-stone-700 font-bold hover:text-stone-950 flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-lg transition hover:bg-[#facc15]"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs font-semibold text-stone-500 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto" />
              <p>Fetching real-time orders...</p>
            </div>
          ) : recentOrdersList.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-400 space-y-1">
              <p className="font-bold text-stone-600">No orders found in database</p>
              <p>Customer purchases will show up here live.</p>
            </div>
          ) : (
            <>
              {/* Mobile: Card list */}
              <div className="sm:hidden space-y-3">
                {recentOrdersList.map((order) => (
                  <div
                    key={order._id}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-stone-900">
                        {order._id.startsWith('BB') ? order._id : `BB-${order._id.slice(-6).toUpperCase()}`}
                      </p>
                      <p className="text-[11px] text-stone-500">{order.user?.name || 'Customer'}</p>
                      <p className="text-xs font-extrabold text-stone-950 mt-0.5">₹{order.totalAmount}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBadge(order.orderStatus || 'Pending')}`}>
                        {order.orderStatus || 'Pending'}
                      </span>
                      <p className="text-[10px] text-stone-400 mt-1">
                        {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-100 text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {recentOrdersList.map((order) => (
                      <tr key={order._id} className="hover:bg-yellow-50/40 transition">
                        <td className="py-3 font-bold text-stone-900">
                          {order._id.startsWith('BB') ? order._id : `BB-${order._id.slice(-6).toUpperCase()}`}
                        </td>
                        <td className="py-3 text-stone-600">{order.user?.name || 'Customer'}</td>
                        <td className="py-3 font-extrabold text-stone-950">₹{order.totalAmount}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge(order.orderStatus || 'Pending')}`}>
                            {order.orderStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 text-stone-400">
                          {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-amber-100 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-950">Low Stock Alerts</h2>
              <p className="text-xs text-stone-400">Products needing restock</p>
            </div>
          </div>

          <div className="space-y-3 flex-1">
            {lowStockList.length === 0 ? (
              <div className="py-6 text-center text-xs text-stone-400 font-semibold">
                No low stock alerts right now 👍
              </div>
            ) : (
              lowStockList.map((item) => (
                <div
                  key={item._id}
                  className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900">{item.title}</h4>
                    <p className="text-[10px] text-stone-500 mt-0.5">₹{item.price}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-[10px] font-bold whitespace-nowrap">
                    {item.stock} left
                  </span>
                </div>
              ))
            )}
          </div>

          <Link
            href="/admin/products"
            className="mt-5 w-full py-2.5 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-bold rounded-xl text-center transition block active:scale-95"
          >
            Manage Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
