'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  Copy,
  CheckCircle2,
  Package,
  MapPin,
  User,
  CreditCard,
  CheckSquare,
  Square,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { getOrderByIdAPI, updateAdminOrderStatusAPI, OrderResponse } from '@/lib/api/orders';
import { formatImageUrl } from '@/lib/api/client';

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

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [packedItems, setPackedItems] = useState<Record<number, boolean>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const loadOrder = async () => {
    if (!orderId) return;
    setIsLoading(true);
    try {
      const data = await getOrderByIdAPI(orderId);
      setOrder(data);
    } catch (err) {
      console.warn('Failed to load order details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const updateStatus = async (newStatus: OrderStatus) => {
    if (!order) return;
    try {
      await updateAdminOrderStatusAPI(order._id, newStatus);
      setOrder({ ...order, orderStatus: newStatus });
      showToast(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      showToast('Failed to update status on server');
    }
  };

  const toggleItemPacked = (idx: number) => {
    setPackedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const copyAddressToClipboard = () => {
    if (!order) return;
    const addr = `${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.postalCode || ''}, ${order.shippingAddress?.country || ''}`;
    navigator.clipboard.writeText(addr);
    showToast('Shipping address copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-xs font-bold text-stone-600">Loading Order Details & Packing Slip...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-3 font-sans">
        <h2 className="text-lg font-black text-stone-900">Order Not Found</h2>
        <p className="text-xs text-stone-500">The requested order ID does not exist in the database.</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-bold rounded-xl shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  const displayId = order._id.startsWith('BB') ? order._id : `BB-${order._id.slice(-6).toUpperCase()}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-950 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg border border-amber-400">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-stone-950">{displayId}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${orderStatusStyle[order.orderStatus] || 'bg-stone-100'}`}>
                {order.orderStatus}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Placed on {new Date(order.createdAt || Date.now()).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-stone-950 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-2 transition active:scale-95 shadow-xs"
          >
            <Printer className="w-4 h-4 text-amber-400" /> Print Packing Slip
          </button>
          <button
            onClick={loadOrder}
            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Customer Information */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-black text-stone-900 uppercase tracking-wider text-[10px] pb-2 border-b border-stone-100">
            <User className="w-4 h-4 text-amber-600" />
            <span>Customer Information</span>
          </div>
          <p className="text-sm font-extrabold text-stone-950">{(order.user as any)?.name || 'Customer'}</p>
          <p className="text-stone-500 font-medium">{(order.user as any)?.email || 'Guest Customer'}</p>
          <div className="pt-2 flex items-center justify-between text-xs border-t border-stone-100">
            <span className="font-bold text-stone-400">Payment Status:</span>
            <span className={paymentStyle[order.paymentStatus] || 'text-stone-700 font-bold'}>
              {order.paymentStatus} ({order.paymentMethod})
            </span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-4 space-y-2 shadow-xs relative">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2 font-black text-stone-900 uppercase tracking-wider text-[10px]">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Delivery Address</span>
            </div>
            <button
              onClick={copyAddressToClipboard}
              className="text-[10px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition active:scale-95"
            >
              <Copy className="w-3 h-3" /> Copy Address
            </button>
          </div>
          <p className="text-xs font-bold text-stone-950 leading-relaxed">
            {order.shippingAddress?.address || 'Street Address Not Provided'}
          </p>
          <p className="text-stone-600 font-medium">
            {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
          </p>
          <p className="text-stone-400 text-[10px] font-semibold">{order.shippingAddress?.country}</p>
        </div>
      </div>

      {/* Warehouse Pick & Pack Checklist */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-900">
              <Package className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base font-black text-stone-950">
                Items Pick & Pack Checklist ({order.orderItems?.length || 0})
              </h2>
              <p className="text-xs text-stone-400">
                Tick each checkbox as you verify and pack garments into the parcel box.
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full hidden sm:block">
            {Object.values(packedItems).filter(Boolean).length} / {order.orderItems?.length || 0} Packed
          </span>
        </div>

        <div className="space-y-3">
          {order.orderItems?.map((item: any, idx: number) => {
            const isPacked = !!packedItems[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleItemPacked(idx)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                  isPacked
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button type="button" className="text-stone-400 shrink-0">
                    {isPacked ? (
                      <CheckSquare className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Square className="w-6 h-6 text-stone-300" />
                    )}
                  </button>

                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0">
                    <Image
                      src={formatImageUrl(item.image)}
                      alt={item.title || 'Product'}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <p className={`text-xs sm:text-sm font-bold ${isPacked ? 'line-through text-stone-500' : 'text-stone-950'}`}>
                      {item.title}
                    </p>
                    <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                      Quantity: <span className="font-extrabold text-stone-950">{item.quantity}</span> · Price: ₹{item.price}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-black font-mono text-stone-950">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                  {isPacked && (
                    <span className="block text-[10px] font-bold text-emerald-700 mt-0.5">Packed ✓</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Summary */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-sm font-black text-stone-950">
          <span>Total Order Amount</span>
          <span className="text-lg text-amber-600 font-mono">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Fulfillment Status Management */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-stone-950">Update Fulfillment Status</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Updating the status will immediately reflect on customer's account and send live updates.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button
            onClick={() => updateStatus('Processing')}
            className={`px-4 py-2 rounded-xl font-bold transition text-xs flex-1 sm:flex-none ${
              order.orderStatus === 'Processing'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-800 hover:bg-stone-100'
            }`}
          >
            Mark Packing (Processing)
          </button>
          <button
            onClick={() => updateStatus('Shipped')}
            className={`px-4 py-2 rounded-xl font-bold transition text-xs flex-1 sm:flex-none ${
              order.orderStatus === 'Shipped'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-800 hover:bg-stone-100'
            }`}
          >
            Mark Shipped (Dispatched)
          </button>
          <button
            onClick={() => updateStatus('Delivered')}
            className={`px-4 py-2 rounded-xl font-bold transition text-xs flex-1 sm:flex-none ${
              order.orderStatus === 'Delivered'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-800 hover:bg-stone-100'
            }`}
          >
            Mark Delivered
          </button>
        </div>
      </div>
    </div>
  );
}
