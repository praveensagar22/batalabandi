'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Ticket,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';

import { BannerItem, CouponItem } from '@/lib/marketing/types';
import { INITIAL_BANNERS, INITIAL_COUPONS } from '@/lib/marketing/mock-data';
import {
  fetchBannersAPI,
  createBannerAPI,
  deleteBannerAPI,
  fetchCouponsAPI,
  createCouponAPI,
  deleteCouponAPI,
} from '@/lib/api/catalog';

import MarketingStatistics from '@/components/admin/marketing/MarketingStatistics';
import BannerFormDrawer from '@/components/admin/marketing/BannerFormDrawer';
import CouponFormModal from '@/components/admin/marketing/CouponFormModal';

export default function MarketingManagementPage() {
  const [banners, setBanners] = useState<BannerItem[]>(INITIAL_BANNERS);
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [activeTab, setActiveTab] = useState<'banners' | 'coupons'>('banners');

  // Modals
  const [isBannerDrawerOpen, setIsBannerDrawerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const fetchedBanners = await fetchBannersAPI();
        if (fetchedBanners && fetchedBanners.length > 0) setBanners(fetchedBanners);

        const fetchedCoupons = await fetchCouponsAPI();
        if (fetchedCoupons && fetchedCoupons.length > 0) setCoupons(fetchedCoupons);
      } catch (err) {
        console.log('Backend marketing API offline, using fallback state.');
      }
    }
    loadData();
  }, []);

  // Banner Handlers
  const handleSaveBanner = async (data: Partial<BannerItem>) => {
    if (editingBanner) {
      const updated = { ...editingBanner, ...data } as BannerItem;
      setBanners((prev) => prev.map((b) => (b.id === editingBanner.id ? updated : b)));
      showToast(`Updated banner "${data.title}".`);
    } else {
      const created = await createBannerAPI(data).catch(() => ({
        ...data,
        id: `ban-${Date.now()}`,
        clicksCount: 0,
      } as BannerItem));

      setBanners((prev) => [created, ...prev]);
      showToast(`Created banner "${created.title}".`);
    }
    setIsBannerDrawerOpen(false);
  };

  const handleDeleteBanner = (id: string) => {
    const b = banners.find((x) => x.id === id);
    setBanners((prev) => prev.filter((x) => x.id !== id));
    deleteBannerAPI(id).catch(() => {});
    showToast(`Deleted banner "${b?.title || ''}".`);
  };

  // Coupon Handlers
  const handleSaveCoupon = async (data: Partial<CouponItem>) => {
    const created = await createCouponAPI(data).catch(() => ({
      ...data,
      id: `coup-${Date.now()}`,
      usedCount: 0,
    } as CouponItem));

    setCoupons((prev) => [created, ...prev]);
    showToast(`Created promo code "${created.code}".`);
    setIsCouponModalOpen(false);
  };

  const handleDeleteCoupon = (id: string) => {
    const c = coupons.find((x) => x.id === id);
    setCoupons((prev) => prev.filter((x) => x.id !== id));
    deleteCouponAPI(id).catch(() => {});
    showToast(`Deleted coupon code "${c?.code || ''}".`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10 font-sans">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-yellow-400/40 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mb-1">
            <Link href="/admin" className="hover:text-stone-900 transition">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500">Marketing</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-bold">Campaigns & Banners</span>
          </nav>

          <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight">
            Marketing & Campaign Management
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure homepage hero graphics, promotional banners, and discount coupon codes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setEditingBanner(null);
              setIsBannerDrawerOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-black rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" /> Add Hero Banner
          </button>

          <button
            onClick={() => setIsCouponModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition shadow-xs"
          >
            <Ticket className="w-4 h-4 text-yellow-400" /> Create Coupon Code
          </button>
        </div>
      </div>

      {/* Statistics */}
      <MarketingStatistics banners={banners} coupons={coupons} />

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-stone-200/80 pb-2">
        <button
          onClick={() => setActiveTab('banners')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
            activeTab === 'banners'
              ? 'bg-stone-950 text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-stone-50'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-yellow-400" /> Promotional Banners ({banners.length})
        </button>

        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
            activeTab === 'coupons'
              ? 'bg-stone-950 text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-stone-50'
          }`}
        >
          <Ticket className="w-4 h-4 text-emerald-400" /> Discount Coupons ({coupons.length})
        </button>
      </div>

      {/* SECTION 1: PROMOTIONAL BANNERS GRID */}
      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition"
            >
              {/* Banner Graphic Preview */}
              <div className="relative w-full aspect-[16/9] bg-stone-900 overflow-hidden group">
                <Image
                  src={b.image}
                  alt={b.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <span className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                  {b.position}
                </span>

                <span
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                    b.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-stone-200 text-stone-700 border-stone-300'
                  }`}
                >
                  {b.status}
                </span>
              </div>

              {/* Info Area */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-stone-900">{b.title}</h3>
                  {b.subtitle && (
                    <p className="text-xs text-stone-500 font-medium line-clamp-2 mt-0.5">{b.subtitle}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-stone-500 font-semibold">
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-mono text-[11px] text-stone-800">{b.targetLink}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingBanner(b);
                        setIsBannerDrawerOpen(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition"
                      title="Edit Banner"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 2: DISCOUNT COUPONS TABLE */}
      {activeTab === 'coupons' && (
        <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden p-4 sm:p-5">
          <div className="overflow-x-auto border border-stone-200/80 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200/80 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3.5">Coupon Code</th>
                  <th className="p-3.5">Terms / Description</th>
                  <th className="p-3.5 text-center">Discount Value</th>
                  <th className="p-3.5 text-center">Min Purchase (₹)</th>
                  <th className="p-3.5 text-center">Used / Limit</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-yellow-50/40 transition">
                    <td className="p-3.5">
                      <span className="px-3 py-1 bg-yellow-400 text-stone-950 font-mono font-black text-xs rounded-xl shadow-2xs">
                        {c.code}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-stone-800">{c.description || '—'}</td>
                    <td className="p-3.5 text-center font-extrabold text-stone-900 font-mono">
                      {c.discountType === 'Percentage'
                        ? `${c.discountValue}% OFF`
                        : c.discountType === 'Flat'
                        ? `₹${c.discountValue} OFF`
                        : 'FREE SHIPPING'}
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-stone-600">
                      ₹{c.minPurchaseAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-center font-mono font-bold text-stone-800">
                      {c.usedCount} / {c.usageLimit}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          c.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-stone-200 text-stone-700 border-stone-300'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(c.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drawers & Modals */}
      <BannerFormDrawer
        isOpen={isBannerDrawerOpen}
        editingBanner={editingBanner}
        onClose={() => setIsBannerDrawerOpen(false)}
        onSave={handleSaveBanner}
      />

      <CouponFormModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        onSave={handleSaveCoupon}
      />
    </div>
  );
}
