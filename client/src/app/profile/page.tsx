'use client';

import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Bell,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wallet2,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import Header from '@/components/Header';
import { getMyOrdersAPI, OrderResponse } from '@/lib/api/orders';

const quickLinks = [
  {
    id: 'orders',
    title: 'Your Orders',
    subtitle: 'View your order history and tracking',
    icon: Package,
    accent: 'from-amber-100 to-orange-100 text-amber-700',
  },
  {
    id: 'help',
    title: 'Help & Support',
    subtitle: 'Reach out for returns, delivery, or product questions',
    icon: CircleHelp,
    accent: 'from-stone-100 to-stone-200 text-stone-700',
  },
];

const accountSections = [
  {
    title: 'Your Information',
    items: [
      { label: 'Your Refunds', icon: Wallet2 },
      { label: 'Profile Settings', icon: UserRound },
      { label: 'Saved Addresses', icon: MapPin },
    ],
  },
  {
    title: 'Other Information',
    items: [
      { label: 'Suggested Products', icon: Sparkles },
      { label: 'Notifications', icon: Bell },
      { label: 'General Info & Privacy', icon: ShieldCheck },
    ],
  },
];

export default function ProfilePage() {
  const userName = 'Aarav Sharma';
  const phoneNumber = '+91 98765 43210';
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getMyOrdersAPI();
        setOrders(data);
      } catch (err) {
        console.warn('Failed to load user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#fefce8] text-stone-900 font-sans">
      <Header activeTab="all" />

      <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 pb-24 pt-4 sm:px-6 sm:pt-6">
        <section className="rounded-[28px] border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#facc15] text-2xl font-black text-stone-900 shadow-sm">
              {userName.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-black tracking-tight">{userName}</h1>
              <p className="mt-1 text-sm text-stone-600">{phoneNumber}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <button
              onClick={() => setShowOrderModal(true)}
              className="rounded-2xl border border-stone-200 bg-stone-50 p-3 text-left hover:border-amber-400 transition"
            >
              <div className="flex items-center justify-between text-sm font-semibold text-stone-700">
                <span className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-[#f59e0b]" />
                  Orders
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-stone-900">
                {loadingOrders ? '...' : orders.length}
              </p>
            </button>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                <Wallet2 className="h-4 w-4 text-[#10b981]" />
                Refunds
              </div>
              <p className="mt-2 text-2xl font-black text-stone-900">0</p>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-700">
                <Bell className="h-4 w-4 text-[#8b5cf6]" />
                Alerts
              </div>
              <p className="mt-2 text-2xl font-black text-stone-900">1</p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          {quickLinks.map(({ id, title, subtitle, icon: Icon, accent }) => (
            <button
              key={title}
              type="button"
              onClick={() => {
                if (id === 'orders') setShowOrderModal(true);
              }}
              className="flex items-center justify-between rounded-[24px] border border-stone-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-stone-900">{title}</p>
                  <p className="text-sm text-stone-500">{subtitle}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-stone-400" />
            </button>
          ))}
        </section>

        {/* Recent Orders List Section */}
        <section className="rounded-[24px] border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              <span>Recent Order History</span>
            </h2>
            <span className="text-xs font-semibold text-stone-500">
              {orders.length} order{orders.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {loadingOrders ? (
            <div className="py-8 text-center text-xs font-semibold text-stone-500">
              Loading order history...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <Package className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs font-bold text-stone-600">No orders placed yet</p>
              <p className="text-[11px] text-stone-400">Your recent order details will show up here</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100 mt-2">
              {orders.map((ord) => (
                <div key={ord._id} className="py-3 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-950">
                        {ord._id.startsWith('BB') ? ord._id : `BB-ORD-${ord._id.slice(-6).toUpperCase()}`}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {ord.orderStatus || 'Processing'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>{new Date(ord.createdAt || Date.now()).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{ord.orderItems?.length || 1} Item(s)</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-stone-900">₹{ord.totalAmount}</p>
                    <span className="text-[10px] font-bold text-stone-500">{ord.paymentMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-3">
          {accountSections.map((section) => (
            <div key={section.title} className="rounded-[24px] border border-stone-200 bg-white p-3 shadow-sm sm:p-4">
              <h2 className="px-2 pb-2 text-sm font-black uppercase tracking-[0.24em] text-stone-500">
                {section.title}
              </h2>

              <div className="space-y-2">
                {section.items.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-stone-100 bg-stone-50 px-3 py-3 text-left transition hover:border-stone-200 hover:bg-stone-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-stone-700 shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-semibold text-stone-800">{label}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-stone-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
