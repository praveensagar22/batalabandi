'use client';

import { useState } from 'react';
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  ShieldCheck,
  Save,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Globe,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState('BatalaBandi');
  const [supportEmail, setSupportEmail] = useState('support@batalabandi.com');
  const [supportPhone, setSupportPhone] = useState('+91 98765 43210');
  const [currency, setCurrency] = useState('INR (₹)');

  // Payment Settings
  const [razorpayKeyId, setRazorpayKeyId] = useState('rzp_test_TOAoM0QDJ1iiw4');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('ENCdcFXYGi4xayYKzBfbKwc5');
  const [paymentTestMode, setPaymentTestMode] = useState(true);

  // Shipping Rules
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('999');
  const [standardShippingFee, setStandardShippingFee] = useState('99');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Store settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-950 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-amber-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-600" />
            <span>Store Settings & Configuration</span>
          </h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Configure payment gateways, shipping rules, and contact information.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-5">
        {/* Store Profile */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100 font-black text-stone-950 uppercase tracking-wider text-xs">
            <Store className="w-4 h-4 text-amber-600" />
            <span>General Store Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Store Currency</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                required
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Customer Support Phone</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                required
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateway (Razorpay) */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2 font-black text-stone-950 uppercase tracking-wider text-xs">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>Razorpay Payment Gateway</span>
            </div>
            <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Test Mode Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Razorpay Key ID</label>
              <input
                type="text"
                value={razorpayKeyId}
                onChange={(e) => setRazorpayKeyId(e.target.value)}
                required
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Razorpay Key Secret</label>
              <input
                type="password"
                value={razorpayKeySecret}
                onChange={(e) => setRazorpayKeySecret(e.target.value)}
                required
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Shipping & Delivery Rules */}
        <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100 font-black text-stone-950 uppercase tracking-wider text-xs">
            <Truck className="w-4 h-4 text-amber-600" />
            <span>Shipping & Delivery Rules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Free Shipping Minimum Amount (₹)</label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                required
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                value={standardShippingFee}
                onChange={(e) => setStandardShippingFee(e.target.value)}
                required
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[#facc15] hover:bg-[#eab308] text-stone-950 font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 active:scale-95"
        >
          <Save className="w-4 h-4" /> Save Store Configuration
        </button>
      </form>
    </div>
  );
}
